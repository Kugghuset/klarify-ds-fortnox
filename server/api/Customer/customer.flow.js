'use strict'

var _ = require('lodash');
var Promise = require('bluebird');

var controller = require('./customer.controller');
var requestHandler = require('./customer.requestHandler');

/**
 * Fetches and inserts or updates all Customers
 * from the Fortnox API which are new or updated since last time.
 * 
 * @return {Promise} -> undefined
 */
exports.getNewlyModified = function () {
  return controller.initializeTable()
  .then(requestHandler.getNewlyModified)
  .then(controller.updateOrInsert);
};

/**
 * Clears the old instance of Customers
 * and downloads all from the Fortnox API.
 * 
 * WARNING: This drops the old Customer table.
 * 
 * @return {Promise} -> undefined
 */
exports.cleanAndDownloadFresh = function () {
  return controller.drop()
  .then(controller.initializeTable)
  .then(requestHandler.getAll)
  .then(controller.insertMany);
}