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

      .when('*date* is a number')
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
  
  it('pageUrlFor should return "" when *baseUrl* is undefined or null', function () {

    test
      .when('*baseUrl* is undefined')
      .then('output should be ""', function () {
        test
          .string(fortnox.pageUrlFor(undefined))
            .isEmpty()
      })

      .when('*baseUrl* is null')
      .then('output should be ""', function () {
        test
          .string(fortnox.pageUrlFor(null))
            .isEmpty()
      })

    ;

  });
  
  it('pageUrlFor should return "" when *baseUrl* is not a string', function () {

    test
      .when('*baseUrl* is a number')
      .then('output should be ""', function () {
        test
          .string(fortnox.pageUrlFor(1))
            .isEmpty()
          .string(fortnox.pageUrlFor(-1))
            .isEmpty()
          .string(fortnox.pageUrlFor(0))
            .isEmpty()
          .string(fortnox.pageUrlFor(99999999))
            .isEmpty()
          .string(fortnox.pageUrlFor(-99999999))
            .isEmpty()
        ;
      })

      .when('*baseUrl* is an array')
      .then('output should be ""', function () {
        test
          .string(fortnox.pageUrlFor([]))
            .isEmpty()
          .string(fortnox.pageUrlFor([2, 3, 5, 7, 11, 13]))
            .isEmpty()
          .string(fortnox.pageUrlFor(['string']))
            .isEmpty()
        ;
      })

      .when('*baseUrl* is an object')
      .then('output should be ""', function () {
        test
          .string(fortnox.pageUrlFor({}))
            .isEmpty()
          .string(fortnox.pageUrlFor({key: 'value'}))
            .isEmpty()
        ;
      })

    ;

  });
  
  it('pageUrlFor should return a string matching *baseUrl* when only *baseUrl* is passed in', function () {

    var baseUrl = 'https://api.fortnox.se/3/customers/';
    
    test
      .string(fortnox.pageUrlFor(baseUrl))
        .match(baseUrl)

    ;

  })
  
  it('pageUrlFor should return a string containing "page=*pageNum*|1" when *pageNum* is passed in', function () {

    var baseUrl = 'https://api.fortnox.se/3/customers/';
    var pageNum;;

    test
      .when('*pageNum* is correct (finite number above 0)')
      .then('output should contain "page=*pageNum"', function () {
        test
          .given(pageNum = 42)
          .string(fortnox.pageUrlFor(baseUrl, pageNum))
            .contains('page=' + pageNum)

          .given(pageNum = 1)
          .string(fortnox.pageUrlFor(baseUrl, pageNum))
            .contains('page=' + pageNum)
        ;
      })

      .when('*pageNum* is defined but incorrect (anything but finite Numbers above 0) ')
      .then('output should contain "page=1"', function () {
        test
          .given(pageNum = 'a string')
          .string(fortnox.pageUrlFor(baseUrl, pageNum))
            .contains('page=' + 1)

          .given(pageNum = [])
          .string(fortnox.pageUrlFor(baseUrl, pageNum))
            .contains('page=' + 1)

          .given(pageNum = {})
          .string(fortnox.pageUrlFor(baseUrl, pageNum))
            .contains('page=' + 1)

          .given(pageNum = -1)
          .string(fortnox.pageUrlFor(baseUrl, pageNum))
            .contains('page=' + 1)

          .given(pageNum = Infinity)
          .string(fortnox.pageUrlFor(baseUrl, pageNum))
            .contains('page=' + 1)

        ;
      })

    ;

  });
  
  it('pageUrlFor should return a string containing "lastModified=<URI encoded (date like formattedDate)>" when *lastmodified* is passed in', function () {

    var baseUrl = 'https://api.fortnox.se/3/customers/';
    
    // To ensure the offset doesn't disturb results.
    var hours = 12 + (new Date().getTimezoneOffset() / -60);
    
    var testDate = new Date(2014, 2, 10, hours, 30);
    var formattedDate = '2014-03-10 12:30';
    var formattedDateEncoded = encodeURI(formattedDate);

    test
      .when('*lastUpdated* is 42 (set above)')
      .then('output should be "lastmodified=<formattedDateEncoded>"', function () {
        test
          .string(fortnox.pageUrlFor(baseUrl, undefined, testDate))
            .contains('lastmodified=' + formattedDateEncoded)
        ;
      })

    ;

  });
  
});