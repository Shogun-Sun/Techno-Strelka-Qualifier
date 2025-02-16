const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require("path");
const Points = require("../db/models/points");
const Routes = require('../db/models/routes');
const {uploadRouteImages} = require("../modules/fileManager");

router.post("/route/upload/new/route", async (req, res) => {
    const {points, description, name, distanse, time } = req.body;
    try {
      const route = await Routes.create({
        route_name: name,
        description: description,
        distance: distanse,
        time,
      });
  
      points.forEach(async element =>  {
  
        await Points.create({
          route_id: route.route_id,
          name: element.name,
          address: element.addres,
          coordinates: JSON.stringify(element.coord),
          order: element.order,
        });
      });
  
      const uploadImageRout = path.join(__dirname, '..', 'storages', 'routeImages', `${route.route_id}`);
      fs.mkdirSync(uploadImageRout, { recursive: true });
  
      res.status(200).json({ message: "Маршрут успешно сохранен", id: route.route_id });
    } catch (error) {
      console.error("Ошибка при получении маршрута:", error);
      res.status(500).json({ message: "Ошибка при обработке маршрута" });
    }
  });
  
  router.post("/route/upload/new/route/images", uploadRouteImages.array("file"), async (req, res) => {
    const { route_id } = req.query;
    console.log(route_id);
  
    const uploadImageRout = path.join(__dirname, 'storages', 'routeImages', `${route_id}`);
    fs.mkdirSync(uploadImageRout, { recursive: true });
  
    const images = req.files.map(f => {
        const tempPath = f.path;
        const newPath = path.join(uploadImageRout, path.basename(f.path));
        fs.renameSync(tempPath, newPath);
        return newPath;
    });
  
    const imagesPaths = images.join(', '); 
  
    try {
      await Routes.update(
        { route_images: imagesPaths }, 
        { where: { route_id: route_id } }
      );
  
      console.log(images);
      res.status(200).json({ message: "Изображения успешно загружены", images: imagesPaths });
    } catch (error) {
      console.error("Ошибка при обновлении маршрута:", error);
      res.status(500).json({ message: "Ошибка при обновлении маршрута с изображениями" });
    }
  });

  module.exports = router;