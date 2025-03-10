require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("./modules/sessionManager");
const syncModels = require("./db/syncModels");
const { connectDB } = require("./db/database");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

(async () => {
  await connectDB();
  await syncModels();
  session(app);

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));
  //Маршруты
  app.use("/storages", express.static(path.join(__dirname, "storages")));
  app.use(require("./routes/pagesRoutes"));
  app.use(require("./routes/userRoutes"));
  app.use(require("./routes/routeRoutes"));
  app.use(require("./routes/ratingsRoutes"));
  app.use(require("./routes/commentsRoutes"));
  app.use(require("./routes/moderationRoutes"));

  server.listen(Number(process.env.PORT), () => {
    console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
  });
})();

module.exports = io;
