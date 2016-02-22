'use strict'

/**
 * The flow file for the supplier route.
 * This is where the dbHandler and requestHandler can communicate
 * and is what the index file can and should have access to.
 */

var _ = require('lodash');
var Promise = require('bluebird');

var dbHandler = require('./supplier.dbHandler');
var requestHandler = require('./supplier.requestHandler');

/**
 * Fetches and inserts or updates all Suppliers
 * from the Fortnox API which are new or updated since last time.
 *
 * @return {Promise} -> undefined
 */
exports.fetchNewlyModified = function () {
    return dbHandler.initializeTable()
        .then(requestHandler.getNewlyModified)
        .then(dbHandler.updateOrInsert);
};

/**
 * Clears the old instance of Suppliers
 * and downloads all from the Fortnox API.
 *
 * WARNING: This drops the old Supplier table
 * and initializes a completely fresh.
 * This will lose all historical data.
 *
 * @return {Promise} -> undefined
 */
exports.cleanAndFetch = function () {
    return dbHandler.drop()
        .then(dbHandler.initializeTable)
        .then(requestHandler.getAll)
        .then(dbHandler.insertMany);
}

/**
 * Gets all active suppliers from the database.
 *
 * @return {Promise} -> ([Supplier])
 */
exports.getAllActive = function () {
    return dbHandler.initializeTable()
        .then(dbHandler.getActive);
};

/**
 * Gets all active suppliers where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> ([Supplier])
 */
exports.getActiveSince = function (date) {
    return dbHandler.initializeTable()
        .then(function (res) { return dbHandler.getActiveSince(date); });
};

/**
 * Gets every supplier in the database.
 * This also returns historical data.
 *
 * @return {Promise} -> ([Supplier])
 */
exports.getAll = function () {
    return dbHandler.initializeTable()
        .then(dbHandler.getAll);
}