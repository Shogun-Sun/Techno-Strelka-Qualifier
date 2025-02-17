const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");

const Users = require("../db/models/users");

const pagesPath = path.join(__dirname, "..", "..", "public", "pages");
userRouter.get("/users/log-reg/page", (req, res) => {
  res.sendFile(path.join(pagesPath, "login.html"));
});

userRouter.post("/user/reg", async (req, res) => {
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

userRouter.post("/user/log", async (req, res) => {
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

module.exports = userRouter;
