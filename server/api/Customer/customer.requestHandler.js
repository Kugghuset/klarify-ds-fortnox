'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var request = require('request');
var config = require('../../config/environment/development');

var fortnoxCustomerUrl = 'https://api.fortnox.se/3/customers/?page={pageNum}';

/**
 * Returns the url for the Customer page at *pageNum*.
 * *pageNum* defaults to 1 if it's either undefined, lower than 1 or NaN.
 * *pageNum* should be an integer, but the Fortnox API seems to floor the value.
 * 
 * @param {Number} pageNum - optional
 * @return {String}
 */
function getCustomerPage(pageNum) {
  if (!pageNum || isNaN(pageNum) || pageNum < 1) { pageNum = 1; }
  
  return fortnoxCustomerUrl.replace('{pageNum}', pageNum);
}

/**
 * Recursively gets all Customers from Fortnox.
 * 
 * @param {Array} customers - set recursively, do not pass in!
 * @param {Number} currentPage - set recursively, do not pass in!
 * @param {Number} lastPage - set recursively, do not pass in!
 * @return {Promise} -> ([Customer])
 */
exports.getAll = function getAll(customers, currentPage, lastPage) {
  
  // Setup for recursive calls
  if (!customers) {
    customers = [];
    currentPage = 0;
  }
  
  if (currentPage === lastPage) {
    return new Promise(function (resolve, reject) {
      resolve(customers);
    });
  }
  
  return new Promise(function (resolve, reject) {
    currentPage++;
    
    request.get({
      url: getCustomerPage(currentPage),
      headers: config.headers.standard
    }, function (err, res, body) {
      if (err) {
        reject(err); // Something went wrong with the request...
      } else {
        try {
          var parsedBody = JSON.parse(body);
          
          // Set lastPage to the number of total pages.
          if (typeof lastPage === 'undefined') {
            lastPage = parseInt(parsedBody.MetaInformation['@TotalPages']);
          }
          
          resolve(parsedBody.Customers);
        } catch (error) {
          reject(err);
        }
      }
    });
  })
  .then(function (res) {
    return getAll(customers.concat(res), currentPage, lastPage);
  });
};