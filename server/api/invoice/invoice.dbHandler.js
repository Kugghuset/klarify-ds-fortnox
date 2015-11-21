'use strict'

/**
 * The database handler for the invoice route.
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
            ? './sql/invoice.temp.initialize.sql'
            : './sql/invoice.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all invoice rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[invoice]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/invoice.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('invoice.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('invoice.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active invoices from the db.
 *
 * @return {Promise} -> {[invoice]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/invoice.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('invoice.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('invoice.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active invoices where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[invoice]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/invoice.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('invoice.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('invoice.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Inserts a new row in the invoice table.
 * If no *invoice* is non-existent or not
 *
 * @param {Object} invoice
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (invoice, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!invoice || typeof invoice !== 'object') {
            // return early if no invoice is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.insertOne ' + invoice.DocumentNumber + ' rejected');
            return reject(new TypeError('Invoice must be of type "object"'));
        }

        var sqlFile = isTemp
            ? './sql/invoice.temp.insertOne.sql'
            : './sql/invoice.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: invoice['@url']
                },
                Balance: {
                    type: sql.FLOAT,
                    val: invoice.Balance
                },
                Booked: {
                    type: sql.BIT,
                    val: invoice.Booked
                },
                Cancelled: {
                    type: sql.BIT,
                    val: invoice.Cancelled
                },
                Currency: {
                    type: sql.NVARCHAR,
                    val: invoice.Currency
                },
                CurrencyRate: {
                    type: sql.FLOAT,
                    val: invoice.CurrencyRate
                },
                CurrencyUnit: {
                    type: sql.FLOAT,
                    val: invoice.CurrencyUnit
                },
                CustomerName: {
                    type: sql.NVARCHAR(1024),
                    val: invoice.CustomerName
                },
                CustomerNumber: {
                    type: sql.NVARCHAR,
                    val: invoice.CustomerName
                },
                DocumentNumber: {
                    type: sql.INT,
                    val: invoice.DocumentNumber
                },
                DueDate: {
                    type: sql.DATE,
                    val: invoice.DueDate
                },
                ExternalInvoiceReference1: {
                    type: sql.NVARCHAR(80),
                    val: invoice.ExternalInvoiceReference1
                },
                ExternalInvoiceReference2: {
                    type: sql.NVARCHAR(80),
                    val: invoice.ExternalInvoiceReference2
                },
                InvoiceDate: {
                    type: sql.DATE,
                    val: invoice.InvoiceDate
                },
                NoxFinans: {
                    type: sql.BIT,
                    val: invoice.NoxFinans
                },
                OCR: {
                    type: sql.NVARCHAR,
                    val: invoice.OCR
                },
                WayOfDelivery: {
                    type: sql.NVARCHAR,
                    val: invoice.WayOfDelivery
                },
                TermsOfPayment: {
                    type: sql.NVARCHAR,
                    val: invoice.TermsOfPayment
                },
                Project: {
                    type: sql.NVARCHAR,
                    val: invoice.Project
                },
                Sent: {
                    type: sql.BIT,
                    val: invoice.Sent
                },
                Total: {
                    type: sql.FLOAT,
                    val: invoice.Total
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.insertOne ' + invoice.DocumentNumber + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.insertOne ' + invoice.DocumentNumber + ' rejected.');
                reject(err);
            });
    });
};
/**
 * Recursively inserts one or many invoices into the invoice table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} invoices ([invoice])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([invoice]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(invoices, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined
    if (!inserted) {
        inserted = [];
        logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.insertMany started.');
    }

    // Return if the recursion is finished.
    if (invoices.length === inserted.length) {
        // SQL INSERTs returns undefined, change this?
        return new Promise(function (resolve, reject) {
            logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.insertMany resolved.');
            resolve(inserted.length);
        });
    }

    var lastInserted = invoices[inserted.length];

    return new Promise(function (resolve, reject) {
        exports.insertOne(lastInserted, isTemp)
            .then(resolve)
            .catch(reject);
    }).then(function (result) {
            return insertMany(invoices, isTemp, inserted.concat([lastInserted]));
        })
        .catch(function (err) {
            return new Promise(function (resolve, reject) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.insertMany rejected.');
                reject(err);
            });
        });
};

/**
 * Updates existing but changed custumers and inserts new invoices
 * into the invoice table.
 *
 * @param {Array} ([Invoice])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(invoices) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(invoices, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/invoice.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('invoice.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('invoice.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Sets a invoice to disabled.
 *
 * @param {Number} invoiceID
 * @return {Promise} -> undefined
 */
exports.disable = function (invoiceID) {
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
 * Drops the invoice table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/invoice.temp.drop.sql'
            : './sql/invoice.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoice.drop rejected');
                reject(err);
            });
    });
};