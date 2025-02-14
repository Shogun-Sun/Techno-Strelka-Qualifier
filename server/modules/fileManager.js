const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'images'));
    },
    
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); 
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024}
});

module.exports = upload;