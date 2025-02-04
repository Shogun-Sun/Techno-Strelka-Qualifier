require("dotenv").config();
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger.json");
const bcrypt = require("bcrypt");

const Users = require("./db/models/users");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// app.get('/', (req, res) => {
//     res.send('Hello world!');
// });

app.post("/users/reg", async (req, res) => {
  const {
    user_name,
    user_lastname,
    user_patronymic,
    user_email,
    user_password,
  } = req.body;

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hash = await bcrypt.hash(user_password, salt);

  try {
    const newUser = await Users.create({
      user_name,
      user_lastname,
      user_patronymic,
      user_email,
      user_password: hash,
    });

    res.status(201).json({ message: "Вы успешно зарегестрировались", newUser });
  } catch (err) {
    console.error("Ошибка регистраии", err);
    res.status(400).json({ message: "Ошибка при регистрации" });
  }
});

app.post("/users/log", async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        user_email,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
    } else {
      if (await bcrypt.compare(user_password, user.user_password)) {
        res.status(200).json({ message: "Успешный вход" });
      } else {
        res.status(404).json({ message: "Неверный пользователь или пароль" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Ошибка входа" });
  }
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
  console.log(
    `Swagger доступен по адресу: http://localhost:${process.env.PORT}/doc`
  );
});
