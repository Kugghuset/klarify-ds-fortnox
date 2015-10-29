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
exports.fetchNewlyModified = function () {
  return controller.initializeTable()
  .then(requestHandler.getNewlyModified)
  .then(controller.updateOrInsert);
};

/**
 * Clears the old instance of Customers
 * and downloads all from the Fortnox API.
 * 
 * WARNING: This drops the old Customer table
 * and initializes a completely fresh.
 * This will lose all historical data.
 * 
 * @return {Promise} -> undefined
 */
exports.cleanAndFetch = function () {
  return controller.drop()
  .then(controller.initializeTable)
  .then(requestHandler.getAll)
  .then(controller.insertMany);
}

/**
 * Gets all active customers from the database.
 * 
 * @return {Promise} -> ([Customer])
 */
exports.getAllActive = function () {
  return controller.initializeTable()
  .then(controller.getActive);
};

/**
 * Gets all active customers where
 * StartDate is greater than *date*.
 * 
 * @param {Date} date
 * @return {Promise} -> ([Customer])
 */
exports.getActiveSince = function (date) {
  return controller.initializeTable()
  .then(function (res) { return controller.getActiveSince(date); });
};

/**
 * Gets every customer in the database.
 * This also returns historical data.
 * 
 * @return {Promise} -> ([Customer])
 */
exports.getAll = function () {
  return controller.initializeTable()
  .then(controller.getAll);
}