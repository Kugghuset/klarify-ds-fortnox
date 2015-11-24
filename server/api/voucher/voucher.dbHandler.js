'use strict'

/**
 * The database handler for the vouchers route.
 * It is the interface between the T-SQL code and the requests.
 */

var _ = require('lodash');
var sql = require('seriate');
var mssql = require('mssql');
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
            ? './sql/voucher.temp.initialize.sql'
            : './sql/voucher.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all Vouchers rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[vouchers]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/voucher.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('vouchers.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('vouchers.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active vouchers from the db.
 *
 * @return {Promise} -> {[vouchers]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/voucher.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('voucher.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('voucher.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active vouchers where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[vouchers]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/voucher.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('vouchers.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('vouchers.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Recursively inserts one or many vouchers into the vouchers table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} vouchers ([vouchers])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([vouchers]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
/**
 * Inserts a new row in the vouchers table.
 * If no *vouchers* is non-existent or not
 *
 * @param {Object} vouchers
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (vouchers, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!vouchers || typeof vouchers !== 'object') {
            // return early if no vouchers is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.insertOne ' + voucher.VouchersNumber + ' rejected');
            return reject(new TypeError('vouchers must be of type "object"'));
        }
        var sqlFile = isTemp
            ? './sql/voucher.temp.insertOne.sql'
            : './sql/voucher.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: vouchers['@url']
                },
                ReferenceNumber: {
                    type: sql.NVARCHAR,
                    val: vouchers.ReferenceNumber
                },
                ReferenceType: {
                    type: sql.NVARCHAR,
                    val: vouchers.ReferenceType
                },
                VoucherNumber: {
                    type: sql.INT,
                    val: vouchers.VoucherNumber
                },
                VoucherSeries: {
                    type: sql.NVARCHAR,
                    val: vouchers.VoucherSeries
                },
                Year: {
                    type: sql.INT,
                    val: vouchers.Year
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.insertOne ' + voucher.VouchersNumber + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.insertOne ' + voucher.VouchersNumber + ' rejected.');
                reject(err);
            });
    });
};
exports.insertMany = function insertMany(vouchers, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined
    var tableName = isTemp
        ? 'TempVoucher'
        : 'Voucher';
    var table = new mssql.Table(tableName); // or temporary table, e.g. #temptable
    //table.create = true;
    table.columns.add('@url', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('ReferenceNumber', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('ReferenceType', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('VoucherNumber', mssql.Int, {nullable: true});
    table.columns.add('VoucherSeries', mssql.NVarChar(mssql.MAX) , {nullable: true});
    table.columns.add('Year', mssql.Int , {nullable: true});

    //table.rows.add(777, 'test');

    vouchers.forEach(function(voucher){
        table.rows.add(
            voucher['@url'],
            voucher['ReferenceNumber'],
            voucher['ReferenceType'],
            voucher['VoucherNumber'],
            voucher['VoucherSeries'],
            voucher['Year']
        );
    });

    return new Promise(function (resolve, reject) {
        var request = new mssql.Request();
        request.bulk(table, function (err, rowCount) {
            // ... error checks
            if (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucher.insertMany rejected.');
                reject(err);
            }
            else {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucher.insertMany resolved.');
                resolve(rowCount);

            }
        });
    });

    /* if (!inserted) {
         inserted = [];
         logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.insertMany started.');
     }

     // Return if the recursion is finished.
     if (voucherss.length === inserted.length) {
         // SQL INSERTs returns undefined, change this?
         return new Promise(function (resolve, reject) {
             logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.insertMany resolved.');
             resolve(inserted.length);
         });
     }

     var lastInserted = voucherss[inserted.length];
     return new Promise(function (resolve, reject) {
         exports.insertOne(lastInserted, isTemp)
             .then(resolve)
             .catch(reject);
     }).then(function (result) {
             return insertMany(voucherss, isTemp, inserted.concat([lastInserted]));
         })
         .catch(function (err) {
             return new Promise(function (resolve, reject) {
                 logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.insertMany rejected.');
                 reject(err);
             });
         });*/
};

/**
 * Updates existing but changed vouchers and inserts new vouchers
 * into the vouchers table.
 *
 * @param {Array} ([vouchers])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(vouchers) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(vouchers, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/voucher.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('vouchers.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('vouchers.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Drops the vouchers table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/voucher.temp.drop.sql'
            : './sql/voucher.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'vouchers.drop rejected');
                reject(err);
            });
    });
};