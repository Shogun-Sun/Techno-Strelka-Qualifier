require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./swagger.json'); 

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get('/', (req, res) => {
    res.send('Hello world!'); 
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Swagger доступен по адресу: http://localhost:${PORT}/doc`);
});
