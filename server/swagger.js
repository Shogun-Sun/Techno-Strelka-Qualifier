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
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
