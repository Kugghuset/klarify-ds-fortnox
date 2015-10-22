'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var request = require('request');
var config = require('../../config/environment/development');
var appState = require('../../app.state');

var fortnoxCustomerUrl = 'https://api.fortnox.se/3/customers/';

/**
 * Formats the date as a string with the following structure:
 * YYYY-MM-DD HH:mm
 * 
 * @param {Date} date
 * @return {String}
 */
function getFormattedDate(date) {
  if (!date) { return ''; } 
  return date.toISOString().replace('T', ' ').split('').slice(0,16).join('');
};

/**
 * Returns the url for the Customer page at *pageNum*.
 * *pageNum* defaults to 1 if it's either undefined, lower than 1 or NaN.
 * *pageNum* should be an integer, but the Fortnox API seems to floor the value.
 * 
 * @param {Number} pageNum - optional
 * @param {Date} lastUpdated - optional
 * @return {String}
 */
function pageUrlFor(pageNum, lastUpdated) {
  if (typeof pageNum != 'undefined' && (!pageNum || isNaN(pageNum) || pageNum < 1)) { pageNum = 1; }
  
  var params = _.filter([
    typeof pageNum != 'undefined' ? 'page=' + pageNum : '',
    lastUpdated ? 'lastmodified=' + getFormattedDate(lastUpdated) : ''
  ]).join('&');
  
  return encodeURI(_.filter([fortnoxCustomerUrl, params]).join('?'));
}

/**
 * Returns a promise of the body of the response.
 * Example response
 * {
 *  MetaInformation: {
 *    {
 *      '@TotalResources': (Number),
 *      '@TotalPages': (Number),
 *      '@CurrentPage': (Number)
 *    }
 *  },
 *  Customers: [(Customers)]
 * }
 * 
 * @param {String} url
 * @return {Promise} -> {Object}
 */
function getPage(url) {
  return new Promise(function (resolve, reject) {
    request.get({
      uri: url, 
      headers: _.extend(
        {},
        config.headers.standard,
        { 'Media-Type': 'application/x-www-form-urlencoded' }
      )
    }, function (err, res, body) {
      if (err) {
        reject(err); // Something went wrong with the request...
      } else {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(err);
        }
      }
    });
  });
}

/**
 * Recursively gets all Customers from Fortnox.
 * 
 * @param {Array} customers - set internally, do not pass in!
 * @param {Number} currentPage - set internally, do not pass in!
 * @param {Number} lastPage - set internally, do not pass in!
 * @return {Promise} -> ([Customer])
 */
exports.getAll = function getAll(customers, currentPage, lastPage) {
  
  // Setup for recursive calls
  if (!customers) {
    customers = [];
    currentPage = 0;
  }

  if (currentPage >= lastPage) {
    // Finished getting all Customers
    return new Promise(function (resolve, reject) {
      
      // Actual return of the function
      appState.setUpdated('CustomerDateUpdated', new Date())
      .then(function () {
        resolve(customers); // This is returned.
      })
      .catch(function (err) {
        reject(err);
      });
    });
  }
  
  currentPage++;
  return getPage(pageUrlFor(currentPage))
  .then(function (res) {
    if ('ErrorInformation' in res) {
      // Reject the because of the error to ensure no infinity loop.
      return new Promise(function (resolve, reject) {
        reject(new Error(res.ErrorInformation.message));
      });
    }
    if (typeof lastPage === 'undefined' && typeof res === 'object' && res.MetaInformation) {
      lastPage = res.MetaInformation['@TotalPages'];
    }
    
    return getAll(customers.concat(res.Customers), currentPage, lastPage)
  });
};

/**
 * Gets all Customers which are updated or created since the last time updated.
 * 
 * @param {Array} customers - set internally, do not pass in!
 * @param {Number} currentPage - set internally, do not pass in!
 * @param {Number} lastPage - set internally, do not pass in!
 * @param {Date} lastUpdated - set internally, do not pass in!
 * @return {Promise} -> ([Customer])
 */
exports.getNewlyModified = function getNewlyModified(customers, currentPage, lastPage, lastUpdated) {

  // Setup for recursive calls
  if (!customers) {
    customers = [];
    currentPage = 0;
  }

  // Check if it's finished
  if (currentPage >= lastPage) {
    return new Promise(function (resolve, reject) {
      // Actual return of the function
      appState.setUpdated('CustomerDateUpdated', new Date())
      .then(function (rs) {
        resolve(customers) // This is the return
      })
      .catch(function (err) {
        reject(err);
      });
    });
  }
  
  return new Promise(function (resolve, reject) {
    // Check if lastUpdated already is defined
    if (typeof lastUpdated !== 'undefined') {
      return resolve(lastUpdated);
    }
    
    // Get lastUpdated from db
    appState.getCurrentState()
    .then(function (currentState) {
      if (currentState[0] !== null && typeof currentState[0] === 'object') {
        resolve(currentState[0].CustomerDateUpdated);
      } else {
        // There is no lastUpdated, but it's not date last updated
        resolve(null);
      }
    })
    .catch(function (err) {
      reject(err);
    });
  })
  .then(function (dateUpdated) {
    lastUpdated = dateUpdated;
    currentPage++;
      
    return getPage(pageUrlFor(currentPage, lastUpdated))
  })
  .then(function (res) {
    if ('ErrorInformation' in res) {
      // Reject the because of the error to ensure no infinity loop.
      return new Promise(function (resolve, reject) {
        reject(new Error(res.ErrorInformation.message));
      });
    }
    
    // Set lastPage if it's undefined
    if (typeof lastPage === 'undefined' && typeof res === 'object' && res.MetaInformation) {
      lastPage = res.MetaInformation['@TotalPages'];
    }
    
    // Recursion!
    return getNewlyModified(customers.concat(res.Customers), currentPage, lastPage, lastUpdated);
  });

};
