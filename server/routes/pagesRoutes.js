const express = require("express");
const router = express.Router();
const path = require("path");
const roleCheck = require("../modules/roleCheck");

const pagesPath = path.join(__dirname, "..", "..", "public", "pages");

router.get("/", (req, res) => {
  res.sendFile(path.join(pagesPath, "main_page.html"));
});
router.get("/map", roleCheck(["user"]), (req, res) => {
  res.sendFile(path.join(pagesPath, "createMap.html"));
});
router.get("/log-reg", (req, res) => {
  res.sendFile(path.join(pagesPath, "login.html"));
});
router.get("/main", (req, res) => {
  res.sendFile(path.join(pagesPath, "main_page.html"));
});
router.get("/profile", roleCheck(["user"]), (req, res) => {
  res.sendFile(path.join(pagesPath, "profile.html"));
});
router.get("/allroutes", (req, res) => {
  res.sendFile(path.join(pagesPath, "getRoutes.html"))
})

module.exports = router;
