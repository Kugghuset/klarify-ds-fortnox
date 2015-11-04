<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [klarify-ds-fortnox](#klarify-ds-fortnox)
    - [Setting up the project](#setting-up-the-project)
    - [Running the project](#running-the-project)
    - [Testing](#testing)
    - [Contributing](#contributing)
      - [Commiting and pull requests](#commiting-and-pull-requests)
      - [Folder structure](#folder-structure)
      - [Fortnox API docs](#fortnox-api-docs)
      - [Resources of interest](#resources-of-interest)
        - [Implemented resources](#implemented-resources)
        - [Resources to implement](#resources-to-implement)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# klarify-ds-fortnox 

[![Build Status](https://travis-ci.org/Kugghuset/klarify-ds-fortnox.svg)](https://travis-ci.org/Kugghuset/klarify-ds-fortnox)

### Setting up the project

The project runs on [Node.js](https://nodejs.org/en/), and is written in JavaScript. The database type is Microsoft SQL.

To install Node.js, simply install it by clicking the big green button on [their website](https://nodejs.org/en/).

Clone the repository using Git (if you don't have Git on your computer, [here's the download link](https://git-scm.com/download))

```
git clone git@github.com:Kugghuset/klarify-ds-fortnox.git
```

If you don't have [Gulp](http://gulpjs.com/), [Express](http://expressjs.com/), [Mocha](http://mochajs.org/) or [DocToc](https://github.com/thlorenz/doctoc), install them via npm, using the `-g` flag (meanings it's a global install).

```
npm install -g gulp express mocha doctoc
```

Install the packages.

```
npm install
```

To ensure changes to `userConfig.js` doesn't sneak into the repository, run: 

```
git update-index --assume-unchanged userConfig.js
```

Lastly update `userConfig.js` file to match your setup.
Note: changes to this file won't be commited as it is in the `.gitignore` file. To ensure you don't have to constantly get new keys, keep a copy of this file outside the repository, so won't lose any local keys when pulling.
Note: sometimes the file might be reset to the state it is in the repository, for instance resetting to a previous commit or when checkout out another branch based on a remote branch, the local `userConfig.js` file will be reset. This will cause issues when running the `gulp` command, as it won't be able to set the server up.

Here's how I've set mine up:

```javascript
'use strict'

module.exports = {
  dbUser: 'sa', // database user
  dbPass: 'pass', // database password
  dbServer: 'EASTGROVESOFTWA\\LOCALSQL', // database server
  dbName: 'master', // name of database
  accessToken: 'cannot_give_these_out', // accessToken from Fortnox
  clientSecret: 'cannot_give_these_out' // clientSecret from Fortnox
};
```

### Running the project

You'll need a Microsoft Sequel Server running somewhere. I've got mine setup via [SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).

When the server is up and running, assuming you're done setting up, simply run:

```
gulp
```

### Testing

Tests are written in [Mocha](http://mochajs.org/), and uses [unit.js](http://unitjs.com/) (which allows for testing in a couple of different framworks).

The testing suite can be run either via Mocha itself, npm or gulp. I advice to use `npm test` as it's colorized and runs from everywhere.

**npm:** from anywhere in the project, run:
```
npm test
```

### Contributing

#### Commiting and pull requests

Committing straight onto `master` is a no-no. Commits done onto feature specific branches, which then are audited and if it passes can be merge into `master` by an admin. Commits are made on a regular basis when *_the current step is finished_* and Pull Requests are made *when the current feature is finished*.

Commmit messages should be concise and written in futurum, which means a commit which has added a GET request to the Customer endpoint on the Fortnox API would be something like: `Add GET request to Customer endpoint`.

#### Folder structure

```
api
└───customer
    ├───customer.dbHandler.js
    ├───customer.flow.js
    ├───customer.requestHandler.js
    ├───customer.spec.js
    ├───index.js
    └───sql
        ├───customer.disabledByID.sql
        ├───customer.drop.sql
        ├───customer.getActive.sql
        ├───customer.getActiveSince.sql
        ├───customer.getAll.sql
        ├───customer.initialize.sql
        ├───customer.insertOne.sql
        ├───customer.merge.sql
        ├───customer.temp.drop.sql
        ├───customer.temp.initialize.sql
        └───customer.temp.insertOne.sql
```

Every folder in the `api` directory should contain an index.js file, which handles the incoming requests for that specific endpoint. I.E. all `<base_url>/customer/` is handled by the index.js file in the customer folder.

External API calls are handled in the `<endpoint>.requestHandler.js` file, I.E. this is were data is fetched from the Fortnox API. Paginated results are handled via recursion, which can be seen in the `getAll()` or `getNewlyModified()` functions in `customer.requestHandler.js`.

Database calls are handled from the `<endpoint>.dbHandler.js`, which is done through [Seriate](https://github.com/LeanKit-Labs/seriate) and plain T-SQL files in the `<endpoint>/sql` folder. The `.sql` files name's should match the corresponding method in `dbHandler` prefixed with the `<endpoint>` and possibly `.temp` if if it's for the temp table. E.G. in customer, the function `getActive()` has the corresponding file `./sql/customer.getActive.sql`.

The `<endpoint>.flow.js` wraps the `requestHandler` and `dbHandler` together and is what's used in the `index.js` file.

Tests are written in the `<endpoint>.spec.js` file.

#### Fortnox API docs

The [documentation can be found at here](http://developer.fortnox.se/documentation/), and the endpoints are listed under *RESOURCES*, the list of which these can be found below. We're currently interested of the _List of all RESOURCE>_, which would be the `https://api.fortnox.se/3/<RESOURCE_NAME>` request. In each resource under the heading *Properties* each property and it's type can be found. These are of interest for when setting the `<endpoint>.initializeTable.sql` as they have expected data types and max length.

NOTE: As we are interested in the JSON formatted data, the headers should containg `'Content-Type': 'application/json'` and `'Accept': 'application/json'`, which is set in `config/environment/development.js`.

What's noted as `string, 1024 characters` in the docs is in T-SQL am `nvarchar(1024)` and in JavaScript via Seriate `sql.NVARCHAR(1024)`. On properties where the max length is left out, it's assumed to be the max length, which in T-SQL would be `nvarchar(max)` and in JavaScript just `sql.NVARCHAR`.

NOTE: Not all properties exists in the list download we use, so make sure to reference the properties with the example return from the API call earlier on the page.

#### Resources of interest

When a resource is implemented, make sure to move it from *Resources to implement* to *Implemented resources*.

##### Implemented resources

Resources which are already implemented and functional.

 - [Customers](http://developer.fortnox.se/documentation/resources/customers/)

##### Resources to implement

These are the resources from Fortnox which is not implemented yet.

- [Accounts](http://developer.fortnox.se/documentation/resources/accounts/)
- [Cost Centers](http://developer.fortnox.se/documentation/resources/cost-centers/)
- [Invoices](http://developer.fortnox.se/documentation/resources/invoices/)
- [Invoices Payments](http://developer.fortnox.se/documentation/resources/invoice-payments/)
- [Suppliers](http://developer.fortnox.se/documentation/resources/suppliers/)
- [Supplier Invoices](http://developer.fortnox.se/documentation/resources/supplier-invoices/)
- [Supplier Invoice Payments](http://developer.fortnox.se/documentation/resources/supplier-invoice-payments/) 
- [Voucer Seriers](http://developer.fortnox.se/documentation/resources/voucher-series/)
- [Vouchers](http://developer.fortnox.se/documentation/resources/vouchers/)
