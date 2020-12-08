const crypto = require('crypto');
const AppError = require('../utils/appError')
const argon2 = require('argon2');
const moment = require('moment')
const jwt = require('jsonwebtoken')

// Auto Generate SALT_KEY;
const SALT_KEY = () => {
    let saltlength = 64;
    return crypto.randomBytes(saltlength).toString('hex');
}

// Generate HasedPassword
const encryptPassword = async password => {
    if (!password) return next(new AppError('Password is Required.', 403));

    // Automatically salt will be generated
    const salt = SALT_KEY();
    return argon2.hash(password, salt);
}

// ValidatePassword
const validPassword = async (hasedPassword, password) => {
    if (!password) return next(new AppError('Password is Required.', 403));

    return argon2.verify(hasedPassword, password);
}

const signToken = id => {
    if (!id) return next(new AppError('Id is Required.', 403));

    var expireDate = moment().add(12, 'months').valueOf();
    var payload = {
        id: id,
        expDate: expireDate
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
}

function generateJwtToken(id, res) {
    if (!id) return next(new AppError('Id is Required.', 403));
    res({ newToken: signToken(id) });
}

module.exports = {
    generateJwtToken: generateJwtToken,
    encryptPassword: encryptPassword,
    signToken: signToken,
    validPassword: validPassword,
}