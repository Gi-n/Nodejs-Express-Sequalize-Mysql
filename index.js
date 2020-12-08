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

// parse requests of content-type: application/json
app.use(bodyParser.json({ limit: '5mb' }));

// Set security HTTP headers
app.use(helmet());

// Data sanitization against XSS
app.use(xss());

app.use(cookieParser());

app.use(compression());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 5,
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