'use strict'

/**
 * The flow file for the account route.
 * This is where the dbHandler and requestHandler can communicate
 * and is what the index file can and should have access to.
 */

var _ = require('lodash');
var Promise = require('bluebird');

var dbHandler = require('./account.dbHandler.js');
var requestHandler = require('./account.requestHandler.js');

/**
 * Clears the old instance of Accounts
 * and downloads all from the Fortnox API.
 *
 * WARNING: This drops the old Account table
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
 * Gets every account in the database.
 * This also returns historical data.
 *
 * @return {Promise} -> ([Account])
 */
exports.getAll = function () {
    return dbHandler.initializeTable()
        .then(dbHandler.getAll);
}