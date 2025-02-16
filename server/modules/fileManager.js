const multer = require("multer");
const path = require("path");
const fs = require('fs');

const uploadRouteImagesDir = path.join(__dirname, '..', '/storages', 'routeImages');
const uploadUserDataDir = path.join(__dirname, '..', '/storages', 'usersData');

if (!fs.existsSync(uploadRouteImagesDir) || !fs.existsSync(uploadUserDataDir)) {
    fs.mkdirSync(uploadRouteImagesDir, { recursive: true });
    fs.mkdirSync(uploadUserDataDir, {recursive: true});
};

const routeImagesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadRouteImagesDir);
    },
    
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); 
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});

const userDataStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, )
    }
})


const uploadRouteImages = multer({
    storage: routeImagesStorage,
    limits: {fileSize: 10 * 1024 * 1024}
});

module.exports = { uploadRouteImages };