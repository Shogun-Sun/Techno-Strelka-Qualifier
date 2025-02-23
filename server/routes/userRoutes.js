const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const Users = require("../db/models/users");
const { Sessions } = require("../db/models/sessions");
const { uploadImages } = require("../modules/fileManager");
const { checkSession, checkUnSession } = require("../modules/checks");
const fs = require("fs").promises;

const pagesPath = path.join(__dirname, "..", "..", "public", "pages");

userRouter.get("/users/log-reg/page", (req, res) => {
  res.sendFile(path.join(pagesPath, "login.html"));
});

userRouter.post("/user/reg", checkSession, async (req, res) => {
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

    const userCheck = await Users.findOne({
      where: { user_email },
    });
    if (userCheck) {
      return res
        .status(409)
        .json({ message: "Данный пользователь уже существует" });
    }

    const newUser = await Users.create({
      user_name,
      user_lastname,
      user_patronymic,
      user_email,
      user_password: hash,
      user_avatar: "cyclist.jpg",
    });

    return res
      .status(201)
      .json({ message: "Вы успешно зарегистрировались", newUser });
  } catch (err) {
    console.error("Ошибка регистрации", err);
    return res.status(400).json({ message: "Ошибка при регистрации" });
  }
});

userRouter.post("/user/log", checkSession, async (req, res) => {
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
        avatar: user.user_avatar,
      };

      return res.status(200).json({ message: "Успешный вход" });
    } else {
      return res
        .status(401)
        .json({ message: "Неверный пользователь или пароль" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка входа" });
  }
});

userRouter.post("/user/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка выхода из сессии" });
    }
    return res.status(200).json({ message: "Вы успешно вышли из сессии" });
  });
});

userRouter.get("/user/get/data", checkUnSession, async (req, res) => {
  if (req.session.user) {
    return res
      .status(200)
      .json({ message: "Данные пользователя", data: req.session.user });
  } else {
    return res.status(401).json({ message: "Извините, вы не авторизовались" });
  }
});

userRouter.post(
  "/user/upload/new/avatar",
  checkUnSession,
  uploadImages.single("file"),
  async (req, res) => {
    const user_id = req.session.user.id;
    const user_avatar = req.file.filename;

    try {
      const oldAvatar = await Users.findOne({
        attributes: ["user_avatar"],
        where: { user_id },
      });

      await fs.unlink(
        path.join(
          __dirname,
          "..",
          "storages",
          "images",
          `${oldAvatar.user_avatar}`
        )
      );

      await Users.update(
        { user_avatar },
        {
          where: { user_id },
        }
      );

      req.session.user.avatar = user_avatar;

      return res.status(200).json({ message: "Аватар успешно обновлен" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка обновления аватара" });
    }
  }
);

userRouter.patch("/user/update/user/data", checkUnSession, async (req, res) => {
  const { user_name, user_lastname, user_patronymic, user_email } = req.body;
  const user_id = req.session.user.id;
  try {
    const [updatedRows] = await Users.update(
      { user_name, user_email, user_lastname, user_patronymic },
      { where: { user_id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const new_userdata = await Users.findOne({
      where: { user_id },
    });

    req.session.user.username = new_userdata.user_name;
    req.session.user.lastname = new_userdata.user_lastname;
    req.session.user.patronymic = new_userdata.user_patronymic;
    req.session.user.email = new_userdata.user_email;

    return res.status(200).json({ message: "Данные успешно обновлены" });
  } catch (err) {
    console.error("Ошибка обновления данных:", err);
    return res.status(500).json({ message: "Ошибка обновления данных" });
  }
});

module.exports = userRouter;
