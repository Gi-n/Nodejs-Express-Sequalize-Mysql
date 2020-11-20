'use strict';

var test = require('../controllers/testController');

module.exports = function (app) {
    app.get('/api/v1/test/all', test.getAllTests);
}