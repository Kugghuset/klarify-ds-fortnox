'use strict'

/**
 * The database handler for the invoicepayment route.
 * It is the interface between the T-SQL code and the requests.
 */

var _ = require('lodash');
var sql = require('seriate');
var mssql = require('mssql');
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
            ? './sql/invoicepayment.temp.initialize.sql'
            : './sql/invoicepayment.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all invoicepayment rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[invoicepayment]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/invoicepayment.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('invoicepayment.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('invoicepayment.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active invoicepayments from the db.
 *
 * @return {Promise} -> {[invoicepayment]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/invoicepayment.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('invoicepayment.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('invoicepayment.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active invoicepayments where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[invoicepayment]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/invoicepayment.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('invoicepayment.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('invoicepayment.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Inserts a new row in the invoicepayment table.
 * If no *invoicepayment* is non-existent or not
 *
 * @param {Object} invoicepayment
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (invoicepayment, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!invoicepayment || typeof invoicepayment !== 'object') {
            // return early if no invoicepayment is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertOne ' + invoicepayment.InvoiceNumber + ' rejected');
            return reject(new TypeError('Invoicepayment must be of type "object"'));
        }

        var sqlFile = isTemp
            ? './sql/invoicepayment.temp.insertOne.sql'
            : './sql/invoicepayment.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: invoicepayment['@url']
                },
                Amount: {
                    type: sql.FLOAT,
                    val: invoicepayment.Amount
                },
                Booked: {
                    type: sql.BIT,
                    val: invoicepayment.Booked
                },
                Currency: {
                    type: sql.NVARCHAR(3),
                    val: invoicepayment.Currency
                },
                CurrencyRate: {
                    type: sql.FLOAT,
                    val: invoicepayment.CurrencyRate
                },
                CurrencyUnit: {
                    type: sql.FLOAT,
                    val: invoicepayment.CurrencyUnit
                },
                InvoiceNumber: {
                    type: sql.INT,
                    val: invoicepayment.InvoiceNumber
                },
                Number: {
                    type: sql.INT,
                    val: invoicepayment.Number
                },
                PaymentDate: {
                    type: sql.DATE,
                    val: invoicepayment.PaymentDate
                },
                Source: {
                    type: sql.NVARCHAR,
                    val: invoicepayment.Source
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertOne ' + invoicepayment.InvoiceNumber + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertOne ' + invoicepayment.InvoiceNumber + ' rejected.');
                reject(err);
            });
    });
};
/**
 * Recursively inserts one or many invoicepayments into the invoicepayment table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} invoicepayments ([invoicepayment])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([invoicepayment]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(invoicepayments, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined
    var tableName = isTemp
        ? 'TempInvoicePayment'
        : 'InvoicePayment';
    var table = new mssql.Table(tableName); // or temporary table, e.g. #temptable
    //table.create = true;
    table.columns.add('@url', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('Amount', mssql.Float, {nullable: false});
    table.columns.add('Booked', mssql.Bit, {nullable: true});
    table.columns.add('Currency', mssql.NVarChar(3), {nullable: true});
    table.columns.add('CurrencyRate', mssql.Float, {nullable: true});
    table.columns.add('CurrencyUnit', mssql.Float, {nullable: true});
    table.columns.add('InvoiceNumber', mssql.Int, {nullable: false});
    table.columns.add('Number', mssql.Int, {nullable: true});
    table.columns.add('PaymentDate', mssql.DateTime2, {nullable: true});
    table.columns.add('Source', mssql.NVarChar(mssql.MAX), {nullable: true});


    //table.rows.add(777, 'test');

    invoicepayments.forEach(function(invoicepayment){
        table.rows.add(
            invoicepayment['@url'],
            invoicepayment['Amount'],
            invoicepayment['Booked'],
            invoicepayment['Currency'],
            invoicepayment['CurrencyRate'],
            invoicepayment['CurrencyUnit'],
            invoicepayment['InvoiceNumber'],
            invoicepayment['Number'],
            invoicepayment['PaymentDate'],
            invoicepayment['Source']
        );
    });

    return new Promise(function (resolve, reject) {
        var request = new mssql.Request();
        request.bulk(table, function (err, rowCount) {
            // ... error checks
            if (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertMany rejected.');
                reject(err);
            }
            else {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertMany resolved.');
                resolve(rowCount);

            }
        });
    });


    /*  if (!inserted) {
          inserted = [];
          logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertMany started.');
      }

      // Return if the recursion is finished.
      if (invoicepayments.length === inserted.length) {
          // SQL INSERTs returns undefined, change this?
          return new Promise(function (resolve, reject) {
              logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertMany resolved.');
              resolve(inserted.length);
          });
      }

      var lastInserted = invoicepayments[inserted.length];

      return new Promise(function (resolve, reject) {
          exports.insertOne(lastInserted, isTemp)
              .then(resolve)
              .catch(reject);
      }).then(function (result) {
              return insertMany(invoicepayments, isTemp, inserted.concat([lastInserted]));
          })
          .catch(function (err) {
              return new Promise(function (resolve, reject) {
                  logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.insertMany rejected.');
                  reject(err);
              });
          });*/
};

/**
 * Updates existing but changed custumers and inserts new invoicepayments
 * into the invoicepayment table.
 *
 * @param {Array} ([Invoicepayment])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(invoicepayments) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(invoicepayments, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/invoicepayment.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('invoicepayment.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('invoicepayment.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Sets a invoicepayment to disabled.
 *
 * @param {Number} invoicepaymentID
 * @return {Promise} -> undefined
 */
exports.disable = function (invoicepaymentID) {
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
 * Drops the invoicepayment table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/invoicepayment.temp.drop.sql'
            : './sql/invoicepayment.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'invoicepayment.drop rejected');
                reject(err);
            });
    });
};