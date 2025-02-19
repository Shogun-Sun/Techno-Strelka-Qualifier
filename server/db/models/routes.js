const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const Users = require("./users");

const Routes = sequelize.define(
  "Routes",
  {
    route_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    route_status: {
      type: DataTypes.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "public",
    },

    // user_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    //     references: {
    //         model: Users,
    //         key: 'user_id',
    //     }
    // },
  },
  {
    timestamps: false,
  }
);

module.exports = Routes;
