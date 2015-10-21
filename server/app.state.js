'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

/**
 * Initializes the table if it's not created.
 * 
 * @return {Promise} -> undefined
 */
exports.initializeTable = function initializeTable() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.initializeState.sql')
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};

/**
 * Gets the current state of the Fortnox sprocket.
 * 
 * @return {Promise} -> {Object}
 */
exports.getState = function getState() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.getState.sql')
    })
    .then(function (result) {
      resolve(result)
    })
    .catch(function (err) {
      reject(err);
    });
  });
};

/**
 * Inserts a new row into the StateFortnox array.
 * 
 * @param {Object} row
 * @return {Promise} -> undefined
 */
exports.insertState = function insertState(row) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.insertState.sql'), 
      params: {
        customerDateUpdated: {
          type: sql.DATETIME2,
          val: row.CustomerDateUpdated
        }
      }
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    })
  });
}

/**
 * Either creates a completely new or clones and updates the last state row
 * with *column* set to *value*.
 * 
 * @param {String} column
 * @param {Any} value
 * @return {Promise} -> undefined
 */
exports.setUpdated = function setUpdated(column, value) {
  return new Promise(function (resolve, reject) {
    exports.getState()
    .then(function (val) {
      return new Promise(function (resolve, reject) {
        var row = {};
        
        // Check if there is an array with value(s)
        if (Array.isArray(val) && !!val.length) {
          // There is a value which we'll use and 'clone'
          row = val[val.length - 1];
          // Set the column of which we want to update
          row[column] = value;
        } else {
          // Set the column of which we want to update
          row[column] = value;
        }
        
        resolve(row);
      });
    })
    .then(exports.insertState)
    .then(function (res) {
      resolve(res);
    })
    .catch(function (err) {
      reject(err);
    })
    
  });
}

/**
 * Drops the StateFortnox table.
 * 
 * ShoUld really never be used?
 * @return {Promise} -> undefined
 */
exports.dropState = function dropState() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('.sql/app.dropState.sql')
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
}