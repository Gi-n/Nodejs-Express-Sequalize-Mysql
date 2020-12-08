const cron = require('node-cron')
const moment = require('moment')
const fs = require('fs')
const mysqldump = require('mysqldump');
var path = require("path");
const AppError = require('../utils/appError')
const readFolder = require('./readFolderFiles');

exports.DB_BACKUP = async (req, res, next) => {
    // Use moment.js or any other way to dynamically generate file name
    const fileName = `${process.env.DB_TABLE}_${moment().format('YYYY-MM-DD')}.sql`

    const tenthDay = await moment().subtract(10, 'days').startOf('day').format('YYYY-MM-DD')
    
    console.log("==========================");
    console.log('RUNNING DATABASE BACKUP 🏃');
    console.log("==========================");

    const DIRNAME = path.normalize(__dirname + `/../public/DB_BACKUP`);

    // return the dump from the function and not to a file
    const result = await mysqldump({
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_TABLE,
        },
        dumpToFile: `${DIRNAME}/${fileName}`,
        compressFile: true,
    });

    const removeFile = `${DIRNAME}/${process.env.DB_TABLE}_${tenthDay}.sql`
    console.log(removeFile);

    if (!result) {
        console.log("==========================");
        console.log('DATABASE BACKUP UNSUCCESSFUL 😫');
        console.log("==========================");
        return false;
    }

    console.log("==========================");
    console.log('DATABASE BACKUP COMPLETED ⏱');
    console.log("==========================");

    readFolder.readFiles(fileName,removeFile);
}