const { setupMaster } = require('cluster');
var fs = require('fs');
var path = require('path');
var { Sequelize, DataTypes } = require('sequelize');
var config = require('./DB');
var db = {};

//Database connection
var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  logging: function (str) {
    console.log(str);
  },
  define: {
    "paranoid": false,
    "timestamps": false,
    "freezeTableName": true,
    "underscored": true
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(config.modelsDir.path)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'data');
  })
  //import model files and save model names
  .forEach(function (file) {
    const model = require(path.join(config.modelsDir.path, file))(sequelize, Sequelize.DataTypes)

    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].options.hasOwnProperty('classMethods')) {
    db[modelName].options.classMethods.associate(db)
  }
});


module.exports = {
  db: sequelize
};
