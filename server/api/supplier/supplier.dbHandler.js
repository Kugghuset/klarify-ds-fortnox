'use strict'

/**
 * The database handler for the supplier route.
 * It is the interface between the T-SQL code and the requests.
 */

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

var logger = require('../../utils/logger.util');

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
            ? './sql/supplier.temp.initialize.sql'
            : './sql/supplier.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all Supplier rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[Supplier]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplier.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('supplier.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplier.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active Suppliers from the db.
 *
 * @return {Promise} -> {[Supplier]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplier.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('supplier.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplier.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active suppliers where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[Supplier]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplier.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('supplier.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplier.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Inserts a new row in the Supplier table.
 * If no *supplier* is non-existent or not
 *
 * @param {Object} supplier
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (supplier, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!supplier || typeof supplier !== 'object') {
            // return early if no supplier is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.insertOne ' + supplier.SupplierNumber + ' rejected');
            return reject(new TypeError('Supplier must be of type "object"'));
        }

        var sqlFile = isTemp
            ? './sql/supplier.temp.insertOne.sql'
            : './sql/supplier.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: supplier['@url']
                },
                City: {
                    type: sql.NVARCHAR(1024),
                    val: supplier.City
                },
                Email: {
                    type: sql.NVARCHAR(1024),
                    val: supplier.Email
                },
                Name: {
                    type: sql.NVARCHAR(1024),
                    val: supplier.Name
                },
                OrganisationNumber: {
                    type: sql.NVARCHAR(1024),
                    val: supplier.OrganisationNumber
                },
                Phone: {
                    type: sql.NVARCHAR(1024),
                    val: supplier.Phone
                },
                SupplierNumber: {
                    type: sql.NVARCHAR,
                    val: supplier.SupplierNumber
                },
                ZipCode: {
                    type: sql.NVARCHAR(10),
                    val: supplier.ZipCode
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.insertOne ' + supplier.SupplierNumber + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.insertOne ' + supplier.SupplierNumber + ' rejected.');
                reject(err);
            });
    });
};
/**
 * Recursively inserts one or many suppliers into the Supplier table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} suppliers ([Supplier])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([Supplier]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(suppliers, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined
    if (!inserted) {
        inserted = [];
        logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.insertMany started.');
    }

    // Return if the recursion is finished.
    if (suppliers.length === inserted.length) {
        // SQL INSERTs returns undefined, change this?
        return new Promise(function (resolve, reject) {
            logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.insertMany resolved.');
            resolve(inserted.length);
        });
    }

    var lastInserted = suppliers[inserted.length];

    return new Promise(function (resolve, reject) {
        exports.insertOne(lastInserted, isTemp)
            .then(resolve)
            .catch(reject);
    }).then(function (result) {
            return insertMany(suppliers, isTemp, inserted.concat([lastInserted]));
        })
        .catch(function (err) {
            return new Promise(function (resolve, reject) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.insertMany rejected.');
                reject(err);
            });
        });
};

/**
 * Updates existing but changed custumers and inserts new suppliers
 * into the supplier table.
 *
 * @param {Array} ([Supplier])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(suppliers) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(suppliers, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/supplier.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('supplier.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('supplier.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Sets a supplier to disabled.
 *
 * @param {Number} supplierID
 * @return {Promise} -> undefined
 */
exports.disable = function (supplierID) {
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
                logger.stream.write('customer.disable ' + customerID + ' resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write('customer.disable ' + customerID + ' rejected');
                reject(err);
            });
    });
}

/**
 * Drops the Supplier table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/supplier.temp.drop.sql'
            : './sql/supplier.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplier.drop rejected');
                reject(err);
            });
    });
};