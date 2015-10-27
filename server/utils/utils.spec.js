'use strict'

var test = require('unit.js');;

var fortnox = require('./fortnox.util');

describe('fortnox.util', function () {
  
  it('formattedDate should return "" when *date* is undefined or null', function () {

    test

      .when('"undefined" is passed in')
      .then('the output should be ""', function () {
        test
          .string(fortnox.formattedDate(undefined))
            .isEmpty();
      })

      .when('"null" is passed in')
      .then('the output should also be ""', function () {
        test
          .string(fortnox.formattedDate(null))
            .isEmpty()
        ;
      })

    ;
  });
  
  it('formattedDate should return "" when *date* is not a date object', function () {

    test

      .when('*date* a number')
      .then('the output should be ""', function () {
        test
          .string(fortnox.formattedDate(1))
            .isEmpty()
          .string(fortnox.formattedDate(-1))
            .isEmpty()
          .string(fortnox.formattedDate(0))
            .isEmpty()
          .string(fortnox.formattedDate(99999999))
            .isEmpty()
          .string(fortnox.formattedDate(-99999999))
            .isEmpty()
          .string(fortnox.formattedDate(Infinity))
            .isEmpty()
          .string(fortnox.formattedDate(-Infinity))
            .isEmpty()
        ;
      })

      .when('*date* is a string')
      .then('the output should be ""', function () {
        test
          .string(fortnox.formattedDate(''))
            .isEmpty()
          .string(fortnox.formattedDate('Hello, World!'))
            .isEmpty()
          .string(fortnox.formattedDate('toISOString'))
            .isEmpty()
        ;
      })

      .when('*date* is an array')
      .then('the output should be ""', function () {
        test
          .string(fortnox.formattedDate([]))
            .isEmpty()
          .string(fortnox.formattedDate([2, 3, 5, 7, 11, 13]))
            .isEmpty()
          .string(fortnox.formattedDate(['toISOString']))
            .isEmpty()
        ;
      })

      .when('*date* is a regular object')
      .then('the output should be ""', function () {
        test
          .string(fortnox.formattedDate({}))
            .isEmpty()
          .string(fortnox.formattedDate({ key: 'value' }))
            .isEmpty()
        ;
      })

      ;
  });
  
  it('formattedDate should return a string formatted as such: "yyyy-MM-dd hh:mm"', function () {

    var regexp = /^[0-9]{4}\-[0-9]{2}-[0-9]{2} [0-9]{2}\:[0-9]{2}$/;

    test
      .when('*date* is new Date()')
      .then('output should match "yyyy-MM-dd hh:mm"', function () {
        test
          .string(fortnox.formattedDate(new Date()))
            .match(regexp)
          ;
      })

      .when('*date* is new Date(2000, 0, 1)')
      .then('output should match "yyyy-MM-dd hh:mm"', function () {
        test
          .string(fortnox.formattedDate(new Date(2000, 0, 1)))
            .match(regexp)
          ;
      })

    ;
  });
});