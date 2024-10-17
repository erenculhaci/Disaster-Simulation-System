const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('communication_tower_db', 'postgres', 'eren1234', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;
