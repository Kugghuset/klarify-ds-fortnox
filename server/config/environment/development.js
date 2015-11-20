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
      'Client-Secret': process.env.clientSecret || userConfig.clientSecret || '<client-secret_from_fortnox>',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Connection':'keep-alive'
    }
  },
  server: {
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
    ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined
  }
}