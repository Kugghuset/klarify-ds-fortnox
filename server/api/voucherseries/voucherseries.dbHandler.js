'use strict'

/**
 * The database handler for the voucherseries route.
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
            ? './sql/voucherseries.temp.initialize.sql'
            : './sql/voucherseries.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all Voucherseries rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[voucherseries]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/voucherseries.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('voucherseries.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('voucherseries.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active voucherseries from the db.
 *
 * @return {Promise} -> {[voucherseries]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/voucherseries.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('voucherseries.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('voucherseries.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active voucherseries where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[voucherseries]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/voucherseries.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('voucherseries.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('voucherseries.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Recursively inserts one or many voucherseries into the voucherseries table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} voucherseries ([voucherseries])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([voucherseries]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
/**
 * Inserts a new row in the voucherseries table.
 * If no *voucherseries* is non-existent or not
 *
 * @param {Object} voucherseries
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (voucherseries, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!voucherseries || typeof voucherseries !== 'object') {
            // return early if no voucherseries is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertOne ' + voucherseries.Code + ' rejected');
            return reject(new TypeError('voucherseries must be of type "object"'));
        }
        var sqlFile = isTemp
            ? './sql/voucherseries.temp.insertOne.sql'
            : './sql/voucherseries.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: voucherseries['@url']
                },
                Code: {
                    type: sql.NVARCHAR,
                    val: voucherseries.Code
                },
                Description: {
                    type: sql.NVARCHAR,
                    val: voucherseries.Description
                },
                Manual: {
                    type: sql.BIT,
                    val: voucherseries.Manual
                },
                NextVoucherNumber: {
                    type: sql.INT,
                    val: voucherseries.NextVoucherNumber
                },
                Year: {
                    type: sql.INT,
                    val: voucherseries.Year
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertOne ' + voucherseries.Code + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertOne ' + voucherseries.Code + ' rejected.');
                reject(err);
            });
    });
};
exports.insertMany = function insertMany(voucherseries, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined
    var tableName = isTemp
        ? 'TempVoucherseries'
        : 'Voucherseries';
    var table = new mssql.Table(tableName); // or temporary table, e.g. #temptable
    //table.create = true;
    table.columns.add('@url', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('Code', mssql.NVarChar(mssql.MAX), {nullable: false});
    table.columns.add('Description', mssql.NVarChar(mssql.MAX), {nullable: false});
    table.columns.add('Manual', mssql.Bit, {nullable: true});
    table.columns.add('NextVoucherNumber', mssql.Int, {nullable: true});
    table.columns.add('Year', mssql.Int, {nullable: true});

    //table.rows.add(777, 'test');

    voucherseries.forEach(function(vs){
        table.rows.add(
            vs['@url'],
            vs['Code'],
            vs['Description'],
            vs['Manual'],
            vs['NextVoucherNumber'],
            vs['Year']
        );
    });

    return new Promise(function (resolve, reject) {
        var request = new mssql.Request();
        request.bulk(table, function (err, rowCount) {
            // ... error checks
            if (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertMany rejected.');
                reject(err);
            }
            else {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertMany resolved.');
                resolve(rowCount);

            }
        });
    });
 /*   if (!inserted) {
        inserted = [];
        logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertMany started.');
    }

    // Return if the recursion is finished.
    if (voucherseries.length === inserted.length) {
        // SQL INSERTs returns undefined, change this?
        return new Promise(function (resolve, reject) {
            logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertMany resolved.');
            resolve(inserted.length);
        });
    }

    var lastInserted = voucherseries[inserted.length];
    return new Promise(function (resolve, reject) {
        exports.insertOne(lastInserted, isTemp)
            .then(resolve)
            .catch(reject);
    }).then(function (result) {
            return insertMany(voucherseries, isTemp, inserted.concat([lastInserted]));
        })
        .catch(function (err) {
            return new Promise(function (resolve, reject) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.insertMany rejected.');
                reject(err);
            });
        });*/
};

/**
 * Updates existing but changed custumers and inserts new voucherseries
 * into the voucherseries table.
 *
 * @param {Array} ([voucherseries])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(voucherseries) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(voucherseries, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/voucherseries.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('voucherseries.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('voucherseries.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Drops the voucherseries table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/voucherseries.temp.drop.sql'
            : './sql/voucherseries.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'voucherseries.drop rejected');
                reject(err);
            });
    });
};