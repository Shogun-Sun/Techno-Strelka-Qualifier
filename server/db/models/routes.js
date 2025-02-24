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
      defaultValue: "privte",
    },

    route_verifi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Users,
            key: 'user_id',
        }
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: (route, options) => {
        if(route.route_status === "private"){
          route.route_verifi = false;
        } else{
          route.route_verifi = false;
        }
      },

      beforeUpdate: (route, options) => {
        if (route.route_status === "private") {
          route.route_verifi = false;
        } else {
          route.route_verifi = false;
        }
      }
    }
  }
);

module.exports = Routes;
