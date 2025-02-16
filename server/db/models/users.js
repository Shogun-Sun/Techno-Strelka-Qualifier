const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Users = sequelize.define(
  "Users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },

    user_lastname: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },

    user_patronymic: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },

    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Users.beforeSave((user) => {
  if (user.user_patronymic.trim() === "") {
    user.user_patronymic = null;
  }
});

module.exports = Users;
