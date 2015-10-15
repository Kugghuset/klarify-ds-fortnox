'use strict'

var sql = require('seriate');
var config = require('./config/environment/development');
var customer = require('./api/Customer/customer.controller');

var dbConfig = {
  "server": config.db.server,
  "user": config.db.user,
  "password": config.db.password,
  "database": config.db.database,
  "options": {
    "encrypt": false
  }
};

console.log(dbConfig);

sql.setDefaultConfig(dbConfig);

// Do stuff...

customer.initializeCustomerTable()
.then(function (value) {
  console.log(value);
})
.catch(function (err) {
  console.log(err);
});