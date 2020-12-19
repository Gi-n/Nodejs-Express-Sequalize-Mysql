'use strict';

const userController = require('../controllers/userController');

module.exports = function (app) {
  // app.get('/api/user/all', user.getAllUsers);
  // app.get('/api/user/get_users', user.getUsers);
  // app.get('/api/user/:id', user.getUser);
  // app.post('/api/user/status', multipartMiddleware, user.changeStatus);
  app.post('/api/v1/users/all', userController.getAllUsers);
  // app.post('/api/user/resetPassword', user.changePassword);
  // app.delete('/api/user/delete/:id', user.deleteUser);
};