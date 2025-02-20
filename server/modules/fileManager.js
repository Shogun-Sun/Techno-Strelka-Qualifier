const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const storagesDir = path.join(__dirname, "..", "storages");
const uploadRouteImagesDir = path.join(storagesDir, "routeImages");
const userSessionsDataDir = path.join(storagesDir, "userSessionsData");

[storagesDir, uploadRouteImagesDir, userSessionsDataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});


const routeImagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadRouteImagesDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const routeImagesFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "imeges/jpg",
    "image/png",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Недопустимое расширение файла"), false);
  }
};

const uploadRouteImages = multer({
  storage: routeImagesStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: routeImagesFilter,
});

const userDataStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null);
  },
});

module.exports = { uploadRouteImages };
