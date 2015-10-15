'use strict'

var test = require('unit.js');

var serverTests = require('../server/test');

// Tests are written in mocha, using unit.js
// Documentation for unit.js: http://unitjs.com/
// Documenation for mocha: http://mochajs.org/

// The first parameter of describe should be the module name
describe('exampleModuleName (test)', function () {
  
  // Test cases should explain what they're testing for.
  it('example string should be "Hello, World!"', function () {
    
    var example = 'Hello, World!';
    
    
    test // test suite
      .string(example) // type to test for
        .is('Hello, World!') // equality test
        .isNot('Goodbye, cruel World!') // inequality test
    ;
    
  });
});