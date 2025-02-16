require("dotenv").config();
const express = require("express");
const path = require("path");
const pageRoutes = require("./routes/pagesRoutes");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger.json");
const bcrypt = require("bcrypt");

const Users = require("./db/models/users");

const upload = require("./modules/fileManager");
const syncModels = require("./db/syncModels");
const { connectDB } = require("./db/database");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use(pageRoutes);

app.post("/users/reg", async (req, res) => {
  const {
    user_name,
    user_lastname,
    user_patronymic,
    user_email,
    user_password,
  } = req.body;

  try {
    const saltRounds = Number(process.env.SALT);
    if (isNaN(saltRounds)) throw new Error("SALT в .env не является числом");

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user_password, salt);

    const newUser = await Users.create({
      user_name,
      user_lastname,
      user_patronymic,
      user_email,
      user_password: hash,
    });

    res.status(201).json({ message: "Вы успешно зарегистрировались", newUser });
  } catch (err) {
    console.error("Ошибка регистрации", err);
    res.status(400).json({ message: "Ошибка при регистрации" });
  }
});

app.post("/users/log", async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await Users.findOne({ where: { user_email } });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (isMatch) {
      res.status(200).json({ message: "Успешный вход" });
    } else {
      res.status(400).json({ message: "Неверный пользователь или пароль" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка входа" });
  }
});

app.post("/upload/new/route", async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ message: "Маршрут успешно получен" });
  } catch (error) {
    console.error("Ошибка при получении маршрута:", error);
    res.status(500).json({ message: "Ошибка при обработке маршрута" });
  }
});

app.post("/upload/images", upload.array("file"), (req, res) => {
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
