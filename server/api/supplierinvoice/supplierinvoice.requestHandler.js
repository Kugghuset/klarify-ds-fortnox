'use strict'

/**
 * The request handler file for the supplierinvoice route.
 * This is where requests to the Fortnox API are made.
 */

var _ = require('lodash');
var Promise = require('bluebird');
var request = require('request');

var config = require('../../config/environment/development');
var appState = require('../../app.state.js');
var util = require('../../utils/fortnox.util.js');
var logger = require('../../utils/logger.util.js');

var fortnoxSupplierinvoiceUrl = 'https://api.fortnox.se/3/supplierinvoices/';

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
 *  Supplierinvoices: [(Supplierinvoices)]
 * }
 *
 * @param {String} url
 * @return {Promise} -> {Object}
 */
function getPage(url) {
  return new Promise(function(resolve, reject) {
    request.get({
      uri: url,
      headers: _.extend(
        {},
        config.headers.standard,
        { 'Media-Type': 'application/x-www-form-urlencoded' }
      )
    }, function(err, res, body) {
      if (err) {
        reject(err); // Something went wrong with the request...
      } else {
        try {
          logger.stream.write('supplierinvoice.getPage ' + url + ' resolved');
          resolve(JSON.parse(body));
        } catch (error) {
          logger.stream.write('supplierinvoice.getPage ' + url + ' rejected');
          reject(err);
        }
      }
    });
  });
}

/**
 * Recursively gets all Supplierinvoices from Fortnox.
 *
 * @param {Array} supplierinvoices - set internally, do not pass in!
 * @param {Number} currentPage - set internally, do not pass in!
 * @param {Number} lastPage - set internally, do not pass in!
 * @return {Promise} -> ([Supplierinvoice])
 */
exports.getAll = function getAll(supplierinvoices, currentPage, lastPage) {

  // Setup for recursive calls
  if (!supplierinvoices) {
    supplierinvoices = [];
    currentPage = 0;
  }

  if (currentPage >= lastPage) {
    // Finished getting all Supplierinvoices
    return new Promise(function(resolve, reject) {

      // Actual return of the function
      appState.setUpdated('SupplierInvoice')
        .then(function() {
          logger.stream.write('supplierinvoice.getAll resolved');
          resolve(supplierinvoices); // This is returned.
        })
        .catch(function(err) {
          logger.stream.write('supplierinvoice.getAll rejected');
          reject(err);
        });
    });
  }

  currentPage++;
  return getPage(util.pageUrlFor(fortnoxSupplierinvoiceUrl, currentPage))
    .then(function(res) {
      if ('ErrorInformation' in res) {
        // Reject the because of the error to ensure no infinity loop.
        return new Promise(function(resolve, reject) {
          reject(new Error(res.ErrorInformation.message));
        });
      }
      if (typeof lastPage === 'undefined' && typeof res === 'object' && res.MetaInformation) {
        lastPage = res.MetaInformation['@TotalPages'];
      }

      return getAll(supplierinvoices.concat(res.SupplierInvoices), currentPage, lastPage)
    });
};

/**
 * Gets all Supplierinvoices which are updated or created since the last time updated.
 *
 * @param {Array} supplierinvoices - set internally, do not pass in!
 * @param {Number} currentPage - set internally, do not pass in!
 * @param {Number} lastPage - set internally, do not pass in!
 * @param {Date} lastUpdated - set internally, do not pass in!
 * @return {Promise} -> ([Supplierinvoices])
 */
exports.getNewlyModified = function getNewlyModified(supplierinvoices, currentPage, lastPage, lastUpdated) {

  // Setup for recursive calls
  if (!supplierinvoices) {
    supplierinvoices = [];
    currentPage = 0;
  }

  // Check if it's finished
  if (currentPage >= lastPage) {
    return new Promise(function(resolve, reject) {
      // Actual return of the function
      appState.setUpdated('Supplierinvoice')
        .then(function(rs) {
          logger.stream.write('supplierinvoice.getNewlyModified (' + lastUpdated + ') resolved');
          resolve(supplierinvoices) // This is the return
        })
        .catch(function(err) {
          logger.stream.write('supplierinvoice.getNewlyModified (' + lastUpdated + ') rejected');
          reject(err);
        });
    });
  }

  return new Promise(function(resolve, reject) {
    // Check if lastUpdated already is defined
    if (typeof lastUpdated !== 'undefined') {
      return resolve(lastUpdated);
    }

    // Get lastUpdated from db
    appState.getCurrentState('SupplierInvoice')
      .then(function(currentState) {
        if (currentState[0] !== null && typeof currentState[0] === 'object') {
          resolve(currentState[0].DateUpdated);
        } else {
          // There is no lastUpdated, but it's not date last updated
          resolve(null);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  })
    .then(function(dateUpdated) {
      lastUpdated = dateUpdated;
      currentPage++;

      return getPage(util.pageUrlFor(fortnoxSupplierinvoiceUrl, currentPage, lastUpdated))
    })
    .then(function(res) {
      if ('ErrorInformation' in res) {
        // Reject the because of the error to ensure no infinity loop.
        return new Promise(function(resolve, reject) {
          reject(new Error(res.ErrorInformation.message));
        });
      }

      // Set lastPage if it's undefined
      if (typeof lastPage === 'undefined' && typeof res === 'object' && res.MetaInformation) {
        lastPage = res.MetaInformation['@TotalPages'];
      }

      console.log(lastUpdated);
      // Recursion!
      return getNewlyModified(supplierinvoices.concat(res.SupplierInvoices), currentPage, lastPage, lastUpdated);
    });

};
