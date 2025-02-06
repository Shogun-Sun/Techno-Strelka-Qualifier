let total_distance = 0;
let total_time = 0;
let marks = [];

function init() {
  var map = new ymaps.Map("map", {
    center: [55.751244, 37.618423],
    zoom: 14,
  });

  

  map.events.add("click", (e) => {
    let coords = e.get("coords");
    let placemark = new ymaps.Placemark(coords, {
      preset: "islands#icon",
      iconColor: "#FF0000",
    });

    placemark.events.add("click", (e) => {
      map.geoObjects.remove(placemark);
      marks = marks.filter((item) => item !== placemark);
    });

    map.geoObjects.add(placemark);

    marks.push(placemark);
    console.log(marks);
  });

  document.getElementById("createRouteBtn").addEventListener("click", () => {
    if (marks.length < 2) {
      alert("Добавьте хотя бы две метки для создания маршрута.");
      return;
    }

    // Перебор всех сегментов маршрута
    for (let i = 0; i < marks.length - 1; i++) {
      let startCoords = marks[i].geometry.getCoordinates();
      let endCoords = marks[i + 1].geometry.getCoordinates();

      let url = `https://graphhopper.com/api/1/route?point=${startCoords[0]},${startCoords[1]}&point=${endCoords[0]},${endCoords[1]}&vehicle=foot&key=769bcea8-c683-4cdf-afa2-9a3e7b6c1b0e`;

      fetch(url)
        .then((response) => response.json())
        .then(function (data) {
          if (data.paths && data.paths.length > 0) {
            var path = data.paths[0];

            // Декодируем маршрут
            var coordinates = decodePolyline(path.points);

            // Отображение маршрута на Яндекс.Картах
            var route = new ymaps.Polyline(
              coordinates,
              {},
              {
                strokeColor: "#00FF00",
                strokeWidth: 5,
              }
            );

            map.geoObjects.add(route);

            // Логирование информации о сегменте маршрута
            // console.log(
            //     `Сегмент маршрута от метки ${i + 1} до метки ${i + 2}:`
            // );
            // console.log("Длина маршрута: " + (path.distance / 1000).toFixed(2) + " км");
            // console.log("Время в пути: " + (path.time / 60000).toFixed(0) + " мин");

            // Добавляем значения сегмента к общим итогам
            total_distance += path.distance;
            total_time += path.time;

            // Если последний сегмент маршрута обработан, выводим итоговые данные
            if (i === marks.length - 2) {
              total_distance = parseFloat((total_distance / 1000).toFixed(2));
              total_time = parseFloat((total_time / 60000).toFixed(0));

              console.log(
                "Итоговое расстояние маршрута: " + total_distance + " км"
              );
              console.log("Итоговое время в пути: " + total_time + " мин");
            }
          } else {
            console.error("Маршрут не найден");
          }
        })
        .catch(function (err) {
          console.error("Ошибка:", err);
        });
    }
  });
}

// Функция для декодирования закодированных полилиний (encoded polyline)
function decodePolyline(encoded) {
  var points = [];
  var index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    var b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

document.getElementById("saveRouteBtn").addEventListener("click", () => {
  let name_route = document.getElementById("routeName").value;

  let points = marks.map(placemark => {
    return {
      latitude: placemark.geometry.getCoordinates()[0],
      longitude: placemark.geometry.getCoordinates()[1]
    };
  });

  fetch("http://localhost:3000/maps/new/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name_route,
      total_distance,
      total_time,
    }),
  })
    .then((response) => response.json())

    .then((data) => {
      const route_id = data.route_id;

      fetch("http://localhost:3000/maps/new/route/points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route_id,
          points
        }),
      });
    })

    .catch((error) => {
      console.error("Error:", error);
    });
});

ymaps.ready(init);
