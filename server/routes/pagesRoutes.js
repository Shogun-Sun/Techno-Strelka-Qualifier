const express = require("express");
const router = express.Router();
const path = require("path");

const pagesPath = path.join(__dirname, "..", "..", "public", "pages");

router.get("/", (req, res) => {
  res.sendFile(path.join(pagesPath, "main_page.html"));
});
router.get('/map', (req, res) => {
  res.sendFile(path.join(pagesPath, 'createMap.html'));
})
router.get('/main', (req, res) => {
  res.sendFile(path.join(pagesPath, 'main_page.html'));
})

module.exports = router;
