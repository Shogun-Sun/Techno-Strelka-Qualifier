let addreses = [];
let photos = [];
let newPoint = document.querySelector("#newPoint");
let points = document.querySelector("#points");
let savebtn = document.querySelector("#savebtn");
let clickAddres = -1;
let pointCount = 1;
const selectedFiles = [];
let edit_route
let current_user

loadPage()
//--------------------------------------------------------------проверка доступа
async function authenticator() {

    const route = await fetch("/route/get/route/by/id", {
        method: "POST",
        headers: {
            "Content-type" : "application/json"
        },
        body: JSON.stringify({route_id: new URL(window.location.href).searchParams.get("route_id")})
    })
    edit_route = await route.json()
    console.log( await edit_route)


    const user = await fetch("/user/get/data", {
        method: "GET",
        headers: {
            "Content-type" : "application/json"
        },
    })
    current_user = await user.json()
    console.log( await current_user)
    
    if ((!edit_route.data)||(!current_user.data)||(edit_route.data.Route.user_id != current_user.data.id)) {
        window.location.href = "/"
    }
}

//--------------------------------------------------------------загрузка данных маршрута


async function loadPage() {
    await authenticator()
    document.querySelector("#routename").value = edit_route.data.route_name
    document.querySelector("#description").value = edit_route.data.route_description
    document.querySelector(".addresname").value = edit_route.data.Route.Points[0].point_data[0].name
    document.querySelector(".addres").value = edit_route.data.Route.Points[0].point_data[0].addres

    document.querySelector(".addres").focus()
    document.querySelector(".addres").blur()

    let editPoints = edit_route.data.Route.Points[0].point_data

    for (let i = 1; i<editPoints.length; i++) {
        newPoint.click()
        console.log(document.querySelector("#points"))
        let lastPoint = document.querySelector("#points").lastChild
        console.log(lastPoint)
        lastPoint.querySelector(".addresname").value = editPoints[i].name
        lastPoint.querySelector(".addres").value = editPoints[i].addres
        lastPoint.querySelector(".addres").focus()
        lastPoint.querySelector(".addres").blur()
    }

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
    
    name_input.addEventListener("blur", (elem) => {
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
      });

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

    

    addres_button.onclick = () => {
      clickAddres = {
        target: addres_input,
        index: cnt,
      };
    };

    addres_input.addEventListener("blur", (elem) => {
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
    });
    let div_btns = document.createElement("div");
    div_btns.className = "flex flex-betwen";

    div_btns.append(delete_button, addres_button);

    point.append(addres_lable, addres_input, div_btns);

    points.appendChild(point);
    console.log(cnt);
    pointCount = pointCount + 1;
  };

  document.querySelector(".addres").addEventListener("blur", (elem) => {
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

    formData.append("route_id", edit_route.data.Route.route_id);
    formData.append("point_data", JSON.stringify(sevedPoints));
    formData.append("route_description", document.querySelector("#description").value);
    formData.append("route_name", document.querySelector("#routename").value);
    formData.append("route_distance", activeRoute.properties.get("distance").text);
    formData.append("route_time", activeRoute.properties.get("duration").text);
    //formData.append("status", )
    for (key of formData.keys()) {
        console.log(`${key}: ${formData.get(key)}`);
      }
    const uploadResponse = await fetch(`/route/update/route`, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    console.log(uploadData)
    // window.location.href = "/";
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

document.querySelector("#inputpicture").addEventListener("change", (event) => {
  const files = event.target.files;

  for (const file of files) {
    let reader = new FileReader();
    let img = document.createElement("img");

    reader.onload = (e) => {
      img.src = e.target.result;
      // img.style.width = "100px";
      img.className = "rounded-10 h-full w-full shadow-2xl shadow-slate-900";
      document.querySelector("#puctureArea").append(img);
    };

    reader.readAsDataURL(file);
    selectedFiles.push(file);
  }
});

ymaps.ready(init);
