const express = require("express");
const router = express.Router();
const { sequelize } = require("../db/database");
const Points = require("../db/models/points");
const Routes = require("../db/models/routes");
const RoutesHistory = require("../db/models/routesHistory");
const { uploadImages } = require("../modules/fileManager");

router.post(
  "/route/upload/new/route",
  uploadImages.array("file"),
  async (req, res) => {
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

    const transaction = await sequelize.transaction();

    try {
      const images = req.files.map((f) => f.filename);
      const imagesPaths = images.join(",");

      if(!req.session.user){
        return res.status(401).json({message: 'Извините, вы не авторизованы'});
      };

      const route = await Routes.create({
        route_status: status || "public",
        user_id: req.session.user,
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

      await transaction.commit();
      return res.status(200).json({ message: "Маршрут успешно добавлен" });
    } catch (err) {
      await transaction.rollback();
      console.error("Ошибка при добавлении нового маршрута:", err);
      return res.status(400).json({ message: "Маршрут не сохранен" });
    }
  }
);
router.get("/route/get/all/public/routes/data", async (req, res) => {
  try {
    const routes_name = await RoutesHistory.findAll({
      attributes: [
        "route_id",
        "route_name",
        "route_description",
        "route_distance",
        "route_time",
        "route_images",
      ],
      where: {
        route_status: "new",
      },
    });

    return res.status(200).json({
      message: "Информация маршрутов успешно получена",
      data: routes_name,
    });
  } catch (err) {
    console.error("Ошибка получения информации маршрутов:", err);
    return res.status(400).json({ message: "Ошибка получения названий маршрутов" });
  }
});
router.post("/route/get/route/by/id", async (req, res) => {
  const { route_id } = req.body;
  try {
    const route_data = await RoutesHistory.findOne({
      where: { route_id },
      include: [
        {
          model: Routes,
          include: [
            {
              model: Points,
              where: { point_status: "new" },
              required: true,
            },
          ],
        },
      ],
    });

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
  uploadImages.array("file"),
  async (req, res) => {
    const {
      route_id,
      point_data,
      route_name,
      route_description,
      route_distance,
      route_time,
    } = req.body;
    const transaction = await sequelize.transaction();
    try {
      const images = req.files.map((f) => f.filename);
      const imagesPaths = images.join(",");

      const updateRoute = await RoutesHistory.create({
        route_id,
        route_name,
        route_images: imagesPaths,
        route_description,
        route_distance,
        route_time,
      });

      const updatePoints = await Points.create({
        route_id,
        point_data,
      });

      transaction.commit();

      return res.status(200).json({ message: "Маршрут успешно обновлен" });
    } catch (err) {
      transaction.rollback();
      console.error("Ошибка обновления маршрута", err);
      return res.status(500).json({ message: "Ошибка обновления маршрута" });
    }
  }
);
router.delete("/route/delete/route", async (req, res) => {
  const { route_id } = req.body;
  const transaction = await sequelize.transaction();
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

    await transaction.commit();
    return res.status(200).json({ message: "Маршрут успешно удален" });
  } catch (err) {
    transaction.rollback();
    console.error("Ошибка удаления маршрута:", err);
    return res.status(500).json({ message: "Произошла внутрення ошибка" });
  }
});

module.exports = router;
