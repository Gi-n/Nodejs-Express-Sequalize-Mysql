var generalConfig = require('../config/generalConfig');

module.exports = function (sequelize, DataTypes) {

    var test = sequelize.define('test', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        test_name: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {
        freezeTableName: true,
        tableName: generalConfig.table_prefix + 'test'
    });

    return test;
};