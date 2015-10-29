'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

/**
 * Runs the init script for the model,
 * adding the table to the SQL database if it's non-existent.
 * 
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.initializeTable = function (isTemp) {
  return new Promise(function (resolve, reject) {
    
    var sqlFile = isTemp
      ? './sql/customer.temp.initialize.sql'
      : './sql/customer.initialize.sql';
    
    sql.execute({
      query: sql.fromFile(sqlFile)
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
 * Gets all active customers from the db.
 * 
 * @return {Promise} -> {[Customer]}
 */
exports.getActive = function () {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.getActive.sql')
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
 * Gets all active customers where
 * StartDate is greater than *date*.
 * 
 * @param {Date} date
 * @return {Promise} -> {[Customer]}
 */
exports.getActiveSince = function (date) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.getActiveSince.sql'),
      params: {
        dateSince: {
          type: sql.DATETIME2,
          val: date
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
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (customer, isTemp) {
  return new Promise(function (resolve, reject) {
    if (!customer || typeof customer !== 'object') {
      // return early if no customer is present.
      return reject(new TypeError('Customer must be of type "object"'));
    }
    
    var sqlFile = isTemp 
      ? './sql/customer.temp.insertOne.sql' 
      : './sql/customer.insertOne.sql';
    
    sql.execute({
      query: sql.fromFile(sqlFile),
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
 * Recursively inserts one or many customers into the Customer table.
 * This is achieved by inserting them one by one.
 * 
 * @param {Array} customers ([Customer])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([Customer]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(customers, isTemp, inserted) {
  // Set *inserted* to an empty array if it's undefined
  if (!inserted) { inserted = []; }
  
    // Return if the recursion is finished.
    if (customers.length === inserted.length) {
      // SQL INSERTs returns undefined, change this?
      return new Promise(function (resolve, reject) {
        resolve(inserted.length);
      });
    }
    
    var lastInserted = customers[inserted.length];
    
    return new Promise(function (resolve, reject) {
      exports.insertOne(lastInserted, isTemp)
      .then(resolve)
      .catch(reject);
    })
    .then(function (result) {
      return insertMany(customers, isTemp, inserted.concat([lastInserted]));
    });
};

/**
 * Updates existing but changed custumers and inserts new customers
 * into the customer table.
 * 
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(customers) {
  return new Promise(function (resolve, reject) {
    new Promise(function (resolve, reject) {
      exports.initializeTable(true)
      .then(function () {
        
        exports.insertMany(customers, true)
        .then(resolve);
      })
      .catch(reject);
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        sql.execute({
          query: sql.fromFile('./sql/customer.merge.sql')
        })
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          reject(err);
        });
      });
    })
    .then(function () {
      resolve('');
      exports.drop(true)
      .then(resolve);
    });
    
  });
}

/**
 * Sets a customer to disabled.
 * 
 * @param {Number} customerID
 * @return {Promise} -> undefined
 */
exports.disable = function (customerID) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.disabledByID.sql'),
      params: {
        customerID: {
          type: sql.BIGINT,
          val: customerID
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
}

/**
 * Drops the Customer table.
 * Should really never be used?
 * 
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
  return new Promise(function (resolve, reject) {
    
    var sqlFile = isTemp
      ? './sql/customer.temp.drop.sql'
      : './sql/customer.drop.sql';
    
    sql.execute({
      query: sql.fromFile(sqlFile)
    })
    .then(function (result) {
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
};