const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "./database.sqlite"),
  logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({force: true});
    console.log("Успешное подключение к БД");
  } catch (error) {
    console.error("База данных не подключена", error);
  }
})();

module.exports = sequelize;
