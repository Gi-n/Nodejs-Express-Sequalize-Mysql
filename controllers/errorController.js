

const sendErrorDev = (err, res) => {
    // console.log('err.name', err);
    // console.log('err.message', err.message);
    // console.log(err.errors[0]);
    // const errMessage = err.errors.ValidationErrorItem.message.split('.')[1]
    
    if (err.name === 'SequelizeUniqueConstraintError' ||  err.name === 'SequelizeValidationError' ) {
        let errorList = err.errors.map(e => {
            let obj = {}
            obj[e] = e.message
            return obj;
        })
        const errors = errorList.map(i => Object.keys(i).map(key => i[key]));
        let errMessage = errors[0][0].split('.')[1];
        const error = {
            statusCode: 400,
            status: false,
            stack: errorList,
            message: errMessage === '' || undefined ? err.message : errMessage 
            // message: err.name === 'SequelizeValidationError' ? 'Validation error 😞' : 'Duplicate entry found😕',
        }
        sendErrorResponse(error, res);
    } else {
        sendErrorResponse(err, res);
    }
}

const sendErrorResponse = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({ status: err.status, message: err.message });
    } else {
        res.status(500).json({ status: 'error', message: 'Something went very wrong!' });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        sendErrorProd(error, res);
    }
};