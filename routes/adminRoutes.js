'use strict';

var bodyParser = require("body-parser");

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
}