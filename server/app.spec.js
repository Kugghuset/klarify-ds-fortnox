'use strict'

var test = require('unit.js');

var app = require('./app');

describe('app', function () {
  it('Should do stuff...', function () {
    var exampleTest = true;
    
    test
      .bool(exampleTest)
        .isTrue()
        .isNotFalse()
    ;
  });
});