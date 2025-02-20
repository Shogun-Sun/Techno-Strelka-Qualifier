const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const Users = require("../models/users");

const Session = sequelize.define(
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
        key: "id",
      },
      onDelete: "CASCADE",
    },
    expires: {
      type: DataTypes.DATE,
    },
    data: {
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = Session;
