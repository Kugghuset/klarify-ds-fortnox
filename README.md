# klarify-ds-fortnox 

### Setting up the projecet

The project runs on [Node.js](https://nodejs.org/en/), and is written in JavaScript. The database type is Microsoft SQL.

To install Node.js, simply install it by clicking the big green button on [their website](https://nodejs.org/en/).

Clone the repository using Git (if you don't have Git on your computer, [here's the download link](https://git-scm.com/download))

```
git clone git@github.com:Kugghuset/klarify-ds-fortnox.git
```

If you don't have [Gulp](http://gulpjs.com/), [Express](http://expressjs.com/) or [Mocha](http://mochajs.org/), install them via npm, using the `-g` flag (meanings it's a global install).

```
npm install -g gulp express mocha
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
Note: changes to this file won't be commited as it is in the `.gitignore` file.

Here's how I've set mine up:

```javascript
'use strict'

module.exports = {
  dbUser: 'sa', // database user
  dbPass: 'pass', // database password
  dbServer: 'EASTGROVESOFTWA\\LOCALSQL', // database server
  dbName: 'dbName' // name of database
};
```


---

### Running the project

You'll need a Microsoft Sequel Server running somewhere. I've got mine setup via [SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).

When the server is up and running, assuming you're done setting up, simply run:

```
gulp
```

---

### Testing

Tests are written in [Mocha](http://mochajs.org/), and uses [unit.js](http://unitjs.com/) (which allows for testing in a couple of different framworks).

The testing suite can be run either via Mocha itself, npm or gulp. I advice to use `npm test` as it's colorized and runs from everywhere.

**Mocha:** From the root folder, run:
```
mocha test
```

**npm:** from anywhere in the project, run:
```
npm test
```

**gulp:** (_no colors_) from anywhere in the project, run:
```
gulp test
```