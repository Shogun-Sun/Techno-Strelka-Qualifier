require("dotenv").config();
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger.json");
const { Sessions, extendDefaultFields } = require("./db/models/sessions");

const syncModels = require("./db/syncModels");
const { connectDB } = require("./db/database");

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize } = require("./db/database");

const app = express();

(async () => {
  await connectDB();
  await syncModels();

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
        cookie: {},
    })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

//Маршруты
app.use("/storages", express.static(path.join(__dirname, "storages")));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use(require("./routes/pagesRoutes"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/routeRoutes"));

  
  app.listen(Number(process.env.PORT), () => {
    console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
    console.log(
      `Swagger доступен по адресу: http://localhost:${process.env.PORT}/doc`
    );
  });
})();
