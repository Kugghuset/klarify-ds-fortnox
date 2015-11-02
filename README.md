<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [klarify-ds-fortnox](#klarify-ds-fortnox)
    - [Setting up the project](#setting-up-the-project)
    - [Running the project](#running-the-project)
    - [Testing](#testing)
    - [Contributing](#contributing)
      - [Folder structure](#folder-structure)

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

#### Folder structure

```
api
└───Customer
    ├───customer.js
    ├───customer.controller.js
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
