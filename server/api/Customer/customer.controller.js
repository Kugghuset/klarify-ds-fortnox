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
exports.getCustomers = function (limit) {
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
 * Inserts a new row in the Customer table.
 * If no *customer* is non-existent or not
 * 
 * @param {Object} customer
 * @return {Promise} -> undefined
 */
exports.insertOne = function (customer) {
  return new Promise(function (resolve, reject) {
    if (!customer || typeof customer !== 'object') {
      // return early if no customer is present.
      return reject(new TypeError('Customer must be of type "object"'));
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

/**
 * Inserts one or many customers into the Customer table.
 * 
 * @param {Array} customers ([Customer])
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(customers) {
  return new Promise(function (resolve, reject) {
    
    // Ensure there's anything to put in.
    if (!Array.isArray(customers)) {
      // return early if customers are non-existant
      return reject(new TypeError('customers must be of type Array'))
    } else if (customers.length < 1) {
      // Nothing to input
      return resolve(undefined);
    }
    
    /**
     * Map over *customers* and return a sort of
     * prepared statement for every customer.
     */
    var customerParamStr = _.map(customers, function (customer, i) {
      return '(' 
      + [ '@url' + i
        , '@address1' + i
        , '@address2' + i
        , '@city' + i
        , '@customerNumber' + i
        , '@email' + i
        , '@name' + i
        , '@organisationNumber' + i
        , '@phone' + i
        , '@zipCode' + i
      ].join(', ')
      + ')';
    }).join(', ');

    var customerParamObj = {};
    
    // _.map is used over a for loop, as it behaves sort of like a for loop and a foreach loop at ones.
    _.map(customers, function (customer, i) {
      customerParamObj['url' + i] = {
        type: sql.NVARCHAR,
        val: customer['@url']
      };
      customerParamObj['address1' + i] = {
        type: sql.NVARCHAR(1024),
        val: customer.Address1
      };
      customerParamObj['address2' + i] = {
        type: sql.NVARCHAR(1024),
        val: customer.Address2
      };
      customerParamObj['city' + i] = {
        type: sql.NVARCHAR(1024),
        val: customer.City
      };
      customerParamObj['customerNumber' + i] = {
        type: sql.NVARCHAR(1024),
        val: customer.CustomerNumber
      };
      customerParamObj['email' + i] = {
        type: sql.NVARCHAR(1024),
        val: customer.Email
      };
      customerParamObj['name' + i] = {
        type: sql.NVARCHAR(1024),
        val: customer.Name
      };
      customerParamObj['organisationNumber' + i] = {
        type: sql.NVARCHAR(30),
        val: customer.OrganisationNumber
      };
      customerParamObj['phone' + i] = {
        type: sql.NVARCHAR(1024),
        val: customer.Phone
      };
      customerParamObj['zipCode' + i] = {
        type: sql.NVARCHAR(10),
        val: customer.ZipCode
      };
    });
    
    /**
    * Generate the query by replacing '{{ query_placehodler }}'
    * in the SQL file with the actual values.
    */
    var insertQuery = sql
      .fromFile('./sql/customer.insertMany.sql')
      .replace('{{ query_placeholder }}', customerParamStr);

    sql.execute({
      query: insertQuery,
      params: customerParamObj
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};


exports.removeCustomers = function (params) {

}

/**
 * Drops the Customer table.
 * 
 * Should really never be used?
 */
exports.drop = function () {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.drop.sql')
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};