require("dotenv").config();
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger.json");

const syncModels = require("./db/syncModels");
const { connectDB } = require("./db/database");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/storages", express.static(path.join(__dirname, "storages")));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

//Маршруты
app.use(require("./routes/pagesRoutes"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/routeRoutes"));

(async () => {
  await connectDB();
  await syncModels();
  app.listen(Number(process.env.PORT), () => {
    console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
    console.log(
      `Swagger доступен по адресу: http://localhost:${process.env.PORT}/doc`
    );
  });
})();
