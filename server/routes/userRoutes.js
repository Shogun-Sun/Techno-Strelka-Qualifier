const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const Users = require("../db/models/users");
const { Sessions } = require("../db/models/sessions");

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
    const saltRounds = Number(process.env.SALT) || 10;

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
      const activeSessionsCount = await Sessions.count({
        where: { user_id: user.user_id },
      });

      if (activeSessionsCount >= Number(process.env.MAX_SESSIONS)) {
        const oldSession = await Sessions.findOne({
          where: { user_id: user.user_id },
          order: [["expires", "ASC"]],
        });

        if (oldSession) {
          await oldSession.destroy();
        }
      }

      req.session.userId = user.user_id;
      req.session.user = {
        id: user.user_id,
        username: user.user_name,
        lastname: user.user_lastname,
        patronymic: user.user_patronymic,
        email: user.user_email,
        role: user.user_role,
      };

      res.status(200).json({ message: "Успешный вход" });
    } else {
      res.status(401).json({ message: "Неверный пользователь или пароль" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка входа" });
  }
});

userRouter.get("/user/get/data", async (req, res) => {
  if (req.session.user) {
    res
      .status(200)
      .json({ message: "Данные пользователя", data: req.session.user });
  } else {
    res.status(401).json({ message: "Извините, вы не авторизовались" });
  }
});

module.exports = userRouter;
