const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Routes = sequelize.define(
    'Routes',
    {
        route_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        route_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        route_images: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        distance: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        time: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM('public', 'private'),
            allowNull: false,
            defaultValue: 'public',
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        timestamps: true, 
    }
);

module.exports = Routes;
