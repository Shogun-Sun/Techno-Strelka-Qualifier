const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const Routes = require("../models/routes");

const Points = sequelize.define(
  "Points",
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
        key: "route_id",
      },
      allowNull: false,
    },

    point_data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Points;
