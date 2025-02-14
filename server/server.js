require("dotenv").config();
const express = require("express");
const path = require("path");
const pageRoutes = require("./routes/pagesRoutes");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger.json");
const bcrypt = require("bcrypt");

const Users = require("./db/models/users");
const Routes = require("./db/models/routes");
const RoutesPoints = require("./db/models/routesPoints");

const upload = require("./modules/fileManager");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.use(pageRoutes);

app.post("/users/reg", async (req, res) => {
  const {
    user_name,
    user_lastname,
    user_patronymic,
    user_email,
    user_password,
  } = req.body;

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hash = await bcrypt.hash(user_password, salt);

  try {
    const newUser = await Users.create({
      user_name,
      user_lastname,
      user_patronymic,
      user_email,
      user_password: hash,
    });

    res.status(201).json({ message: "Вы успешно зарегестрировались", newUser });
  } catch (err) {
    console.error("Ошибка регистрации", err);
    res.status(400).json({ message: "Ошибка при регистрации" });
  }
});

app.post("/users/log", async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        user_email,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
    } else {
      if (await bcrypt.compare(user_password, user.user_password)) {
        res.status(200).json({ message: "Успешный вход" });
      } else {
        res.status(404).json({ message: "Неверный пользователь или пароль" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Ошибка входа" });
  }
});

app.post("/maps/new/route", async (req, res) => {
  const { name_route, total_distance, total_time } = req.body;

  try {
    const route = await Routes.create({
      name_route,
      total_distance,
      total_time,
    });

    res.status(200).json({ route_id: route.id_route });

  } catch (err) {
    console.error("Ошибка при создании нового маршрута" + err);
  }

});

app.post("/maps/new/route/points", async (req, res) => {
  const { route_id, points } = req.body;

  try {
    const savedPoints = await RoutesPoints.bulkCreate(
      points.map(point => ({
        route_id: route_id,
        latitude: point.latitude,
        longitude: point.longitude
      }))
    );
    
    res.status(200).json({ message: 'Метки сохранены успешно' });
    
  } catch (error) {
    console.error(error);
    
    res.status(500).json({ error: 'Ошибка при сохранении точек' });
  }
});

app.post("/upload/images", upload.single('file'), (req, res) => {
  try{
    res.status(200).json({message: "файл успешно загружен"});
  } catch(err){
    res.status(400).json({message: "Произошла ошибка при загрузке файла"});
  }
    
})

app.listen(Number(process.env.PORT), () => {
  console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
  console.log(
    `Swagger доступен по адресу: http://localhost:${process.env.PORT}/doc`
  );
});
