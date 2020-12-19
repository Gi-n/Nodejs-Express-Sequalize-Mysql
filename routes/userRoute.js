'use strict';

const userController = require('../controllers/userController');

module.exports = function (app) {
  app.post('/api/v1/users/all', userController.getAllUsers);
};
