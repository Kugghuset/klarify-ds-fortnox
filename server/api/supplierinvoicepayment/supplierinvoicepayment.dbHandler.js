'use strict'

/**
 * The database handler for the supplierinvoicepayment route.
 * It is the interface between the T-SQL code and the requests.
 */

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

var logger = require('../../utils/logger.util.js');

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
            ? './sql/supplierinvoicepayment.temp.initialize.sql'
            : './sql/supplierinvoicepayment.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all supplierinvoicepayment rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[supplierinvoicepayment]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplierinvoicepayment.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('supplierinvoicepayment.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplierinvoicepayment.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active supplierinvoicepayments from the db.
 *
 * @return {Promise} -> {[supplierinvoicepayment]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplierinvoicepayment.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('supplierinvoicepayment.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplierinvoicepayment.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active supplierinvoicepayments where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[supplierinvoicepayment]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplierinvoicepayment.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('supplierinvoicepayment.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplierinvoicepayment.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Inserts a new row in the supplierinvoicepayment table.
 * If no *supplierinvoicepayment* is non-existent or not
 *
 * @param {Object} supplierinvoicepayment
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (supplierinvoicepayment, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!supplierinvoicepayment || typeof supplierinvoicepayment !== 'object') {
            // return early if no supplierinvoicepayment is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.insertOne ' + supplierinvoicepayment.Number + ' rejected');
            return reject(new TypeError('Supplierinvoicepayment must be of type "object"'));
        }

        var sqlFile = isTemp
            ? './sql/supplierinvoicepayment.temp.insertOne.sql'
            : './sql/supplierinvoicepayment.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: supplierinvoicepayment['@url']
                },
                Amount: {
                    type: sql.FLOAT,
                    val: supplierinvoicepayment.Amount
                },
                Booked: {
                    type: sql.BIT,
                    val: supplierinvoicepayment.Booked
                },
                Currency: {
                    type: sql.NVARCHAR(3),
                    val: supplierinvoicepayment.Currency
                },
                CurrencyRate: {
                    type: sql.FLOAT,
                    val: supplierinvoicepayment.CurrencyRate
                },
                CurrencyUnit: {
                    type: sql.FLOAT,
                    val: supplierinvoicepayment.CurrencyUnit
                },
                InvoiceNumber: {
                    type: sql.INT,
                    val: supplierinvoicepayment.InvoiceNumber
                },
                Number: {
                    type: sql.INT,
                    val: supplierinvoicepayment.Number
                },
                PaymentDate: {
                    type: sql.DATE,
                    val: supplierinvoicepayment.PaymentDate
                },
                Source: {
                    type: sql.NVARCHAR,
                    val: supplierinvoicepayment.Source
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.insertOne ' + supplierinvoicepayment.Number + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.insertOne ' + supplierinvoicepayment.Number + ' rejected.');
                reject(err);
            });
    });
};
/**
 * Recursively inserts one or many supplierinvoicepayments into the supplierinvoicepayment table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} supplierinvoicepayments ([supplierinvoicepayment])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([supplierinvoicepayment]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(supplierinvoicepayments, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined
    if (!inserted) {
        inserted = [];
        logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.insertMany started.');
    }

    // Return if the recursion is finished.
    if (supplierinvoicepayments.length === inserted.length) {
        // SQL INSERTs returns undefined, change this?
        return new Promise(function (resolve, reject) {
            logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.insertMany resolved.');
            resolve(inserted.length);
        });
    }

    var lastInserted = supplierinvoicepayments[inserted.length];

    return new Promise(function (resolve, reject) {
        exports.insertOne(lastInserted, isTemp)
            .then(resolve)
            .catch(reject);
    }).then(function (result) {
            return insertMany(supplierinvoicepayments, isTemp, inserted.concat([lastInserted]));
        })
        .catch(function (err) {
            return new Promise(function (resolve, reject) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.insertMany rejected.');
                reject(err);
            });
        });
};

/**
 * Updates existing but changed custumers and inserts new supplierinvoicepayments
 * into the supplierinvoicepayment table.
 *
 * @param {Array} ([Supplierinvoicepayment])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(supplierinvoicepayments) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(supplierinvoicepayments, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/supplierinvoicepayment.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('supplierinvoicepayment.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('supplierinvoicepayment.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Sets a supplierinvoicepayment to disabled.
 *
 * @param {Number} supplierinvoicepaymentID
 * @return {Promise} -> undefined
 */
exports.disable = function (supplierinvoicepaymentID) {
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
 * Drops the supplierinvoicepayment table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/supplierinvoicepayment.temp.drop.sql'
            : './sql/supplierinvoicepayment.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoicepayment.drop rejected');
                reject(err);
            });
    });
};