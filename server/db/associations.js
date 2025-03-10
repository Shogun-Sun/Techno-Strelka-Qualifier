const Users = require("./models/users");
const Routes = require("./models/routes");
const Points = require("./models/points");
const RoutesHistory = require("./models/routesHistory");
const Comments = require("./models/comments");
const { Sessions } = require("./models/sessions");
const Ratings = require("./models/ratings");

const setupAssociations = () => {
  Users.hasMany(Sessions, { foreignKey: "user_id" });
  Sessions.belongsTo(Users, { foreignKey: "user_id" });

  Routes.hasMany(Points, { foreignKey: "route_id", onDelete: "CASCADE" });
  Points.belongsTo(Routes, { foreignKey: "route_id", onDelete: "CASCADE" });

  Routes.hasMany(RoutesHistory, {
    foreignKey: "route_id",
    onDelete: "CASCADE",
  });
  RoutesHistory.belongsTo(Routes, {
    foreignKey: "route_id",
    onDelete: "CASCADE",
  });

  Users.hasMany(Comments, { foreignKey: "user_id", onDelete: "CASCADE" });
  Comments.belongsTo(Users, { foreignKey: "user_id", onDelete: "CASCADE" });

  Routes.hasMany(Comments, { foreignKey: "route_id", onDelete: "CASCADE" });
  Comments.belongsTo(Routes, { foreignKey: "route_id", onDelete: "CASCADE" });

  Users.hasMany(Ratings, { foreignKey: "user_id", onDelete: "CASCADE" });
  Routes.hasMany(Ratings, { foreignKey: "route_id", onDelete: "CASCADE" });
  Ratings.belongsTo(Users, { foreignKey: "user_id" });
  Ratings.belongsTo(Routes, { foreignKey: "route_id" });

  Users.hasMany(Routes, { foreignKey: "user_id", onDelete: "CASCADE" });
  Routes.belongsTo(Users, { foreignKey: "user_id", onDelete: "CASCADE" });

  console.log("Ассоциации установлены");
};

module.exports = setupAssociations;
