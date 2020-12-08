'use strict';

var db = require('../config/sequelize').db;
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const commonConfig = require('../config/commonConfig');
const databaseBackup = require('../utils/DB_BACKUP');
const cron = require('node-cron')

// SCHEDULE CRON FOR DATABACK BACKUP EVERY DAY
cron.schedule('00 01 * * *', () => {
    databaseBackup.DB_BACKUP();
});

const createSendToken = async (user, statusCode, req, res) => {
    // GENERATE AND SIGNIN TOKEN
    const token = await commonConfig.signToken(user.id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // 1) verify token
    //  const decoded = await promisify(jwt.verify)(
    //     token,
    //     process.env.JWT_SECRET
    //   );

    //   console.log("verifed token", decoded);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({ message: 'LoggedIn successfully 😃😄', status: 'success', data: user, token });
};


exports.signup = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    if (password.length < 6) return next(new AppError('The password length should be atleast 6 characters.', 403));

    let hasedPassword = await commonConfig.encryptPassword(password);

    const newUser = await db.models.user.create({
        email,
        password: hasedPassword
    });

    if (!newUser) return next(new AppError('User Registration Unsuccessful.', 401));

    // remove password from Response
    newUser.password = undefined;
    res.status(201).json({
        status: 'success',
        message:'User Created Successfully 😃.',
        newUser
    });
});



exports.login = catchAsync(async (req, res, next) => {
    const { email, password, active } = req.body;

    // 1) Check if email and password exist
    if (!email && !password) return next(new AppError('Please provide email and password!', 400));
    if (active != 1) return next(new AppError('Please provide active user email and password 😕!', 404))

    // 2) Check if user exists && password is correct
    const user = await db.models.user.findOne({ where: { email, active } });

    if (!user || !(await commonConfig.validPassword(user.password, password)))
        return next(new AppError('Incorrect email or password 😟', 401));

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
});


exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully !🙂' });
};
