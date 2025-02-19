const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Routes = require('./routes');


const RoutesHistory = sequelize.define(
    'RoutesHistory', 
    {
        route_history_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        route_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Routes,
                key: 'route_id',
            },
        },

        route_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        route_images: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        route_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        route_distance: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        route_time: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        edited_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = RoutesHistory;