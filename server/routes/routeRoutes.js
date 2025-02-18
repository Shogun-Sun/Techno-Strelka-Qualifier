const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Points = require("../db/models/points");
const Routes = require("../db/models/routes");
const { uploadRouteImages } = require("../modules/fileManager");

router.post("/route/upload/new/route", async (req, res) => {
  const { points, description, name, distanse, time } = req.body;
  try {
    const route = await Routes.create({
      route_name: name,
      description: description,
      distance: distanse,
      time,
    });

    points.forEach(async (element) => {
      await Points.create({
        route_id: route.route_id,
        name: element.name,
        address: element.addres,
        coordinates: JSON.stringify(element.coord),
        order: element.order,
      });
    });

    const uploadImageRout = path.join(
      __dirname,
      "..",
      "storages",
      "routeImages",
      `${route.route_id}`
    );
    fs.mkdirSync(uploadImageRout, { recursive: true });

    res
      .status(200)
      .json({ message: "Маршрут успешно сохранен", id: route.route_id });
  } catch (error) {
    console.error("Ошибка при получении маршрута:", error);
    res.status(500).json({ message: "Ошибка при обработке маршрута" });
  }
});

router.post(
  "/route/upload/new/route/images",
  uploadRouteImages.array("file"),
  async (req, res) => {
    const { route_id } = req.query;
    const uploadImageRout = path.join(
      __dirname,
      "..",
      "storages",
      "routeImages",
      `${route_id}`
    );
    fs.mkdirSync(uploadImageRout, { recursive: true });

    const images = req.files.map((f) => {
      const tempPath = f.path;
      const fileName = f.filename;
      const newPath = path.join(uploadImageRout, path.basename(f.path));
      fs.renameSync(tempPath, newPath);
      return fileName;
    });

    const imagesPaths = images.join(",");

    try {
      await Routes.update(
        { route_images: imagesPaths },
        { where: { route_id: route_id } }
      );
      res
        .status(200)
        .json({
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
    res
      .status(200)
      .json({
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

module.exports = router;
