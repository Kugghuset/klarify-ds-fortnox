'use strict'

/**
 * The index file for the voucher route.
 * This is were incoming requests are handled.
 * Requests should be purely based on the flow methods.
 */

var express = require('express');
var router = express.Router();

var flow  = require('./voucher.flow');

/**
 * Triggers the cleanAndFetch flow method.
 * If successful, a response with the statuscode 200.
 */
router.get('/cleanAndFetch', function (req, res) {
    flow.cleanAndFetch()
        .then(function (_res) {
            res.status(200).send('Database cleaned and all voucher fetched.');
        })
        .catch(handleError);
});

/**
 * Triggers the fetchNewlyModified flow method.
 * If successful, a response with the statuscode 200.
 */
router.get('/fetchNewlyModified', function (req, res) {
    flow.fetchNewlyModified()
        .then(function (_res) {
            res.status(200).send('Newly modifified voucher fetched.');
        })
        .catch(handleError);
});

/**
 * Gets all active voucher from the db.
 * A response with the statuscode 200 containing the voucher are returned.
 */
router.get('/getAllActive', function (req, res) {
    flow.getAllActive()
        .then(function (_res) {
            res.status(200).json(_res);
        })
        .catch(handleError);
});

/**
 * Gets all voucher from the db, includes historical data.
 * A response with the statuscode 200 containing the voucher are returned.
 */
router.get('/', function (req, res) {
    flow.getAll()
        .then(function (_res) {
            res.status(200).json(_res);
        })
        .catch(handleError);
});

/**
 * Sends a response with the status code 500
 *
 * @param {Object} res - express response object
 * @param {Error} err
 */
function handleError(res, err) {
    res.status(500).send();
}

module.exports = router;