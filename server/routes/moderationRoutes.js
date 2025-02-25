const express = require("express");
const Users = require("../db/models/users");
const Routes = require("../db/models/routes");
const RoutesHistory = require("../db/models/routesHistory");
const Points = require("../db/models/points");
const moderationRouter = express.Router();

moderationRouter.get("/moderation/get/all/users", async (req, res) => {
  try {
    const data = await Users.findAll();
    return res
      .status(200)
      .json({ message: "пользователи успешно получены", data });
  } catch (error) {
    console.error("Ошибка получения пользователей", error);
    return res.status(400).json({ message: "Ошибка получения пользователей" });
  }
});

moderationRouter.post("/moderation/grant/new/role", async (req, res) => {
  const { user_id, user_role } = req.body;
  const roles = ["user", "moder"];
  try {
    if (!roles.includes(user_role)) {
      return res.status(400).json({ message: "Данной роли не существует" });
    }

    if (req.session.user) {
      req.session.user.role = user_role;
    }

    await Users.update({ user_role }, { where: { user_id } });

    return res.status(200).json({ message: "Роль успешно обновлена" });
  } catch (err) {
    console.error("Ошибка обновления роли,", err);
    return res.status(400).json({ message: "Ошибка обновления роли" });
  }
});

moderationRouter.get(
  "/moderation/get/all/public/unverifi/routes",
  async (req, res) => {
    try {
      const data = await Routes.findAll({
        where: {
          route_status: "public",
          route_verifi: false,
        },
        include: [
          {
            model: RoutesHistory,
            where: {
              route_status: "new",
            },
          },
          {
            model: Points,
            where:  {
              point_status: "new",
            }
          }
        ],
      });

      return res
        .status(200)
        .json({ message: "Маршруты успешно получены", data });
    } catch (error) {
      console.error("Ошибка получение маршрутов:", error);
      return res.status(500).json({ message: "Ошибка получения маршрутов" });
    }
  }
);

moderationRouter.post("/moderation/set/verifi", async (req, res) => {
  const { route_id, route_verifi } = req.body;
  try {
    if (route_verifi == true) {
      await Routes.update(
        { route_verifi },
        {
          where: {
            route_id,
          },
        }
      );
    } else {
      await Routes.update(
        { route_verifi, route_status: "private" },
        {
          where: {
            route_id,
          },
        }
      );
    }

    return res.status(200).json({ message: "Статус успешно обновлен" });
  } catch (error) {
    console.error("Ошибка обновления статуса маршрута:", error);
    return res.status(500).json({ message: "Статус  не обновлен" });
  }
});

module.exports = moderationRouter;
