'use strict'

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var node; // Will be the node command.

// Runs the server function via a custom nodemon.
gulp.task('server', function () {
  // Kill node if it's running already.
  if (node) { node.kill() };
  
  // Run a node client on server/app.js
  node = spawn('node', ['server/app.js'], { stdio: 'inherit' });
  
  // If it closes with the error code 8, something crashed
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

// Write testing for gulp
gulp.task('test', function (cb) {
  exec('npm test', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (typeof cb === 'function') {
      cb(err);
    }
  });
});

// Default task
gulp.task('default', function () {
  gulp.run('server');
  
  // Every change, do this.
  gulp.watch(['./server/**'], function () {
    gulp.run('server');
  });
});

// On process close, clean up.
process.on('exit', function () {
  if (node) node.kill();
})