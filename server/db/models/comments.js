const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Users = require('./users');
const Routes = require('./routes');

const Comments = sequelize.define(
    'Comments',
    {
        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Users,
                key: 'user_id',
            }
        },

        route_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Routes,
                key: 'route_id',
            },
        },

        comment_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },

    },
    {
        timestamps: true,
    }

);

module.exports = Comments;