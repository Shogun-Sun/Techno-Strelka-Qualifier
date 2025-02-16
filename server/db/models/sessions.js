const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Users = require('./users');

const Sessions = sequelize.define(
    'Sessions', 
    {
        session_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        session_token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users,
                key: 'user_id',
            },
        },

        expiration_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = Sessions;