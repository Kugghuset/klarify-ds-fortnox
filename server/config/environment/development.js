'use strict'

var userConfig = require('../../../userConfig');

if (!userConfig) {
  // If userConfig is undefined set it to an empty object
  // to ensure no errors are thrown.
  userConfig = {};
}

console.log(userConfig);

module.exports = {
  db: {
    user: process.env.dbUser || userConfig.dbUser || 'sa',
    passwor: process.env.dbPass || userConfig.dbPass || 'pass',
    server: process.env.dbServer || userConfig.dbServer || 'localhost',
    database: process.env.dbName || userConfig.dbName || 'master'
  }
}