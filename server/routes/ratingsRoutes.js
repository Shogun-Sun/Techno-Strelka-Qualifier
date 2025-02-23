const express = require("express");
const ratingsRouter = express.Router();
const Ratings = require("../db/models/ratings");
const Routes = require("../db/models/routes");

ratingsRouter.post("/ratingroute/post/rating", async (req, res) => {
  const user_id = req.session.user.id;
  const { route_id, rating } = req.body;
  
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }

    const checkRoute = await Routes.findOne({ where: { route_id } });
    if (!checkRoute) {
      return res.status(404).json({ message: "Маршрут не найден" });
    }

    const existingRating = await Ratings.findOne({ where: { route_id, user_id } });

    if (existingRating) {
      if (Number(rating) === 0) {
        await Ratings.destroy({ where: { route_id, user_id } });
        return res.status(200).json({ message: "Ваша оценка удалена" });
      } else {
        await Ratings.update({ rating }, { where: { route_id, user_id } });
        return res.status(200).json({ message: "Оценка обновлена" });
      }
    } else {
      if (rating !== 0) {
        await Ratings.create({ user_id, route_id, rating });
        return res.status(201).json({ message: "Ваша оценка добавлена" });
      } else {
        return res.status(400).json({ message: "Нельзя удалить несуществующую оценку" });
      }
    }
  } catch (err) {
    console.error("Ошибка внесения рейтинга:", err);
    return res.status(500).json({ message: "Ошибка внесения оценки" });
  };
});

ratingsRouter.post("/ratingroute/get/rating/route/id", async(req, res) => {
    const { route_id } = req.body;
    try{
        const likeRatingData = await Ratings.count({
            where: {
                route_id,
                rating: '1',
            }
        });

        const dislikeRatingData = await Ratings.count({
            where: {
                route_id,
                rating: '-1',
            }
        });

        return res.status(200).json({message: 'Рейтинг успешно получен', likes: likeRatingData, dislikes: dislikeRatingData});

    }catch(err){
        console.error('Ошибка получения рейтинга маршрута', err);
        return res.status(500).json({message: "Ошибка получения рейтинга"});
    }
});

module.exports = ratingsRouter;
