'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var request = require('request');
var config = require('../../config/environment/development');

var fortnoxCustomerUrl = 'https://api.fortnox.se/3/customers';

/**
 * @return {Promise} -> ([Customer])
 */
exports.getAll = function () {
  return new Promise(function (resolve, reject) {
    request.get({
      url: fortnoxCustomerUrl,
      headers: config.headers.standard
    }, function (err, res, body) {
      if (err) {
        // Something went wrong...
        reject(err);
        
      } else {
        // Success!
        try {
          var parsed = JSON.parse(body);
          // Do something about paginated responses?
          
          resolve(parsed.Customers);
        } catch (error) {
          reject(err);
        }
      }
    });
  });
};