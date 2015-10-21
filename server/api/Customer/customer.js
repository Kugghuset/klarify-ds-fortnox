'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var controller = require('./customer.controller');
var requestHandler = require('./customer.requestHandler');

exports.controller = controller;
exports.requestHandler = requestHandler;
