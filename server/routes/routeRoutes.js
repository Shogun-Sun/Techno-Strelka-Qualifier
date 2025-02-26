const express = require("express");
const router = express.Router();
const Points = require("../db/models/points");
const Routes = require("../db/models/routes");
const RoutesHistory = require("../db/models/routesHistory");
const { uploadImages } = require("../modules/fileManager");
const { checkUnSession, checkSession } = require("../modules/checks");
const roleCheck = require("../modules/roleCheck");

router.post(
  "/route/upload/new/route",
  roleCheck(["user", "moder"]),
  checkUnSession,
  uploadImages.array("file"),
  async (req, res) => {
    const user_id = req.session.user.id;
    const {
      route_description,
      route_name,
      route_distance,
      route_time,
      status,
    } = req.body;

    let { point_data } = req.body;

    if (typeof point_data === "string") {
      point_data = JSON.parse(point_data);
    }

    try {
      const imagesPaths = req.files.map((f) => f.filename).join(",");

      const route = await Routes.create({
        route_status: status || "private",
        user_id: user_id,
      });

      const routesHistory = await RoutesHistory.create({
        route_id: route.route_id,
        route_name,
        route_description,
        route_distance,
        route_time,
        route_images: imagesPaths,
      });

      const point = await Points.create({
        route_id: route.route_id,
        point_data,
      });

      return res.status(200).json({ message: "Маршрут успешно добавлен" });
    } catch (err) {
      console.error("Ошибка при добавлении нового маршрута:", err);
      return res.status(400).json({ message: "Маршрут не сохранен" });
    }
  }
);

router.get("/route/get/all/public/routes/data", async (req, res) => {
  try {
    const publicRouteData = await Routes.findAll({
      where: {
        route_status: "public",
        route_verifi: true,
      },
      include: [
        {
          model: RoutesHistory,
          where: {
            route_status: "new",
          },
        },
      ],
    });

    return res.status(200).json({
      message: "Информация маршрутов успешно получена",
      data: publicRouteData,
    });
  } catch (err) {
    console.error("Ошибка получения информации маршрутов:", err);
    return res
      .status(400)
      .json({ message: "Ошибка получения названий маршрутов" });
  }
});
router.post("/route/get/route/by/id", async (req, res) => {
  const { route_id } = req.body;
  try {

    const route_data = await Routes.findOne({
      where: { route_id },
      include: [
        {
        model: RoutesHistory,
        where: {
          route_status: "new",
        },
        required: true,
        },
        {
          model: Points,
          where: { point_status: "new" },
          required: true,
        }
      ]
    })

    return res
      .status(200)
      .json({ message: "Маршрут успешно получен", data: route_data });
  } catch (err) {
    console.error("Ошибка при получении маршрута:", err);
    return res.status(400).json({ message: "Ошибка получения маршрута" });
  }
});

router.post(
  "/route/update/route",
  checkUnSession,
  uploadImages.array("file"),
  async (req, res) => {
    const {
      route_id,
      route_name,
      route_description,
      route_distance,
      route_time,
      status
    } = req.body;

    let { point_data } = req.body;

    if (typeof point_data === "string") {
      point_data = JSON.parse(point_data);
    }
    
    try {
      const imagesPaths = req.files.map((f) => f.filename).join(",");

      await RoutesHistory.create({
        route_id,
        route_name,
        route_images: imagesPaths || route_images,
        route_description,
        route_distance,
        route_time,
        route_status: status || "private",
      });

      await Points.create({
        route_id,
        point_data,
      });
      return res.status(200).json({ message: "Маршрут успешно обновлен" });
    } catch (err) {
      console.error("Ошибка обновления маршрута", err);
      return res.status(500).json({ message: "Ошибка обновления маршрута" });
    }
  }
);

router.delete("/route/delete/route", checkUnSession, async (req, res) => {
  const { route_id } = req.body;
  try {
    await RoutesHistory.destroy({
      where: { route_id },
    });

    await Points.destroy({
      where: { route_id },
    });

    await Routes.destroy({
      where: { route_id },
    });

    return res.status(200).json({ message: "Маршрут успешно удален" });
  } catch (err) {
    console.error("Ошибка удаления маршрута:", err);
    return res.status(500).json({ message: "Произошла внутрення ошибка" });
  }
});

router.get("/rote/get/all/user/routes", checkUnSession, async (req, res) => {
  const user_id = req.session.user.id;
  try {
    const allUserRoutes = await Routes.findAll({
      where: { user_id },
      include: [
        {
          model: RoutesHistory,
          required: true,
        },
      ],
    });
    console.log(allUserRoutes);

    return res
      .status(200)
      .json({ message: "Маршруты успешно получены", data: allUserRoutes });
  } catch (err) {
    console.error("Ошибка получения маршрутов пользователя:", err);
    return res.status(500).json({ message: "Ошибкаполучения маршрутов" });
  }
});

router.post("/route/set/route/public", checkUnSession, async (req, res) => {
  const { route_id } = req.body;
  try {
    await Routes.update({ route_status: "public" }, { where: { route_id } });
    return res.status(200).json({ message: "Статус обнавлен" });
  } catch (error) {
    console.error("Ошибка обновления статуса", error);
    return res.status(400).json({ message: "Ошибка обновления статуса" });
  }
});

router.post("/route/get/route/history/by/id", async (req, res) => {
  const { route_id } = req.body;
  try {

    const route_data = await Routes.findOne({
      where: { route_id },
      include: [
        {
        model: RoutesHistory,
        required: true,
        },
        {
          model: Points,
          required: true,
        }
      ]
    })

    return res
      .status(200)
      .json({ message: "История маршрута успешно получена", data: route_data });
  } catch (err) {
    console.error("Ошибка при получении маршрута:", err);
    return res.status(400).json({ message: "Ошибка получения истории маршрута" });
  }
});
module.exports = router;
