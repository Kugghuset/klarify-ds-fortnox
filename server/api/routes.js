'use strict'

/**
 * Purely the routing module.
 * Modules should be added on as '/name' and required by their index.js file.
 * 
 * Example:
 * app.use('/name', require('./name'));
 */

/**
 * Add all active routes are used here.
 * 
 * @param {Object} app - express instance.
 */
module.exports = function (app) {
  app.use('/customer', require('./customer'));
  app.use('/account', require('./account'));
  app.use('/supplier', require('./supplier'));
  app.use('/costcenter', require('./costcenter'));
  app.use('/voucherseries', require('./voucherseries'));
  app.use('/invoice', require('./invoice'));
  app.use('/voucher', require('./voucher'));
  app.use('/voucher', require('./voucher'));
  app.use('/supplierinvoice', require('./supplierinvoice'));
};
