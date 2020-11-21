'use strict';

var bodyParser = require("body-parser");
const globalErrorHandler = require('../controllers/errorController');

module.exports = function(app) {
    app.use(bodyParser.json());

    //  Unprotected route 
    app.all('/api/v1/*', function (req, res, next) {
        next();
    });

    /* Admin Other Routes */

    var testRoute = require('./testRoute');
    new testRoute(app);

    /* Admin other Routes end */


    // Global error

    app.use(globalErrorHandler);
}