'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

/**
 * Runs the init script for the model,
 * adding the table to the SQL database if it's non-existent.
 * 
 * @return {Promise} -> undefined
 */
exports.initializeTable = function () {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.initialize.sql')
    })
    .then(function (results) {
      resolve(results);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};

/**
 * Gets the top *limit* or all Customer rows.
 * 
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[Customer]}
 */
exports.getFullCustomers = function (limit) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.getFull.sql'),
      params: {
        topNum: {
          type: sql.BIGINT,
          val: 0 < limit ? limit : -1
        }
      }
    })
    .then(function (results) {
      resolve(results);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};

/**
 * 
 * 
 * @param {Object} customer
 * @return {Promise} -> undefined
 */
exports.insertOne = function (customer) {
  return new Promise(function (resolve, reject) {
    if (!customer || typeof customer !== 'object') {
      // return early if no customer is present.
      return reject(new Error('No customer present.'))
    }
    
    sql.execute({
      query: sql.fromFile('./sql/customer.insertOne.sql'),
      params: {
        url: {
          type: sql.NVARCHAR,
          val: customer['@url']
        },
        address1: {
          type: sql.NVARCHAR(1024),
          val: customer.Address1
        },
        address2: {
          type: sql.NVARCHAR(1024),
          val: customer.Address2
        },
        city: {
          type: sql.NVARCHAR(1024),
          val: customer.City
        },
        customerNumber: {
          type: sql.NVARCHAR(1024),
          val: customer.CustomerNumber
        },
        email: {
          type: sql.NVARCHAR(1024),
          val: customer.Email
        },
        name: {
          type: sql.NVARCHAR(1024),
          val: customer.Name
        },
        organisationNumber: {
          type: sql.NVARCHAR(30),
          val: customer.OrganisationNumber
        },
        phone: {
          type: sql.NVARCHAR(1024),
          val: customer.Phone
        },
        zipCode: {
          type: sql.NVARCHAR(10),
          val: customer.ZipCode
        }
      }
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};
