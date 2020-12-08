// auth.js
const passport = require("passport");
const passportJWT = require("passport-jwt");
const generalConfig = require('./generalConfig');
const { ExtractJwt, Strategy } = passportJWT;
const authMethods = require('./commonConfig');
const AppError = require('../utils/appError');

module.exports = () => {
    var params = {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
    };

    var strategy = new Strategy(params, function (payload, done) {
        var currentDate = Date.now();
        if (payload.expDate <= currentDate) {
            var difference = currentDate - payload.expDate;
            var minutesDifference = Math.floor(difference / 1000 / 60);
            // 1440 min = 1 day
            if (minutesDifference >= 1440) return done(new AppError('Token is expired! Please log in to get access 😟.', 401))

            // Send new token if expire
            authMethods.generateJwtToken(payload.id, function (res) {
                return done(null, { id: payload.id, token_expired: true, newToken: res.newToken });
            });
        } else {
            return done(null, { id: payload.id, token_expired: false });
        }
    });

    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", generalConfig.jwtSession);
        }
    };
}
