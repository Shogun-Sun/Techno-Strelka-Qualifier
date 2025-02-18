const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Routes = require('./routes');


const RoutesHistory = sequelize.define(
    'RoutesHistory', 
    {
        history_id: {
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

        old_route_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        old_route_images: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        old_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        old_distance: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        old_time: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        old_status: {
            type: DataTypes.ENUM('public', 'private'),
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