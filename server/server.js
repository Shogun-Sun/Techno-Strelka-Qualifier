require("dotenv").config();
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger.json");

const {uploadRouteImages} = require("./modules/fileManager");
const syncModels = require("./db/syncModels");
const { connectDB } = require("./db/database");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

//Маршруты
app.use(require('./routes/pagesRoutes'));
app.use(require('./routes/userRoutes'));

app.post("/upload/new/route", async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ message: "Маршрут успешно получен" });
  } catch (error) {
    console.error("Ошибка при получении маршрута:", error);
    res.status(500).json({ message: "Ошибка при обработке маршрута" });
  }
});

app.post("/upload/images", uploadRouteImages.array("file"), (req, res) => {
  try {
    res.status(200).json({ message: "Файл успешно загружен" });
  } catch (err) {
    res.status(400).json({ message: "Произошла ошибка при загрузке файла" });
  }
});

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
