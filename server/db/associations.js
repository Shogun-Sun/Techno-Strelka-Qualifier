const Routes = require("./models/routes");
const RoutesPoints = require("./models/routesPoints");
const Users = require('./models/users');
const Sessions = require('./models/sessions');

const setupAssociations = () => {
    Users.hasMany(Sessions, {foreignKey: 'user_id'});
    Sessions.belongsTo(Users, {foreignKey: 'user_id'});
  
    Routes.hasMany(RoutesPoints, {foreignKey: 'route_id'});
    RoutesPoints.belongsTo(Routes, {foreignKey: 'route_id'});
  
    console.log("Ассоциации установлены");
  };

module.exports = setupAssociations;
