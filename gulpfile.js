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

// Watchers
gulp.task('watch', function () {
  gulp.watch(['./server/**'], ['server']);
});

// Default task
gulp.task('default', ['server', 'watch']);

// On process close, clean up.
process.on('exit', function () {
  if (node) node.kill();
})