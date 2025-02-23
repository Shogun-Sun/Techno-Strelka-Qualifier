const express = require("express");
const commentRouter = express.Router();
const Comments = require("../db/models/comments");
const Routes = require("../db/models/routes");
const ratingsRouter = require("./ratingsRoutes");
const Users = require("../db/models/users");
const io = require('../server');
const { checkUnSession } = require("../modules/checks");

commentRouter.post("/comment/new/route/comment", checkUnSession, async (req, res) => {
  const user_id = req.session.user.id;
  const { route_id, comment_text } = req.body;

  try {
    if (!comment_text || comment_text.length < 3 || comment_text.length > 500) {
      return res
        .status(400)
        .json({ message: "Комментарий должен содержать от 3 до 500 символов" });
    }

    const checkRoute = await Routes.findOne({
      where: { route_id },
    });
    if (!checkRoute) {
      return res
        .status(404)
        .json({ message: "Извините, данного маршрута не найдено" });
    }

    const existingComment = await Comments.findOne({
      where: { user_id, route_id, comment_text },
    });

    if (existingComment) {
      return res
        .status(409)
        .json({ message: "Вы уже оставили этот комментарий" });
    }

    const newComment = await Comments.create({
      user_id,
      route_id,
      comment_text,
    });

    io.emit("newComment", newComment);

    return res.status(200).json({ message: "Комментарий успешно опубликован" });
  } catch (err) {
    console.error("Ошибка при создании комментария", err);
    return res
      .status(500)
      .json({ message: "Не удалось опубликовать комментарий" });
  }
});

ratingsRouter.post("/comment/get/route/comments", async (req, res) => {
  const { route_id } = req.body;

  try {
    const data = await Comments.findAll({
      where: {
        route_id,
      },
      include: {
        model: Users,
        required: false,
        attributes: ["user_name", "user_lastname", "user_avatar", "user_role"],
      },
    });
    return res
      .status(200)
      .json({ message: "Комментарии успешно получены", data: data });
  } catch (err) {
    console.error("Ошибка получения кооментариев", err);
    return res.status(500).json({ message: "Не удалось получить комментарии" });
  }
});

module.exports = commentRouter;
