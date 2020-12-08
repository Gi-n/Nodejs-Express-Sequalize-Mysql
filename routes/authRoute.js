'use strict'
const auth = require('../controllers/authController');

module.exports = function(app){
    app.post('/api/auth/login', auth.login);
    app.post('/api/auth/signup', auth.signup);
    app.get('/api/auth/logout', auth.logout);
}