const Users = require("./users");
const Routes = require("./routes");
const RoutesPoints = require("./routesPoints");

const syncModels = async () => {
  try {
    await Users.sync();
    await Routes.sync();
    await RoutesPoints.sync();
    console.log('Модели успешно синхронезированы')
} catch (err) {
    console.error('Ошибка синхронизации моделей: ', err);
  }
};
