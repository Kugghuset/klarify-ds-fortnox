'use strict'

var sql = require('seriate');
var mssql = require('mssql');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var request = require('request');

var config = require('./server/config/environment/development');

var supplierInvoiceDetail = require('./server/api/supplierinvoice/supplierinvoice.detail');
var supplierInvoice = require('./server/api/supplierinvoice/supplierinvoice.flow');

// Get the args
var args = process.argv.map(function (val, index, array) { return val }).slice(2);

var options = {}
var currentKey;

var dbConfig = {
  "server": config.db.server,
  "user": config.db.user,
  "password": config.db.password,
  "database": config.db.database,
  "options": {
    "encrypt": true
  }
};

// Iterate over all args to populate *options*
args.forEach(function (val) {
  // Set current key if *val* starts with -[-]
  if (/^\-+/.test(val)) {
    currentKey = val.replace(/^\-+/, '');
    // At least append the key
    return options[currentKey] = undefined;
  }

  options[currentKey] = (typeof options[currentKey] === 'undefined')
    ? val
    : options[currentKey] + ' ' + val;
})

function print(val) {
  console.log(JSON.stringify(val, null, 4));
}

function handleCommand(optionName, callback) {
  if (typeof optionName === 'string') {
    // Handle strings

    // Call the callback with the value of options[optionName] if it exists and there is a callback
    if (options.hasOwnProperty(optionName) && typeof callback === 'function') {
      callback(options[optionName]);
    }
  } else if (typeof Array.isArray(optionName) && typeof callback === 'function') {
    // Handle arrays

    // Don't care about those where there is none.
    if (!optionName.some(function(key) { return options.hasOwnProperty(key); })) {
      return;
    }

    // Call the callback if all keys exists
    if (optionName.every(function(key) { return options.hasOwnProperty(key); })) {
      callback(optionName.map(function(key) { return _get(key); }))
    } else {
      var missing = optionName.filter(function(key) { return !options.hasOwnProperty(key); });

      console.log(chalk.yellow('Missing options: ' + missing.join(', ')));
    }
  }

}

function _get(optionName) {
  return options[optionName];
}

/************************
 *
 * Command handlers
 *
 ***********************/

sql.setDefaultConfig(dbConfig);
mssql.connect(dbConfig, function(err) {
  // ... error checks
  if (err) { return console.log(chalk.red(err)); }

  /**
   * Creates the access token using the client-secret and authorization-code (which is given by customer)
   * and then prints it to console.
   *
   * Example: node cli.js --auth --secret <secret> --auth-code <auth-code>
   */
  handleCommand(['auth', 'secret', 'auth-code'], function (values) {
    var secret = values[1];
    var authCode = values[2];

    request({
      method: 'GET',
      uri: 'https://api.fortnox.se/3/',
      headers: {
        'Authorization-Code': authCode,
        'Client-Secret': secret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }, function (err, response, body) {
      // Handle erros
      if (err) { return console.log(error); }

      var parsed;

      try {
        parsed = JSON.parse(body);
      } catch (error) {
        parsed = body;
      }

      console.log(
        typeof parsed === 'string'
          ? parsed
          : JSON.stringify(parsed, null, 4)
      );
    });
  });

  /**
   * Generates the setly file
   *
   * example: node cli.js --setly
   */
  handleCommand('setly', function () {
    console.log('Getting supplier invoice details to file');
    supplierInvoiceDetail.getAllDetailsSetly();
  })

  /**
   * Runs the fetch and clean command for supplier invoices
   *
   * example: node cli.js --fetch-invoices
   */
  handleCommand('fetch-invoices', function () {
    console.log('Cleaning and fetching all supplier invoices');
    supplierInvoice.cleanAndFetch();
  })
});
