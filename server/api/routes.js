'use strict'

/**
 * @param {Object} app - express instance.
 */
module.exports = function (app) {
  app.use('/customer', require('./Customer'))
};
