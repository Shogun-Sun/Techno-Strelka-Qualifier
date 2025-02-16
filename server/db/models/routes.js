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
            type: DataTypes.STRING,
            allowNull: false,
        },

        total_distance: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        total_time: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },

    {
        timestamps: true,
    }
);

module.exports = Routes;