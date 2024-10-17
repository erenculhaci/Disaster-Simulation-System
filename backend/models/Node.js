const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Node = db.define('Node', {
    lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = Node;
