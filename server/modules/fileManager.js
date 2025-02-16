const multer = require("multer");
const path = require("path");
const fs = require('fs');

const storagesDir = path.join(__dirname, '..', '/storages');
const uploadRouteImagesDir = path.join(__dirname, '..', '/storages', 'routeImages');
const uploadUserDataDir = path.join(__dirname, '..', '/storages', 'usersData');

if (!fs.existsSync(storagesDir)|| !fs.existsSync(uploadRouteImagesDir) || !fs.existsSync(uploadUserDataDir) ) {
    fs.mkdirSync(storagesDir, {recursive: true});
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

const routeImagesFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'imeges/jpg', 'image/png', 'image/gif'];

    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    } else{
        cb(new Error('Недопустимое расширение файла'), false);
    }
};

const uploadRouteImages = multer({
    storage: routeImagesStorage,
    limits: {fileSize: 4 * 1024 * 1024},
    fileFilter: routeImagesFilter,
});


const userDataStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, )
    }
})


module.exports = { uploadRouteImages };