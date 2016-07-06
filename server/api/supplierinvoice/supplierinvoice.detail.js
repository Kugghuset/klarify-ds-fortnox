'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var request = require('request');
var mssql = require('mssql');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');

var supplierDb = require('./supplierinvoice.dbHandler');
var config = require('../../config/environment/development');

var _baseUrl = 'https://api.fortnox.se/3/supplierinvoices';

/**
 * @param {Object} invoice The invoice object
 * @return {Promise} -> {Object}
 */
function getDetailsPage(invoice) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'GET',
      uri: [_baseUrl, invoice.GivenNumber].join('/'),
      headers: _.extend({}, config.headers.standard, {
        'Media-Type': 'application/x-www-form-urlencoded'
      })
    }, function (err, response, body) {
      if (err) { return reject(err); }

      // Parse body
      var invoice = _.attempt(function () { return JSON.parse(body).SupplierInvoice; })
      invoice = !_.isError(invoice)
        ? invoice
        : body;

      resolve(invoice);
    });
  });
}

/**
 * Returns a promise of all invoice details for *invoices*.
 *
 * @param {Array} invoices
 * @param {Array} fetched Do not set, set recursively
 * @return {Promise} -> {Array}
 */
function getDetailsFor(invoices, fetched) {
  // First time setup
  if (!fetched) { fetched = []; }

  if (invoices.length === fetched.length) {
    return new Promise(function (resolve, reject) { resolve(fetched); });
  }

  return getDetailsPage(invoices[fetched.length])
  .then(function (detailedInvoice) {
    return getDetailsFor(invoices, fetched.concat([detailedInvoice]));
  })
  .catch(function (err) {
    return new Promise(function (resolve, reject) { reject(err); });
  })
}

function getAllDetails() {
  return new Promise(function (resolve, reject) {
    supplierDb.getAll()
    .then(getDetailsFor)
    .then(resolve)
    .catch(reject);
  });
}

function getAllDetailsSetly() {
  getAllDetails()
  .then(function (invoices) {
    // Get output
    var _output = _.chain(invoices)
      .map(function (invoice) {
        return _.map(invoice.SupplierInvoiceRows, function (val, i) {
          return [
            // Leverantörsnamn
            invoice.SupplierName,
            // Fakturanummer
            invoice.InvoiceNumber,
            // Kostnadskonto #
            invoice.SupplierInvoiceRows[i].Account,
            // Kostnadskonto, namn
            invoice.SupplierInvoiceRows[i].AccountDescription,
            // Fakturadatum
            invoice.InvoiceDate,
            // Kostnadsställe
            invoice.SupplierInvoiceRows[i].CostCenter,
            // Belopp
            invoice.Total,
            // Valuta
            invoice.Currency
          ].join('\t');
        });
      })
      .flatten()
      .value();

    // Add headers
    _output.unshift([
      'Leverantörsnamn',
      'Fakturanummer',
      'Kostnadskonto #',
      'Kostnadskonto, namn',
      'Fakturadatum',
      'Kostnadsställe',
      'Belopp',
      'Valuta',
    ].join('\t'));

    // Get the filepath
    var _filepath = path.resolve(
      process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
      'desktop',
      'setly-output.csv'
    );

    // Create the buffer for Excel to work properly
    var _buffer = iconv.encode(_output.join('\n'), 'utf16');

    // Write the file
    fs.writeFileSync(_filepath, _buffer);
    console.log('File written!');

  })
  .catch(function (err) {
    console.log(err);
  })
}

module.exports = {
  getAllDetails: getAllDetails,
  getAllDetailsSetly: getAllDetailsSetly,
}
