'use strict'

var _ = require('lodash');

var controller = require('./customer.controller');
var requestHandler = require('./customer.requestHandler');

requestHandler.getAll()
.then(function (result) { 
  console.log(result);
  
})
.catch(function (err) {
  console.log(err);
  
});