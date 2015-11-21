'use strict'

/**
 * The flow file for the invoice route.
 * This is where the dbHandler and requestHandler can communicate
 * and is what the index file can and should have access to.
 */

var _ = require('lodash');
var Promise = require('bluebird');

var dbHandler = require('./invoice.dbHandler.js');
var requestHandler = require('./invoice.requestHandler.js');

/**
 * Fetches and inserts or updates all Invoices
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
 * Clears the old instance of Invoices
 * and downloads all from the Fortnox API.
 *
 * WARNING: This drops the old Invoice table
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
 * Gets all active invoices from the database.
 *
 * @return {Promise} -> ([Invoice])
 */
exports.getAllActive = function () {
    return dbHandler.initializeTable()
        .then(dbHandler.getActive);
};

/**
 * Gets all active invoices where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> ([Invoice])
 */
exports.getActiveSince = function (date) {
    return dbHandler.initializeTable()
        .then(function (res) { return dbHandler.getActiveSince(date); });
};

/**
 * Gets every invoice in the database.
 * This also returns historical data.
 *
 * @return {Promise} -> ([Invoice])
 */
exports.getAll = function () {
    return dbHandler.initializeTable()
        .then(dbHandler.getAll);
}