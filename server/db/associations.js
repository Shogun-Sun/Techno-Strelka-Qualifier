const Users = require('./models/users');
const Sessions = require('./models/sessions');
const Routes = require('./models/routes');
const Points = require('./models/points');
const RoutesHistory = require('./models/routesHistory');

const setupAssociations = () => {
    Users.hasMany(Sessions, {foreignKey: 'user_id'});
    Sessions.belongsTo(Users, {foreignKey: 'user_id'});

    Routes.hasMany(Points, {foreignKey: 'route_id'});
    Points.belongsTo(Routes, {foreignKey: 'route_id'});

    Routes.hasMany(RoutesHistory, {foreignKey: 'route_id'});
    RoutesHistory.belongsTo(Routes, {foreignKey: 'route_id'});
  
    console.log("Ассоциации установлены");
  };

module.exports = setupAssociations;
