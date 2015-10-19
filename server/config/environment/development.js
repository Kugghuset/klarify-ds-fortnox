'use strict'

var userConfig = require('../../../userConfig');

if (!userConfig) {
  // If userConfig is undefined set it to an empty object
  // to ensure no errors are thrown.
  userConfig = {};
}

module.exports = {
  db: {
    user: process.env.dbUser || userConfig.dbUser || 'sa',
    password: process.env.dbPass || userConfig.dbPass || 'pass',
    server: process.env.dbServer || userConfig.dbServer || 'localhost',
    database: process.env.dbName || userConfig.dbName || 'master'
  },
  headers: {
    standard: {
      'Access-Token': process.env.accessToken || userConfig.accessToken || '<access-token_from_fortnox>',
      'Client-Secret': process.env.clientSecret || userConfig.clientSecert || '<client-secret_from_fortnox>',
      'Content-Type': 'appliation/json',
      'Accept': 'appliation/json'
    }
  }
}