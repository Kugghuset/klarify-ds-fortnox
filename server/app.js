'use strict'

var _ = require('lodash');
var sql = require('seriate');
var config = require('./config/environment/development');
var customer = require('./api/Customer/customer');

var dbConfig = {
  "server": config.db.server,
  "user": config.db.user,
  "password": config.db.password,
  "database": config.db.database,
  "options": {
    "encrypt": false
  }
};

sql.setDefaultConfig(dbConfig);

// Do stuff...

