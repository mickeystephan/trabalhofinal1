const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Order = db.define('Order', {
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Order;