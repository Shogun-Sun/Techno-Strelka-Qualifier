const { sequelize } = require('./database');
const setupAssociations = require('./associations');

const syncModels = async () => {
    try {
      setupAssociations();
      await sequelize.sync(); 
      console.log('Модели успешно синхронизированы');
    } catch (err) {
      console.error('Ошибка синхронизации моделей: ', err);
    }
  };

module.exports = syncModels;