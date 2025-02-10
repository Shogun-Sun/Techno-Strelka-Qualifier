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

    placemark.events.add("click", () => {
      map.geoObjects.remove(placemark);
      marks = marks.filter((item) => item.coords !== coords.toString());
    });

    map.geoObjects.add(placemark);

    ymaps.geocode(coords).then(
      function (res) {
        let firstGeoObject = res.geoObjects.get(0);
        let address = firstGeoObject.getAddressLine();
        console.log(`Добавлена точка: ${address}`);

        marks.push({ address: address, coords: coords.toString() });
      },
      function (err) {
        console.error("Ошибка получения адреса:", err);
      }
    );
  });

  document.getElementById("createRouteBtn").addEventListener("click", () => {
    if (marks.length < 2) {
      alert("Добавьте хотя бы две метки для создания маршрута.");
      return;
    }

    total_distance = 0;
    total_time = 0;
    let currentRouteIndex = 0;

    map.geoObjects.removeAll();

    function buildRoute() {
      if (currentRouteIndex >= marks.length - 1) {
        console.log(
          `Общее расстояние: ${(total_distance / 1000).toFixed(2)} км`
        );
        console.log(`Общее время: ${(total_time / 60).toFixed(0)} мин`);
        return;
      }

      let startAddress = marks[currentRouteIndex].address;
      let endAddress = marks[currentRouteIndex + 1].address;

      ymaps
        .route([startAddress, endAddress], {
          mapStateAutoApply: true,
          routingMode: "pedestrian",
        })
        .then(
          function (route) {
            map.geoObjects.add(route);

            total_distance += route.getLength();
            total_time += route.getTime();

            currentRouteIndex++;
            buildRoute();
          },
          function (error) {
            console.error("Ошибка при построении маршрута:", error);
          }
        );
    }

    buildRoute();
    console.log(marks);
  });
}

ymaps.ready(init);
