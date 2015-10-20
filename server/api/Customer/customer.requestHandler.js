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
 * Gets all Customers from Fortnox.
 * 
 * NOTE: Does not handle paginated requests,
 * thus can only request the 100 first Customers.
 * 
 * @return {Promise} -> ([Customer])
 */
exports.getAll = function () {
  return new Promise(function (resolve, reject) {
    request.get({
      url: getCustomerPage(1),
      headers: config.headers.standard
    }, function (err, res, body) {
      if (err) {
        // Something went wrong...
        reject(err);
        
      } else {
        // Success!
        try {
          var parsed = JSON.parse(body);
          // TODO: handle paginated response
          
          resolve(parsed.Customers);
        } catch (error) {
          reject(err);
        }
      }
    });
  });
};