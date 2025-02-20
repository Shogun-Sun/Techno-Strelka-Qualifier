const { DataTypes } = require("sequelize");
const { sequelize } = require("../database"); // Путь к вашему экземпляру Sequelize
const Users = require("./users"); // Путь к модели Users

const Sessions = sequelize.define(
    "Session",
    {
        sid: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Users,
                key: "user_id",
            },

        },
        expires: {
            type: DataTypes.DATE,
        },
        data: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: "Sessions",
        timestamps: false,
    }
);

function extendDefaultFields(defaults, session) {
    return {
        data: defaults.data,
        expires: defaults.expires,
        user_id: session.userId,
        test: session.test,
    };
  }

module.exports = { Sessions, extendDefaultFields };