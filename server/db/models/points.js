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

    point_status: {
      type: DataTypes.ENUM("new", "old"),
      allowNull: false,
      defaultValue: "new",
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

Points.beforeCreate(async (newPointHistory, options) => {
  await Points.update(
    { point_status: "old" },
    { where: { point_id: newPointHistory.route_id } }
  );
});

module.exports = Points;
