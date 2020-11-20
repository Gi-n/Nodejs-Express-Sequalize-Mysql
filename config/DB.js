module.exports = {
  //MYSQL Database configuration
  modelsDir: {
    path: __dirname + '/../models',
  },
  "db": {
    "host": process.env.DB_HOST,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": "dbo_testtable",
    "dialect": "mysql",
    "port": "3306"
  },
  "production": {
    "username": "root",
    "password": "password",
    "database": "dbo_test",
    "host": "localhost",
    "dialect": "mysql",
    "port": "3306"
  }
};
