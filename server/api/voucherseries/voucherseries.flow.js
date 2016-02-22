'use strict'

/**
 * The flow file for the voucherseries route.
 * This is where the dbHandler and requestHandler can communicate
 * and is what the index file can and should have access to.
 */

var _ = require('lodash');
var Promise = require('bluebird');

var dbHandler = require('./voucherseries.dbHandler');
var requestHandler = require('./voucherseries.requestHandler');

/**
 * Fetches and inserts or updates all voucherseries
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
 * Clears the old instance of voucherseries
 * and downloads all from the Fortnox API.
 *
 * WARNING: This drops the old voucherseries table
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
 * Gets all active voucherseries from the database.
 *
 * @return {Promise} -> ([voucherseries])
 */
exports.getAllActive = function () {
    return dbHandler.initializeTable()
        .then(dbHandler.getActive);
};

/**
 * Gets all active voucherseries where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> ([voucherseries])
 */
exports.getActiveSince = function (date) {
    return dbHandler.initializeTable()
        .then(function (res) { return dbHandler.getActiveSince(date); });
};

/**
 * Gets every voucherseries in the database.
 * This also returns historical data.
 *
 * @return {Promise} -> ([voucherseries])
 */
exports.getAll = function () {
    return dbHandler.initializeTable()
        .then(dbHandler.getAll);
}