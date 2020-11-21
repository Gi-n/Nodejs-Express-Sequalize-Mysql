'use strict'
var db = require('../config/sequelize').db;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTests = catchAsync(async (req, res, next) => {

    const response = await db.models.test.findAll({
        attributes: ['id', 'test_name', 'active'],
        where: {
            deleted_at: null,
            active: 0
        }
    })
    console.log(response)
    if (response.length === 0) return next(new AppError('No Entries found', 404))
 
    res.json({ message: 'Test completed successfully 😃😄', error: false, data: response });

    // .then(function (roles) {
    //     if (roles) {
    //         res.json({ message: 'Test completed successfully 😃😄', error: false, data: roles });
    //     } else {
    //         res.json({ message: 'No test entries found', error: true, data: null });
    //     }
    // })
    // .catch(function (err) {
    //     res.json({ message: 'Oops! Something went wrong.', error: true, data: null });
    // })
})