const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const morgan = require('morgan');

const app = express();

var port = process.env.PORT || 3000;
dotenv.config({ path: './config.env' });

// parse requests of content-type: application/json
app.use(bodyParser.json({ limit: '5mb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// admin route
var adminrouter = require('./routes/adminRoutes');
adminrouter(app);

// set port, listen for requests
app.listen(port, () => console.log(`Server is running on port ${port} 💣.`));

