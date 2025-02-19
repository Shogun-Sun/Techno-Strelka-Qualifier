const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { sequelize } = require("../db/database");
const Points = require("../db/models/points");
const Routes = require("../db/models/routes");
const RoutesHistory = require("../db/models/routesHistory");
const { uploadRouteImages } = require("../modules/fileManager");

router.post("/route/upload/new/route", async (req, res) => {
  const {
    user_id,
    points,
    route_description,
    route_name,
    route_distance,
    route_time,
    status,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const route = await Routes.create({
      route_status: status || "public",
      user_id: user_id || null,
    });

    const routesHistory = await RoutesHistory.create({
      route_id: route.route_id,
      route_name,
      route_description,
      route_distance,
      route_time,
      route_images: "",
    });

    const point = await Points.create({
      route_id: route.route_id,
      point_data: points,
    });

    await transaction.commit();

    res
      .status(200)
      .json({ message: "Маршрут успешно сохранен", id: route.route_id });
  } catch (error) {
    await transaction.rollback();
    console.error("Ошибка при получении маршрута:", error);
    res.status(500).json({ message: "Ошибка при обработке маршрута" });
  }
});

router.post("/route/upload/new/route/images",
  uploadRouteImages.array("file"),
  async (req, res) => {
    const { route_id } = req.body;
    
    const images = req.files.map((f) => f.filename);
    const imagesPaths = images.join(",");

    try {
      await RoutesHistory.update(
        { route_images: imagesPaths },
        { where: { route_id: route_id } }
      );
      res.status(200).json({
        message: "Изображения успешно загружены",
        images: imagesPaths,
      });
    } catch (error) {
      console.error("Ошибка при обновлении маршрута:", error);
      res
        .status(500)
        .json({ message: "Ошибка при обновлении маршрута с изображениями" });
    }
  }
);

router.get("/route/get/all/public/routes/names", async (req, res) => {
  try {
    const routes_name = await Routes.findAll({
      attributes: ["route_name", "route_id"],
    });
    res.status(200).json({
      message: "Названия маршрутов успешно получены",
      data: routes_name,
    });
  } catch (err) {
    console.error("Ошибка получения маршрутов:", err);
    res.status(400).json({ message: "Ошибка получения названий маршрутов" });
  }
});

router.post("/route/get/route/by/id", async (req, res) => {
  const { route_id } = req.body;
  try {
    const data_route = await Routes.findOne({
      where: {
        route_id: route_id,
      },
      include: [
        {
          model: Points,
          where: { route_id: route_id },
          required: false,
        },
      ],
    });
    res
      .status(200)
      .json({ message: "Маршрут успешно получен", data: data_route });
  } catch (err) {
    console.error("Ошибка при получении маршрута по имени:", err);
    res.status(400).json({ message: "Ошибка получения маршрута" });
  }
});

router.post("/route/get/route/images/by/id", async (req, res) => {
  const { route_id } = req.query;
  const routeData = [];
  try {
    const photos_routes = await Routes.findOne({
      attributes: ["route_images"],
      raw: true,
      where: {
        route_id: route_id,
      },
    });
    const pr = photos_routes.route_images.split(",");
    console.log(pr);
    for (let i = 0; i < pr.length; i++) {
      routeData.push(
        `http://localhost:3000/storages/routeImages/${route_id}/${pr[i]}`
      );
    }
    res
      .status(200)
      .json({ message: "Фото успешно отправлены", data: routeData });
  } catch (err) {
    console.log("Ошибка при получении картинок маршрута: ", err);
    res.status(400).json({ message: "Не удалочь получить фото маршрута" });
  }
});

router.put(
  "/route/update/route",
  // uploadRouteImages.array("file"),
  async (req, res) => {
    const { route_id, name, description, distance, time, status } = req.body;
    // const { images } = req.files;

    const transaction = await sequelize.transaction();
    try {
      const route = await Routes.findByPk(route_id, { transaction });
      await RoutesHistory.create(
        {
          route_id,
          old_route_name: route.route_name,
          old_route_images: route.route_images,
          old_description: route.description,
          old_distance: route.distance,
          old_time: route.time,
          old_status: route.status,
          edited_at: new Date(),
        },

        { transaction }
      );

      await route.update(
        {
          route_name: name,
          description,
          distance,
          time,
          status,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(200).json({ message: "Маршрут успешно обновлен" });
    } catch (err) {
      await transaction.rollback();
      console.error("Ошибка обновления маршрута", err);
      res.status(500).json({ message: "Ошибка обновления маршрута" });
    }
  }
);

module.exports = router;
