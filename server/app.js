'use strict'

var sql = require('seriate');
var config = require('./config/environment/development');
var customer = require('./api/Customer/customer.controller');

var dbConfig = {
  "server": config.db.server,
  "user": config.db.user,
  "password": config.db.password,
  "database": config.db.database,
  "options": {
    "encrypt": false
  }
};

console.log(dbConfig);

sql.setDefaultConfig(dbConfig);

// Do stuff...

var newCustomer = {
  "@url": "https://api.fortnox.se/3/customers/102",
  "Address1": "Halltorpsgatan",
  "Address2": "",
  "City": "KLIPPAN",
  "CustomerNumber": "102",
  "Email": "a.s@example.com",
  "Name": "Anders Svensson",
  "OrganisationNumber": "",
  "Phone": "0435-9249236",
  "ZipCode": "264 32"
};

// customer.initializeTable()
// .then(function (value) {
  
//   // Insert newCustomer
//   customer.insertOne(newCustomer)
//   .then(function (value) {
    
//     // Get all
//     customer.getFullCustomers()
//     .then(function (val) {
//       console.log(val);
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
    
//   });
// })
// .catch(function (err) {
//   console.log(err);
// });