'use strict'

var _ = require('lodash');
var sql = require('seriate');
var mssql = require('mssql');
var morgan = require('morgan');
var express = require('express');
var app = express();

var config = require('./config/environment/development');
var appState = require('./app.state');
var logger = require('./utils/logger.util');

app.use(morgan('combined', { stream: logger.stream }));
require('./api/routes')(app, logger);

var dbConfig = {
  "server": config.db.server,
  "user": config.db.user,
  "password": config.db.password,
  "database": config.db.database,
  "options": {
    "encrypt": true
  }
};

/**
 * Starts the express server listening on config.server.port
 */
function serve() {
  var server = app.listen(3000, function () {
    var port = server.address().port;
    
    logger.stream.write('App listening on port ' + port);
  });
}

/**
 * Initializes the state tables and then spins up the server.
 * 
 * Add new names as they are created to the array
 */
sql.setDefaultConfig(dbConfig);
var config = dbConfig;
mssql.connect(config, function(err) {
  // ... error checks
});
appState.initializeTables(['Customer','Account','Supplier','Costcenter','Voucherseries','Invoice','Voucher','InvoicePayment','SupplierInvoice','SupplierInvoicePayment'])
.then(serve);
