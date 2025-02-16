const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Routes = require('./routes');


const RoutesPoints = sequelize.define(
    "RoutesPoints",
    {
        point_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        route_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Routes,
                key: 'route_id',
            },
        },

        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },

    {
        timestamps: false,
    }
);

module.exports = RoutesPoints;