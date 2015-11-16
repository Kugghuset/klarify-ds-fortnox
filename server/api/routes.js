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
};
