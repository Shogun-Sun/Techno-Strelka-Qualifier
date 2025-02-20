const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize } = require("../db/database");
const { Sessions, extendDefaultFields } = require("../db/models/sessions");

const sessionSettings = (app) => {
  const sessionStore = new SequelizeStore({
    db: sequelize,
    table: "Session",
    extendDefaultFields: extendDefaultFields,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: null,
      },
    })
  );
};

module.exports = sessionSettings;