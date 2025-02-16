const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Routes = require('../models/routes'); 

const Points = sequelize.define(
    'Points',
    {
        point_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        route_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Routes,
                key: 'route_id',
            },
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        coordinates: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true, 
    }
);


module.exports = Points;
