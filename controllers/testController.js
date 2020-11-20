'use strict'
var db = require('../config/sequelize').db;

exports.getAllTests = (req, res, next) => {
    
    db.models.test.findAll({
        attributes: ['id', 'test_name', 'active'],
        where: {
          deleted_at: null
        }
      })
        .then(function (roles) {
          if (roles) {
            res.json({ message: 'Test completed successfully 😃😄', error: false, data: roles  });
          } else {
            res.json({ message: 'No test entries found', error: true, data: null });
          }
        })
        .catch(function (err) {
          res.json({ message: 'Oops! Something went wrong.', error: true, data: null });
        })
}