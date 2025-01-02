const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cocktail_app', 'root', 'Farm@Fresh10', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;

