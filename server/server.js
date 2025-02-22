require("dotenv").config();
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger.json");
const session = require("./modules/sessionManager");
const syncModels = require("./db/syncModels");
const { connectDB } = require("./db/database");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const Comments = require('./db/models/comments');

// WebSocket
io.on("connection", async (socket) => {
  const comments = await Comments.findAll();
  socket.emit("comments", comments);
 
});

(async () => {
  await connectDB();
  await syncModels();
  session(app);

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));
  //Маршруты
  app.use("/storages", express.static(path.join(__dirname, "storages")));
  app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
  app.use(require("./routes/pagesRoutes"));
  app.use(require("./routes/userRoutes"));
  app.use(require("./routes/routeRoutes"));
  app.use(require("./routes/ratingsRoutes"));
  app.use(require("./routes/commentsRoutes"));

  server.listen(Number(process.env.PORT), () => {
    console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
    console.log(`Swagger доступен по адресу: http://localhost:${process.env.PORT}/doc`
    );
  });
})();

module.exports = io;
