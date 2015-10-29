'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

/**
 * Initializes the table if it's not created.
 * 
 * @param {String} tableName
 * @return {Promise} -> *tableName* (String)
 */
exports.initializeTable = function initializeTable(tableName) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.initializeState.sql').replace(/{{ table_name }}/g, 'State' + tableName)
    })
    .then(function (result) {
      resolve(tableName);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};

/**
 * Initializes all appStates for *tableNames* if needed.
 * 
 * @param {Array} tableNames
 * @return {Promise} -> *tableNames* (Array)
 */
exports.initializeTables = function initializeTables(tableNames) {
  return new Promise(function (resolve, reject) {
    Promise.settle(_.map(tableNames, exports.initializeTable))
    .then(function (promiseResults) {
      resolve(_.map(promiseResults, function (res) {
        return res.value();
      }));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

/**
 * Gets the current state of the Fortnox sprocket.
 * 
 * @param {String} tableName
 * @return {Promise} -> {Object}
 */
exports.getCurrentState = function getCurrentState(tableName) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.getCurrentState.sql').replace(/{{ table_name }}/g, 'State' + tableName)
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
 * @param {String} tableName
 * @param {String} updateMethod - defaults to 'scheduled'
 * @return {Promise} -> undefined
 */
exports.insertState = function insertState(tableName, updateMethod) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.insertState.sql').replace(/{{ table_name }}/g, 'State' + tableName),
      params: {
        updateMethod: {
          type: sql.NVARCHAR(1024),
          val: updateMethod || 'scheduled'
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
 * Gets all app states from the database.
 * 
 * @param {String} tableName
 * @return {Promise} -> ([State])
 */
exports.getAllState = function getAllState(tableName) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.getAllState.sql').replace(/{{ table_name }}/g, 'State' + tableName)
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

/**
 * Either creates a completely new or clones and updates the last state row
 * with *column* set to *value*.
 * 
 * @param {String} tableName
 * @return {Promise} -> *tableName* (String)
 */
exports.setUpdated = function setUpdated(tableName) {
  return new Promise(function (resolve, reject) {
    exports.insertState(tableName)
    .then(function (res) {
      resolve(tableName);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};

/**
 * Drops the StateFortnox table.
 * 
 * ShoUld really never be used?
 * @param {String} tableName
 * @return {Promise} -> *tableName* (String)
 */
exports.dropState = function dropState(tableName) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/app.dropState.sql').replace(/{{ table_name }}/g, 'State' + tableName)
    })
    .then(function (result) {
      resolve(tableName);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};