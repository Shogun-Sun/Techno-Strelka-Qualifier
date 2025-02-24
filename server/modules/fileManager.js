const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const storagesDir = path.join(__dirname, "..", "storages");
const uploadImagesDir = path.join(storagesDir, "images");

[storagesDir, uploadImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const sourceFile = path.join(__dirname, "..", "..", "public", "css", "pictures", "cyclist.jpg");
const destinationFile = path.join(uploadImagesDir, "cyclist.jpg");

fs.copyFile(sourceFile, destinationFile, (err) => {

});

const imagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadImagesDir);
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

const uploadImages = multer({
  storage: imagesStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: routeImagesFilter,
});

const userDataStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null);
  },
});

module.exports = { uploadImages };
