'use strict';

const globalErrorHandler = require('../controllers/errorController');
const passport = require("../config/passport.js")();
const bodyParser = require("body-parser");
const AppError = require('../utils/appError')

module.exports = function (app) {
    app.use(bodyParser.json());

    app.use(passport.initialize());

    // Auth routes
    app.all('/api/auth/*', function (req, res, next) {
        next();
    });

    // Auth Routes
    var authRoute = require('./authRoute');
    new authRoute(app);
    // Auth End Routes

    //  Protected route 
    app.all('/api/v1/*', passport.authenticate(), function (req, res, next) {
        next();
    });

    /* Admin Protected Routes */
    var testRoute = require('./testRoute');
    new testRoute(app);
    /* Admin other Routes end */

    // catch 404 and forward to error handler
    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });

    // Global error
    app.use(globalErrorHandler);
}