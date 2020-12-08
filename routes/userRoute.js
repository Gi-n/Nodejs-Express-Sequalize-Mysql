'use strict';

const auth = require('../controllers/authController');

module.exports = function (app) {
  // app.get('/api/user/all', user.getAllUsers);
  // app.get('/api/user/get_users', user.getUsers);
  // app.get('/api/user/:id', user.getUser);
  // app.post('/api/user/status', multipartMiddleware, user.changeStatus);
  app.post('/api/v1/auth/signup', auth.signup);
  // app.post('/api/user/resetPassword', user.changePassword);
  // app.delete('/api/user/delete/:id', user.deleteUser);
};