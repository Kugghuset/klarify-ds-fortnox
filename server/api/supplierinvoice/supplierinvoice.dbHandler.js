'use strict'

/**
 * The database handler for the supplierinvoice route.
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
            ? './sql/supplierinvoice.temp.initialize.sql'
            : './sql/supplierinvoice.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all supplierinvoice rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[supplierinvoice]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplierinvoice.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('supplierinvoice.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplierinvoice.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active supplierinvoices from the db.
 *
 * @return {Promise} -> {[supplierinvoice]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplierinvoice.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('supplierinvoice.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplierinvoice.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active supplierinvoices where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[supplierinvoice]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplierinvoice.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('supplierinvoice.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('supplierinvoice.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Inserts a new row in the supplierinvoice table.
 * If no *supplierinvoice* is non-existent or not
 *
 * @param {Object} supplierinvoice
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (supplierinvoice, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!supplierinvoice || typeof supplierinvoice !== 'object') {
            // return early if no supplierinvoice is present.
            console.log("!!!!!!!")
            logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertOne ' + supplierinvoice.GivenNumber + ' rejected');
            return reject(new TypeError('Supplierinvoice must be of type "object"'));
        }

        var sqlFile = isTemp
            ? './sql/supplierinvoice.temp.insertOne.sql'
            : './sql/supplierinvoice.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: supplierinvoice['@url']
                },
                Balance: {
                    type: sql.NVARCHAR,
                    val: supplierinvoice.Balance
                },
                Booked: {
                    type: sql.BIT,
                    val: supplierinvoice.Booked
                },
                Cancel: {
                    type: sql.BIT,
                    val: supplierinvoice.Cancel
                },
                DueDate: {
                    type: sql.DATE,
                    val: supplierinvoice.DueDate
                },
                GivenNumber: {
                    type: sql.INT,
                    val: supplierinvoice.GivenNumber
                },
                InvoiceDate: {
                    type: sql.DATE,
                    val: supplierinvoice.InvoiceDate
                },
                InvoiceNumber: {
                    type: sql.BIGINT,
                    val: supplierinvoice.InvoiceNumber
                },
                SupplierNumber: {
                    type: sql.NVARCHAR,
                    val: supplierinvoice.SupplierNumber
                },
                SupplierName: {
                    type: sql.NVARCHAR,
                    val: supplierinvoice.SupplierName
                },
                Total: {
                    type: sql.INT,
                    val: supplierinvoice.Total
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertOne ' + supplierinvoice.GivenNumber + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                console.log("here")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertOne ' + supplierinvoice.InvoiceNumber + ' rejected.');
                reject(err);
            });
    });
};
/**
 * Recursively inserts one or many supplierinvoices into the supplierinvoice table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} supplierinvoices ([supplierinvoice])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([supplierinvoice]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(supplierinvoices, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined

    var tableName = isTemp
        ? 'TempSupplierInvoice'
        : 'SupplierInvoice';
    var table = new mssql.Table(tableName); // or temporary table, e.g. #temptable
    //table.create = true;
    table.columns.add('@url', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('Balance', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('Booked', mssql.Bit, {nullable: true});
    table.columns.add('Cancel', mssql.Bit, {nullable: true});
    table.columns.add('DueDate', mssql.DateTime2 , {nullable: true});
    table.columns.add('GivenNumber', mssql.Int , {nullable: true});
    table.columns.add('InvoiceDate', mssql.DateTime2 , {nullable: true});
    table.columns.add('InvoiceNumber', mssql.BigInt , {nullable: true});
    table.columns.add('SupplierNumber', mssql.NVarChar(mssql.MAX) , {nullable: false});
    table.columns.add('SupplierName', mssql.NVarChar(mssql.MAX) , {nullable: true});
    table.columns.add('Total', mssql.Int, {nullable: true});

    //table.rows.add(777, 'test');

    supplierinvoices.forEach(function(supplierinvoice){
        table.rows.add(
            supplierinvoice['@url'],
            supplierinvoice['Balance'],
            supplierinvoice['Booked'],
            supplierinvoice['Cancel'],
            supplierinvoice['DueDate'],
            supplierinvoice['GivenNumber'],
            supplierinvoice['InvoiceDate'],
            supplierinvoice['InvoiceNumber'],
            supplierinvoice['SupplierNumber'],
            supplierinvoice['SupplierName'],
            supplierinvoice['Total']
        );
    });

    return new Promise(function (resolve, reject) {
        var request = new mssql.Request();
        request.bulk(table, function (err, rowCount) {
            // ... error checks
            if (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertMany rejected.');
                reject(err);
            }
            else {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertMany resolved.');
                resolve(rowCount);

            }
        });
    });

    /*  if (!inserted) {
          inserted = [];
          logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertMany started.');
      }

      // Return if the recursion is finished.
      if (supplierinvoices.length === inserted.length) {
          // SQL INSERTs returns undefined, change this?
          return new Promise(function (resolve, reject) {
              logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertMany resolved.');
              resolve(inserted.length);
          });
      }

      var lastInserted = supplierinvoices[inserted.length];

      return new Promise(function (resolve, reject) {
          exports.insertOne(lastInserted, isTemp)
              .then(resolve)
              .catch(reject);
      }).then(function (result) {
              return insertMany(supplierinvoices, isTemp, inserted.concat([lastInserted]));
          })
          .catch(function (err) {
              return new Promise(function (resolve, reject) {
                  logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.insertMany rejected.');
                  reject(err);
              });
          });*/
};

/**
 * Updates existing but changed custumers and inserts new supplierinvoices
 * into the supplierinvoice table.
 *
 * @param {Array} ([Supplierinvoice])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(supplierinvoices) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(supplierinvoices, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/supplierinvoice.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('supplierinvoice.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('supplierinvoice.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Sets a supplierinvoice to disabled.
 *
 * @param {Number} supplierinvoiceID
 * @return {Promise} -> undefined
 */
exports.disable = function (supplierinvoiceID) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/supplierinvoice.disabledByID.sql'),
            params: {
                supplierinvoiceID: {
                    type: sql.BIGINT,
                    val: supplierinvoiceID
                }
            }
        })
            .then(function (result) {
                logger.stream.write('supplierinvoice.disable ' + supplierinvoiceID + ' resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write('supplierinvoice.disable ' + supplierinvoiceID + ' rejected');
                reject(err);
            });
    });
}

/**
 * Drops the supplierinvoice table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/supplierinvoice.temp.drop.sql'
            : './sql/supplierinvoice.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'supplierinvoice.drop rejected');
                reject(err);
            });
    });
};