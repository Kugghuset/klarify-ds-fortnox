'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

exports.initializeCustomerTable = function () {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/customer.initialize.sql')
    });
  });
};


// exports.initializeCustomerTable();