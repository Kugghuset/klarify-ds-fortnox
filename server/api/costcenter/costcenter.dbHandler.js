'use strict'

/**
 * The database handler for the costcenter route.
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
            ? './sql/costcenter.temp.initialize.sql'
            : './sql/costcenter.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all Costcenter rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[Costcenter]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/costcenter.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('Costcenter.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('Costcenter.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active Costcenters from the db.
 *
 * @return {Promise} -> {[Costcenter]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/costcenter.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('costcenter.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('costcenter.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Gets all active costcenters where
 * StartDate is greater than *date*.
 *
 * @param {Date} date
 * @return {Promise} -> {[Costcenter]}
 */
exports.getActiveSince = function (date) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/costcenter.getActiveSince.sql'),
            params: {
                dateSince: {
                    type: sql.DATETIME2,
                    val: date
                }
            }
        })
            .then(function (results) {
                logger.stream.write('costcenter.getActiveSince ' + date.toISOString() + ' resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write('costcenter.getActiveSince ' + date.toISOString() + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Recursively inserts one or many costcenters into the Costcenter table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} costcenters ([Costcenter])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([Costcenter]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
/**
 * Inserts a new row in the Costcenter table.
 * If no *costcenter* is non-existent or not
 *
 * @param {Object} costcenter
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (costcenter, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!costcenter || typeof costcenter !== 'object') {
            // return early if no costcenter is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertOne ' + costcenter.Code + ' rejected');
            return reject(new TypeError('Costcenter must be of type "object"'));
        }
        console.log("!!!!")
        var sqlFile = isTemp
            ? './sql/costcenter.temp.insertOne.sql'
            : './sql/costcenter.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: costcenter['@url']
                },
                Code: {
                    type: sql.NVARCHAR,
                    val: costcenter.Code
                },
                Description: {
                    type: sql.NVARCHAR,
                    val: costcenter.Description
                },
                Note: {
                    type: sql.NVARCHAR,
                    val: costcenter.Note
                },
                Active: {
                    type: sql.BIT,
                    val: costcenter.Active
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertOne ' + costcenter.Code + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertOne ' + costcenter.Code + ' rejected.');
                reject(err);
            });
    });
};
exports.insertMany = function insertMany(costcenters, isTemp, inserted) {
    // Set *inserted* to an empty array if it's undefined

    var tableName = isTemp
        ? 'TempCostcenter'
        : 'Costcenter';
    var table = new mssql.Table(tableName); // or temporary table, e.g. #temptable
    //table.create = true;
    table.columns.add('@url', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('Code', mssql.NVarChar(mssql.MAX), {nullable: false});
    table.columns.add('Description', mssql.NVarChar(mssql.MAX), {nullable: false});
    table.columns.add('Note', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('Active', mssql.Bit, {nullable: true});

    //table.rows.add(777, 'test');

    costcenters.forEach(function(costcenter){
        table.rows.add(
            costcenter['@url'],
            costcenter['Code'],
            costcenter['Description'],
            costcenter['Note'],
            costcenter['Active']
        );
    });

    return new Promise(function (resolve, reject) {
        var request = new mssql.Request();
        request.bulk(table, function (err, rowCount) {
            // ... error checks
            if (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertMany rejected.');
                reject(err);
            }
            else {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertMany resolved.');
                resolve(rowCount);

            }
        });
    });

/*    if (!inserted) {
        inserted = [];
        logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertMany started.');
    }

    // Return if the recursion is finished.
    if (costcenters.length === inserted.length) {
        // SQL INSERTs returns undefined, change this?
        return new Promise(function (resolve, reject) {
            logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertMany resolved.');
            resolve(inserted.length);
        });
    }

    var lastInserted = costcenters[inserted.length];
    return new Promise(function (resolve, reject) {
        exports.insertOne(lastInserted, isTemp)
            .then(resolve)
            .catch(reject);
    }).then(function (result) {
            return insertMany(costcenters, isTemp, inserted.concat([lastInserted]));
        })
        .catch(function (err) {
            return new Promise(function (resolve, reject) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.insertMany rejected.');
                reject(err);
            });
        });*/
};

/**
 * Updates existing but changed custumers and inserts new costcenters
 * into the costcenter table.
 *
 * @param {Array} ([Costcenter])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(costcenters) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {

                    exports.insertMany(costcenters, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/costcenter.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('costcenter.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('costcenter.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}

/**
 * Drops the Costcenter table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/costcenter.temp.drop.sql'
            : './sql/costcenter.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.drop resolved');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'costcenter.drop rejected');
                reject(err);
            });
    });
};