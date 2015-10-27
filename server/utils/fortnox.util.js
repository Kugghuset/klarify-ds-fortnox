'use strict'

var _ = require('lodash');

/**
 * Formats the date as a string with the following structure:
 * YYYY-MM-DD HH:mm
 * 
 * @param {Date} date
 * @return {String}
 */
exports.formattedDate = function (date) {
  if (!date || !(typeof date === 'object' && 'toISOString' in date)) {
    return '';
  } 
  
  return date.toISOString().replace('T', ' ').split('').slice(0,16).join('');
};

/**
 * Returns the url for *baseUrl* page at *pageNum*.
 * *pageNum* defaults to 1 if it's either undefined, lower than 1 or NaN.
 * *pageNum* should be an integer, but the Fortnox API seems to floor the value.
 * 
 * Returns an empty string if *baseUrl* is falsy.
 * 
 * @param {String} baseUrl
 * @param {Number} pageNum - optional
 * @param {Date} lastUpdated - optional
 * @return {String}
 */
exports.pageUrlFor = function (baseUrl, pageNum, lastUpdated) {
  if (!baseUrl) { return ''; }
  
  if (typeof pageNum != 'undefined' && (!pageNum || isNaN(pageNum) || pageNum < 1)) { pageNum = 1; }
  
  var params = _.filter([
    typeof pageNum != 'undefined' ? 'page=' + pageNum : '',
    lastUpdated ? 'lastmodified=' + exports.formattedDate(lastUpdated) : ''
  ]).join('&');
  
  return encodeURI(_.filter([baseUrl, params]).join('?'));
};