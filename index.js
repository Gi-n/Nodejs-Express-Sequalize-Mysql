const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require("helmet");
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const responseTime = require('response-time');
const redis = require('redis');
const { promisify } = require('util');

const app = express();

var port = process.env.PORT || 3001;
dotenv.config({ path: './config.env' });

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.demo.com, front-end demoproject.com
// app.use(cors({
//   origin: 'https://www.demo.com'
// }))

app.use(express.json({ extended: false }));
// parse requests of content-type: application/json
app.use(bodyParser.json({ limit: '5mb' }));

// Set security HTTP headers
app.use(helmet());


// Data sanitization against XSS
app.use(xss());

app.use(cookieParser());

app.use(compression({
    level: 6,
    threshold: 10 * 1000, // less than 50kb no need to compress.
    filter: function (req, res) {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false
        }
        // fallback to standard filter function
        return compression.filter(req, res)
    }
}));

// response Time
app.use(responseTime());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 15,
    windowMs: 1 * 60 * 1000,
    message: 'Too many requests from this IP, please try again after sometime 😅!'
});

app.use('/api', limiter);

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// admin route
var adminrouter = require('./routes/adminRoutes');
adminrouter(app);

// set port, listen for requests
app.listen(port, () => console.log(`Server is running on port ${port} 💣.`));


process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});