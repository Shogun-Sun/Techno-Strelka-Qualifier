const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Users = require('./users');
const Routes = require('./routes');

const Ratings = sequelize.define(
    'Ratings',
    {
        rating_id: {
            type: DataTypes.INTEGER,
            autoIncremen: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users,
                key: 'user_id',
            },
        },

        route_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Routes,
                key: 'route_id',
            },
        },

        rating: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                isIn: [[-1, 1]],
            },            
        },
    },
    {
        tableName: "Ratings",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'route_id'],
            },
        ],
    },
);

module.exports = Ratings;