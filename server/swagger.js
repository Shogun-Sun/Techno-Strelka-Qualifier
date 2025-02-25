const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API Документация",
    description: "Автоматически сгенерированная документация",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js", "./routes/userRoutes.js", "./routes/routeRoutes.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
