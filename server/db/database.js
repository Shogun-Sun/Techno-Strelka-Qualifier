const { Sequelize } = require("sequelize");
const path = require("path");

//Подключение к базе данных
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "./database.sqlite"),
  logging: false
});

//Инициализация подключения
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Успешное подключение к БД");
  } catch (error) {
    console.error("База данных не подключена", error);
  }
};

module.exports = { sequelize, connectDB };
