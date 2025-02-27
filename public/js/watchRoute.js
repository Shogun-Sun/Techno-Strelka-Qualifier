var map
var multiRoute
var addreses = [];
let photos = [];
let newPoint = document.querySelector("#newPoint");
let points = document.querySelector("#points");
let savebtn = document.querySelector("#savebtn");
let clickAddres = -1;
let pointCount = 1;
let selectedFiles = [];
let addresErrors
let passErrors = []
let edit_route
let current_user

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

          // console.log(error);
          // console.log(hint);
          addresErrors = {error: error, hint: hint}
      } else {
          addresErrors = {}
          // console.log(obj);
      }
  }, function (e) {
      addresErrors = {error: "Аддрес не введен", hint: "Аддрес не введен"}
      // console.log(e)
  })
}


//--------------------------------------------------------------карта
function init() {
  map = new ymaps.Map("map", {
    center: [56.304681092875974, 43.983099494694265],
    zoom: 7,
    controls: [],
  });

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
        
        // if ((!edit_route.data)||(!current_user.data)||(edit_route.data.user_id != current_user.data.id)) {
        //     window.location.href = "/"
        // }
    }
    
    //--------------------------------------------------------------загрузка данных маршрута
    
    
    async function loadPage() {
        await authenticator()
        render_history()
        document.querySelector("#routename").value = edit_route.data.RoutesHistories[0].route_name
        document.querySelector("#description").value = edit_route.data.RoutesHistories[0].route_description
        document.querySelector(".addresname").value = edit_route.data.Points[0].point_data[0].name
        document.querySelector(".addres").value = edit_route.data.Points[0].point_data[0].addres
    
        document.querySelector(".addres").focus()
        document.querySelector(".addres").blur()
    
        let editPoints = edit_route.data.Points[0].point_data
    
        for (let i = 1; i<editPoints.length; i++) {
            // await newPoint.click()
            
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
        
            
        
            addres_button.onclick = () => {
              clickAddres = {
                target: addres_input,
                index: cnt,
              };
            };
        
            addres_input.addEventListener("blur", async (elem) => {
              let error_div = elem.target.parentNode.querySelector(".error")

              if (isNaN(elem.target.value[0])) {
                await geocode(elem.target.value)
                if (addresErrors.error) {
                  error_div.innerText = addresErrors.hint
                  error_div.classList.remove("hidden")
                  passErrors[0] = addresErrors.error
                  return
                }
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
            });
            let div_btns = document.createElement("div");
            div_btns.className = "flex flex-betwen";
        
            let error_plase = document.createElement("div")
            error_plase.classList = "error hidden"

            div_btns.append(delete_button, addres_button);
        
            point.append(addres_lable, addres_input, error_plase, div_btns);
        
            points.appendChild(point);
            // console.log(cnt);
            pointCount = pointCount + 1;
    
    
    
            // console.log(document.querySelector("#points"))
            let lastPoint = document.querySelector("#points").lastChild
            // console.log(lastPoint)
            lastPoint.querySelector(".addresname").value = editPoints[i].name
            lastPoint.querySelector(".addres").value = editPoints[i].addres
            lastPoint.querySelector(".addres").focus()
            lastPoint.querySelector(".addres").blur()

            
        }
    
    }
    

  map.events.add("click", function (e) {
    if (clickAddres != null) {
      var coords = e.get("coords");
      addreses[clickAddres.index] = coords;
      clickAddres.target.value = coords
      clickAddres.target.focus()
      clickAddres.target.blur()
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
  // map.controls.add("searchControl"); // удаляем поиск
  map.controls.add("trafficControl"); // удаляем контроль трафика
  map.controls.add("typeSelector"); // удаляем тип
  map.controls.add("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
  map.controls.add("zoomControl"); // удаляем контрол зуммирования
  map.controls.add("rulerControl"); // удаляем контрол правил

  var searchControl = new ymaps.control.SearchControl({
    options: {
        provider: 'yandex#search'
    }
});

map.controls.add(searchControl);

  multiRoute = new ymaps.multiRouter.MultiRoute(
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

    addres_button.onclick = () => {
      clickAddres = {
        target: addres_input,
        index: cnt,
      };
    };

    addres_input.addEventListener("blur", async (elem) => {
      let error_div = elem.target.parentNode.querySelector(".error")

      if (isNaN(elem.target.value[0])) {
        await geocode(elem.target.value)
        if (addresErrors.error) {
          error_div.innerText = addresErrors.hint
          error_div.classList.remove("hidden")
          passErrors[0] = addresErrors.error
          return
        }
      } 

      error_div.classList.add("hidden")
      delete passErrors[cnt]

      map.geoObjects.remove(multiRoute);
      addreses[cnt] = addres_input.value
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

    let error_div = elem.target.parentNode.querySelector(".error")

    if (isNaN(elem.target.value[0])) {
      await geocode(elem.target.value)
      if (addresErrors.error) {
        error_div.innerText = addresErrors.hint
        error_div.classList.remove("hidden")
        passErrors[0] = addresErrors.error
        return
      }
    }
   
    // console.log(addresErrors)
    
    
    error_div.classList.add("hidden")
    delete passErrors[0]

    map.geoObjects.remove(multiRoute);
    addreses[0] = elem.target.value
    // console.log(addreses)
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
    // console.log(passErrors)
    let passArr = passErrors.filter((item) => typeof item != "undefined")

    if (typeof activeRoute == "undefined" && passArr.length != 0) {
      alert("Адрес не найден")
      return
    }


  


    
    
    let savedRoute = {};
    let sevedPoints = [];
    let saveNodeList = document.querySelectorAll(".savepoint");
    for (let i = 0; i < saveNodeList.length; i += 2) {
      let pointdesc = {};
      await ymaps.geocode(saveNodeList[i + 1].value.slice(saveNodeList[i + 1].value.indexOf("#") == -1? 0 :saveNodeList[i + 1].value.indexOf("#")+1, -1)).then(
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

    if (!formData.has("file")) {
      alert("Загрузите фото")
      return
    }

    // formData.append("user_id", );
    formData.append("route_id", edit_route.data.route_id);
    formData.append("point_data", JSON.stringify(sevedPoints));
    formData.append("route_description", document.querySelector("#description").value);
    formData.append("route_name", document.querySelector("#routename").value);
    formData.append("route_distance", activeRoute.properties.get("distance").text);
    formData.append("route_time", activeRoute.properties.get("duration").text);
    formData.append("status", document.querySelector("#status").checked?"public":"private")
    //formData.append("status", )

    for (key of formData.keys()) {
      console.log(`${key}: ${formData.get(key)}`);
    }

    const uploadResponse = await fetch(`/route/update/route`, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    // window.location.href = "/";
  };
}

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





/* <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script> */ // скрипт фрхиватора нужно добавить на страницу где будет экспорт
var KML;
var GPX;

document.querySelector("#GPX_btn").onclick = exportToGPX
document.querySelector("#KML_btn").onclick = exportToKML
document.querySelector("#KMZ_btn").onclick = exportToKMZ

async function exportToGPX() {
let addresses = []
for (let i = 0; i < addreses.length; i++) {
  await ymaps.geocode(addreses[i]).then(
    function (res) {
      let firstGeoObject = res.geoObjects.get(0);
      let coord = firstGeoObject.geometry.getCoordinates();
      addresses.push(coord)
    },
    function (error) {
      console.error("Ошибка геокодирования адреса:", error);
      alert("Ошибка, проверьте достоверность всех адресов");
    }
  );
}
    GPX = '<?xml version="1.0" encoding="UTF-8"?>\n';
    GPX += '<gpx version="1.1" creator="Yandex Maps">\n';
    GPX += '<metadata>\n';
    GPX += `<name>${document.querySelector("#routename").value}</name>\n`;                   // название маршрута  // название --------
    GPX += `<desc>${document.querySelector("#description").value}</desc>\n`;                      // описание маршрута  // описание ---------
    GPX += '</metadata>\n';
    GPX += '<trk>\n';                                        // начало трека
    GPX += `<name>${document.querySelector("#routename").value}</name>\n `;                           // название трека     // название-----------
    GPX += '<trkseg>\n';                                     // начало  сегмента трека

    

    addresses.forEach(address => {
        if (Array.isArray(address)) {
            GPX += `<trkpt lat="${address[0]}" lon="${address[1]}">\n`;  //добавление точки
            GPX += '</trkpt>\n';
        }
    });
    GPX += '</trkseg>\n';// конец  сегмента трека
    GPX += '</trk>\n';   // конец трека
    GPX += '</gpx>';

    var blob = new Blob([GPX], { type: 'application/gpx+xml' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'tourou.gpx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function createKML(){
  let addresses = []
  for (let i = 0; i < addreses.length; i++) {
    await ymaps.geocode(addreses[i]).then(
      function (res) {
        let firstGeoObject = res.geoObjects.get(0);
        let coord = firstGeoObject.geometry.getCoordinates();
        addresses.push(coord)
      },
      function (error) {
        console.error("Ошибка геокодирования адреса:", error);
        alert("Ошибка, проверьте достоверность всех адресов");
      }
    );
  }
  console.log(addresses)
    KML = '<?xml version="1.0" encoding="UTF-8"?>\n';
    KML += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
    KML += '<Document>\n';
    KML += `<name>${document.querySelector("#routename").value}</name>\n`;                                      // название 
    KML += '<description>A simple description example.</description>\n';
    KML += '<Placemark>\n';
    KML += `<name>${document.querySelector("#routename").value}</name>\n`;                                     // название
    KML += `<description>${document.querySelector("#description").value}</description>\n`;         // описание
    KML += '<LineString>\n';
    KML += '<coordinates>\n';

    addresses.forEach(address => {
        if (Array.isArray(address)) {
            KML += `${address[1]},${address[0]} `; // Долгота,Широта, разделенные пробелом
        }
    });

    KML += '</coordinates>\n';
    KML += '</LineString>\n';
    KML += '</Placemark>\n';
    KML += '</Document>\n';
    KML += '</kml>\n';
}
function exportToKML() {  
    createKML();      
    var blob = new Blob([KML], { type: 'application/vnd.google-earth.kml+xml' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'tourou.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function exportToKMZ(){
    createKML();
    var zip = new JSZip();
    zip.file("route.kml", KML);

    zip.generateAsync({ type: "blob" }).then(function (blob) {
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = 'route.kmz';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}



async function render_history() {

  document.querySelector("#new").onclick = () => {
    location.reload()
  }
  const active_route_history_response = await fetch("/route/get/route/history/by/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({route_id: edit_route.data.route_id})
  })
  let active_route_history = await active_route_history_response.json()
  active_route_history = active_route_history.data
  active_route_history.RoutesHistories = active_route_history.RoutesHistories.filter((elem) => elem.route_status == 'old')
  active_route_history.Points = active_route_history.Points.filter((elem) => elem.point_status == 'old')
  console.log(active_route_history)

  active_route_history.RoutesHistories.forEach((history_route, history_id) => {
    let history_point =  active_route_history.Points[history_id]
    let history_version = document.createElement("button")
    history_version.className = "w-10 h-10 bg-yellow-500 rounded-10"
    history_version.innerText=history_id

    history_version.onclick = () => {
      historyPointCount = 1
      console.log(history_route)
      console.log(history_point)

      document.querySelector("#routename").value = history_route.route_name
      document.querySelector("#description").value = history_route.route_description
      document.querySelector(".addresname").value = history_point.point_data[0].name
      document.querySelector(".addres").value = history_point.point_data[0].addres
      
      pointsCount = document.querySelectorAll(".point")
      point_btn = document.querySelectorAll(".point_btn")

      for (let pointrem = 1; pointrem  < pointsCount.length; pointrem++) {
        pointsCount[pointrem].remove()
      }

      

      try {
        document.querySelector("#newPoint").remove()
        document.querySelector("#savebtn").remove()
        document.querySelector("#pictures").remove()
        document.querySelector("#stat").remove()
        document.querySelector("#selectAddres").remove()
      } catch(err) {}

      let history_addreses = [history_point.point_data[0].addres]

      for (let i = 1; i < history_point.point_data.length; i++) {
        let act_point = history_point.point_data[i]
        history_addreses.push(act_point.addres)

        let point = document.createElement("div");
        point.className = "point";
    
        let name_lable = document.createElement("lable");
        name_lable.innerText = "Название";
        name_lable.classList.add("point_lable");
        
        let name_input = document.createElement("input");
        name_input.className = "savepoint addresname point_input";
        name_input.value = act_point.name

        point.append(name_lable, name_input);
        
        let addres_lable = document.createElement("lable");
        addres_lable.innerText = "Адрес";
        addres_lable.classList.add("point_lable");
        let addres_input = document.createElement("input");
        addres_input.className = "savepoint addres  point_input";
        addres_input.value = act_point.addres
        
        point.append(addres_lable, addres_input)
        document.querySelector("#points").append(point)
      }


      map.geoObjects.remove(multiRoute)
      multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: history_addreses,
        },
        {
          boundsAutoApply: true,
        }
      );
      map.geoObjects.add(multiRoute);

    }

    document.querySelector("#history").append(history_version)
  })
 
}