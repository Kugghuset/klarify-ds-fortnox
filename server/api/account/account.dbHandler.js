'use strict'

/**
 * The database handler for the account route.
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
            ? './sql/account.temp.initialize.sql'
            : './sql/account.initialize.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (results) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'Account.initializeTable resolved.');
                resolve(results);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'Account.initializeTable rejected.');
                reject(err);
            });
    });
};

/**
 * Gets the top *limit* or all Accounts rows.
 *
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[Account]}
 */
exports.getAll = function (limit) {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/account.getAll.sql'),
            params: {
                topNum: {
                    type: sql.BIGINT,
                    val: 0 < limit ? limit : -1
                }
            }
        })
            .then(function (results) {
                logger.stream.write('account.getAll resolved.');
                resolve(results);
            })
            .catch(function (err) {
                console.log("err")
                console.log(err)
                logger.stream.write('account.getAll rejected.');
                reject(err);
            });
    });
};

/**
 * Drops the Accounts table.
 * Should really never be used?
 *
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
    return new Promise(function (resolve, reject) {

        var sqlFile = isTemp
            ? './sql/account.temp.drop.sql'
            : './sql/account.drop.sql';

        sql.execute({
            query: sql.fromFile(sqlFile)
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'account.drop resolved');
                resolve(result);

            })
            .catch(function (err) {
                console.log("22222")
                logger.stream.write((isTemp ? '(temp) ' : '') + 'account.drop rejected');
                reject(err);
            });
    });
};

/**
 * Inserts a new row in the Accounts table.
 * If no *account* is non-existent or not
 *
 * @param {Object} account
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (account, isTemp) {
    return new Promise(function (resolve, reject) {
        if (!account || typeof account !== 'object') {
            // return early if no account is present.
            logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertOne ' + account.Number+ ' rejected');
            return reject(new TypeError('Account must be of type "object"'));
        }

        var sqlFile = isTemp
            ? './sql/account.temp.insertOne.sql'
            : './sql/account.insertOne.sql';

        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                url: {
                    type: sql.NVARCHAR,
                    val: account['@url']
                },
                Active: {
                    type: sql.BIT,
                    val: account.Active
                },
                Description: {
                    type: sql.NVARCHAR(200),
                    val: account.Description
                },
                Number: {
                    type: sql.INT,
                    val: account.Number
                },
                SRU: {
                    type: sql.INT,
                    val: account.SRU
                },
                Year: {
                    type: sql.INT,
                    val: account.Year
                }
            }
        })
            .then(function (result) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertOne ' + account.Number + ' resolved.');
                resolve(result);
            })
            .catch(function (err) {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertOne ' + account.Number + ' rejected.');
                reject(err);
            });
    });
};

/**
 * Recursively inserts one or many accounts into the Account table.
 * This is achieved by inserting them one by one.
 *
 * @param {Array} accounts ([Accounts])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([Account]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(accounts, isTemp, inserted) {


    var tableName = isTemp
        ? 'TempAccount'
        : 'Account';
    var table = new mssql.Table(tableName); // or temporary table, e.g. #temptable
    //table.create = true;
    table.columns.add('@url', mssql.NVarChar(mssql.MAX), {nullable: true});
    table.columns.add('Active', mssql.Bit, {nullable: true});
    table.columns.add('Description', mssql.NVarChar(200), {nullable: false});
    table.columns.add('Number', mssql.Int, {nullable: false});
    table.columns.add('SRU', mssql.Int, {nullable: true});
    table.columns.add('Year', mssql.Int, {nullable: true});

    //table.rows.add(777, 'test');

    accounts.forEach(function(account){
        table.rows.add(
            account['@url'],
            account['Active'],
            account['Description'],
            account['Number'],
            account['SRU'],
            account['Year']
        );
    });

    return new Promise(function (resolve, reject) {
        var request = new mssql.Request();
        request.bulk(table, function (err, rowCount) {
            // ... error checks
            if (err) {
                console.log("err")
                console.log(err)
                logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertMany rejected.');
                reject(err);
            }
            else {
                logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertMany resolved.');
                resolve(rowCount);

            }
        });
    });

    /*      if (!inserted) {
     inserted = [];
     logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertMany started.');
     }

     // Return if the recursion is finished.
     if (accounts.length === inserted.length) {
     // SQL INSERTs returns undefined, change this?
     return new Promise(function (resolve, reject) {
     logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertMany resolved.');
     resolve(inserted.length);
     });
     }

     var lastInserted = accounts[inserted.length];

     return new Promise(function (resolve, reject) {
     exports.insertOne(lastInserted, isTemp)
     .then(resolve)
     .catch(reject);
     })
     .then(function (result) {
     return insertMany(accounts, isTemp, inserted.concat([lastInserted]));
     })
     .catch(function (err) {
     return new Promise(function (resolve, reject) {
     logger.stream.write((isTemp ? '(temp) ' : '') + 'account.insertMany rejected.');
     reject(err);
     });
     });*/
};

/**
 * Gets all active Accounts from the db.
 *
 * @return {Promise} -> {[Account]}
 */
exports.getActive = function () {
    return new Promise(function (resolve, reject) {
        sql.execute({
            query: sql.fromFile('./sql/account.getActive.sql')
        })
            .then(function (results) {
                logger.stream.write('account.getActive resolved.');
                resolve(results);
            })
            .catch(function (err) {
                console.log("err")
                console.log(err)
                logger.stream.write('account.getActive rejected.');
                reject(err);
            });
    });
};

/**
 * Updates existing but changed custumers and inserts new account
 * into the account table.
 *
 * @param {Array} ([Account])
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(accounts) {
    return new Promise(function (resolve, reject) {
        new Promise(function (resolve, reject) {
            exports.initializeTable(true)
                .then(function () {
                    exports.insertMany(accounts, true)
                        .then(resolve);
                })
                .catch(reject);
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    sql.execute({
                        query: sql.fromFile('./sql/account.merge.sql')
                    })
                        .then(function (result) {
                            resolve(result);
                        })
                        .catch(function (err) {

                            logger.stream.write('account.updateOrInsert rejected');
                            reject(err);
                        });
                });
            })
            .then(function () {
                logger.stream.write('account.updateOrInsert resolved');

                exports.drop(true)
                    .then(resolve);
            });

    });
}
