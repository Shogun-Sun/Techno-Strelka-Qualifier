const express = require("express");
const router = express.Router();
const path = require("path");

const pagesPath = path.join(__dirname, "..", "..", "public", "pages");

router.get("/", (req, res) => {
  res.sendFile(path.join(pagesPath, "index.html"));
});

router.get('/users/log-reg/page' , (req, res) => {
  res.sendFile(path.join(pagesPath, 'login.html'));
})

router.get('/map', (req, res) => {
  res.sendFile(path.join(pagesPath, 'maps.html'));
})

module.exports = router;
