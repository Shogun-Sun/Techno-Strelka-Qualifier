let addreses = [];
let photos = [];
let newPoint = document.querySelector("#newPoint");
let points = document.querySelector("#points");
let savebtn = document.querySelector("#savebtn");
let clickAddres = -1;
let pointCount = 1;
let selectedFiles = [];
let addresErrors
let passErrors = []


async function geocode(checkAddres) {
  // Забираем запрос из поля ввода.
  var request = checkAddres
  // Геокодируем введённые данные.
  await ymaps.geocode(request).then(function (res) {
      var obj = res.geoObjects.get(0),
          error, hint;

      if (obj) {
          switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
              case 'exact':
                  break;
              case 'number':
              case 'near':
              case 'range':
                  error = 'Неточный адрес, требуется уточнение';
                  hint = 'Уточните номер дома';
                  break;
              case 'street':
                  error = 'Неполный адрес, требуется уточнение';
                  hint = 'Уточните номер дома';
                  break;
              case 'other':
              default:
                  error = 'Неточный адрес, требуется уточнение';
                  hint = 'Уточните адрес';
          }
      } else {
          error = 'Адрес не найден';
          hint = 'Уточните адрес';
      }

      // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
      if (error) {
          console.log(error);
          console.log(hint);
          addresErrors = {error: error, hint: hint}
      } else {
          addresErrors = {}
          console.log(obj);
      }
  }, function (e) {
      console.log(e)
      addresErrors = {error: e}
  })
}


//--------------------------------------------------------------карта
function init() {
  let map = new ymaps.Map("map", {
    center: [56.304681092875974, 43.983099494694265],
    zoom: 7,
    controls: [],
  });

  map.events.add("click", function (e) {
    if (clickAddres != null) {
      var coords = e.get("coords");
      addreses[clickAddres.index] = coords;
      clickAddres.target.value = coords;
      map.geoObjects.remove(multiRoute);
      multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: addreses,
        },
        {
          boundsAutoApply: true,
        }
      );
      map.geoObjects.add(multiRoute);
      clickAddres = null;
    }
  });

  document.querySelector("#selectAddres").onclick = () => {
    clickAddres = clickAddres = {
      target: document.querySelector(".addres"),
      index: 0,
    };
  };

  map.controls.add("geolocationControl"); // удаляем геолокацию
  map.controls.add("searchControl"); // удаляем поиск
  map.controls.add("trafficControl"); // удаляем контроль трафика
  map.controls.add("typeSelector"); // удаляем тип
  map.controls.add("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
  map.controls.add("zoomControl"); // удаляем контрол зуммирования
  map.controls.add("rulerControl"); // удаляем контрол правил

  let multiRoute = new ymaps.multiRouter.MultiRoute(
    {
      referencePoints: addreses,
    },
    {
      boundsAutoApply: true,
    }
  );
  map.geoObjects.add(multiRoute);

  newPoint.onclick = () => {
    let cnt = pointCount;

    let point = document.createElement("div");
    point.className = "point";

    let name_lable = document.createElement("lable");
    name_lable.innerText = "Название";
    name_lable.classList.add("point_lable");
    let name_input = document.createElement("input");
    name_input.className = "savepoint addresname point_input";
    let delete_button = document.createElement("button");
    delete_button.innerText = "Удалить точку";
    delete_button.classList.add("point_btn");

    delete_button.onclick = () => {
      map.geoObjects.remove(multiRoute);
      addreses[cnt] = "";
      multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: addreses,
        },
        {
          boundsAutoApply: true,
        }
      );
      map.geoObjects.add(multiRoute);
      point.remove();
    };

    point.append(name_lable, name_input);

    let addres_lable = document.createElement("lable");
    addres_lable.innerText = "Адрес";
    addres_lable.classList.add("point_lable");
    let addres_input = document.createElement("input");
    addres_input.className = "savepoint addres  point_input";
    let addres_button = document.createElement("button");
    addres_button.innerText = "Поставить на карте";
    addres_button.classList.add("point_btn");

    // name_input.addEventListener("blur", (elem) => {
    //   map.geoObjects.remove(multiRoute);
    //   addreses[cnt] = addres_input.value;
    //   multiRoute = new ymaps.multiRouter.MultiRoute(
    //     {
    //       referencePoints: addreses,
    //     },
    //     {
    //       boundsAutoApply: true,
    //     }
    //   );
    //   map.geoObjects.add(multiRoute);
    // });

    addres_button.onclick = () => {
      clickAddres = {
        target: addres_input,
        index: cnt,
      };
    };

    addres_input.addEventListener("blur", async (elem) => {

      if (typeof elem.target.value != []) {
        geocode(elem.target.value)
      }
      // console.log(addresErrors)
      let error_div = elem.target.parentNode.querySelector(".error")
      if (addresErrors.error) {
        error_div.innerText = addresErrors.hint
        error_div.classList.remove("hidden")
        passErrors[cnt] = addresErrors.error
        return
      }
      error_div.classList.add("hidden")
      delete passErrors[cnt]

      map.geoObjects.remove(multiRoute);
      addreses[cnt] = addres_input.value;
      multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: addreses,
        },
        {
          boundsAutoApply: true,
        }
      );
      map.geoObjects.add(multiRoute);
      // process = true
    });

    let error_plase = document.createElement("div")
    error_plase.classList = "error hidden"

    let div_btns = document.createElement("div");
    div_btns.className = "flex flex-betwen";

    div_btns.append(delete_button, addres_button);

    point.append(addres_lable, addres_input, error_plase, div_btns);

    points.appendChild(point);
    
    pointCount = pointCount + 1;
  };

  document.querySelector(".addres").addEventListener("blur", async (elem) => {

    await geocode(elem.target.value)
    // console.log(addresErrors)
    let error_div = elem.target.parentNode.querySelector(".error")
    if (addresErrors.error) {
      error_div.innerText = addresErrors.hint
      error_div.classList.remove("hidden")
      passErrors[0] = addresErrors.error
      // process = true
      return
    }
    error_div.classList.add("hidden")
    delete passErrors[0]

    map.geoObjects.remove(multiRoute);
    addreses[0] = elem.target.value;
    multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: addreses,
      },
      {
        boundsAutoApply: true,
      }
    );
    map.geoObjects.add(multiRoute);
  });



  savebtn.onclick = async () => {
    
    let allAddresinputs = document.querySelectorAll(".addres")
    console.log(passErrors)
    let passArr = passErrors.filter((item) => typeof item != "undefined")
    console.log(passArr)

    if (typeof activeRoute == "undefined" && passErrors == []) {
      alert("Адрес не найден")
      return
    }
    
    let savedRoute = {};
    let sevedPoints = [];
    let saveNodeList = document.querySelectorAll(".savepoint");
    for (let i = 0; i < saveNodeList.length; i += 2) {
      let pointdesc = {};
      await ymaps.geocode(saveNodeList[i + 1].value).then(
        function (res) {
          let firstGeoObject = res.geoObjects.get(0);
          let coord = firstGeoObject.geometry.getCoordinates();
          pointdesc.coord = coord;
        },
        function (error) {
          console.error("Ошибка геокодирования адреса:", error);
          alert("Ошибка, проверьте достоверность всех адресов");
        }
      );
      (pointdesc.addres = saveNodeList[i + 1].value),
        (pointdesc.name = saveNodeList[i].value),
        (pointdesc.order = i / 2 + 1);
      sevedPoints.push(pointdesc);
    }

    var activeRoute = multiRoute.getActiveRoute();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    // formData.append("user_id", );
    formData.append("point_data", JSON.stringify(sevedPoints));
    formData.append("route_description", document.querySelector("#description").value);
    formData.append("route_name", document.querySelector("#routename").value);
    formData.append("route_distance", activeRoute.properties.get("distance").text);
    formData.append("route_time", activeRoute.properties.get("duration").text);
    //formData.append("status", )

    const uploadResponse = await fetch(`/route/upload/new/route`, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    window.location.href = "/";
  };
}

// fetch('', {
//   headers,
//   method
// })

// const socket = io('http://localhost:3000'); 

// socket.on('newComment', (comments) => {
//   console.log('Соединение с сервером установлено');
//   console.log(comments);
// });

// socket.on('connect', () => {
//   console.log(`Подключен к серверу с id: ${socket.id}`);
// });

// socket.on('disconnect', () => {
//   console.log('Отсоединение от сервера');
// });

let img_id = 0
document.querySelector("#inputpicture").addEventListener("change", (event) => {
  
  const files = event.target.files;
  for (const file of files) {
    let reader = new FileReader();
    let img = document.createElement("img");

    reader.onload = (e) => {
      img.src = e.target.result;
      // img.style.width = "100px";
      img.className = "rounded-10 h-full w-auto shadow-2xl shadow-slate-900";
      document.querySelector("#puctureArea").append(img);
    };

    reader.readAsDataURL(file);
    file.img_id = img_id
    img_id += 1
    selectedFiles.push(file);
    console.log(selectedFiles)
    img.onclick = (() => {
      selectedFiles = selectedFiles.filter(f => f.img_id!=file.img_id)
      img.remove()
      console.log(selectedFiles)
    })
  }
});

ymaps.ready(init);
