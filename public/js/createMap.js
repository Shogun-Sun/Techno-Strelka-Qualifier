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

console.log(`нижний Новгород`.indexOf("#"))
console.log(`CustomPoint#56.127148095342605,44.653265510319265`.slice(`CustomPoint#56.127148095342605,44.653265510319265`.indexOf("#") == -1? 0 :`CustomPoint#56.127148095342605,44.653265510319265`.indexOf("#")+1, -1))


async function geocode(checkAddres) {
  var request = checkAddres
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

      if (error) {

          console.log(error);
          console.log(hint);
          addresErrors = {error: error, hint: hint}
      } else {
          addresErrors = {}
          console.log(obj);
      }
  }, function (e) {
      addresErrors = {error: "Аддрес не введен", hint: "Аддрес не введен"}
      console.log(e)
  })
}

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

  map.controls.add("geolocationControl"); 
  map.controls.add("trafficControl"); 
  map.controls.add("typeSelector"); 
  map.controls.add("fullscreenControl"); 
  map.controls.add("zoomControl");
  map.controls.add("rulerControl"); 
  var searchControl = new ymaps.control.SearchControl({
    options: {
        provider: 'yandex#search'
    }
});

map.controls.add(searchControl);

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
    
    error_div.classList.add("hidden")
    delete passErrors[0]

    map.geoObjects.remove(multiRoute);
    addreses[0] = elem.target.value
    console.log(addreses)
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
    console.log(passArr != [])

    if (typeof activeRoute == "undefined" && passArr.length != 0) {
      alert("Адрес не найден")
      return
    }

    let savedRoute = {};
    let sevedPoints = [];
    let saveNodeList = document.querySelectorAll(".savepoint");
    for (let i = 0; i < saveNodeList.length; i += 2) {
      let pointdesc = {};
      console.log(saveNodeList[i + 1].value.slice(saveNodeList[i + 1].value.indexOf("#") == -1? 0 :saveNodeList[i + 1].value.indexOf("#")+1, -1))
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

    formData.append("point_data", JSON.stringify(sevedPoints));
    formData.append("route_description", document.querySelector("#description").value);
    formData.append("route_name", document.querySelector("#routename").value);
    formData.append("route_distance", activeRoute.properties.get("distance").text);
    formData.append("route_time", activeRoute.properties.get("duration").text);
    formData.append("status", document.querySelector("#status").checked?"public":"private")

    const uploadResponse = await fetch(`/route/upload/new/route`, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    window.location.href = "/";
  };
}

let img_id = 0
document.querySelector("#inputpicture").addEventListener("change", (event) => {
  
  const files = event.target.files;
  console.log(files)
  for (const file of files) {
    console.log(file)
    let reader = new FileReader();
    let img = document.createElement("img");

    reader.onload = (e) => {
      console.log(e)
      img.src = e.target.result;
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
    GPX += `<name>${document.querySelector("#routename").value}</name>\n`;                   
    GPX += `<desc>${document.querySelector("#description").value}</desc>\n`;                     
    GPX += '</metadata>\n';
    GPX += '<trk>\n';                                       
    GPX += `<name>${document.querySelector("#routename").value}</name>\n `;                         
    GPX += '<trkseg>\n';                                   

    

    addresses.forEach(address => {
      console.log(Array.isArray(address))
        if (Array.isArray(address)) {
            GPX += `<trkpt lat="${address[0]}" lon="${address[1]}">\n`;  
            GPX += '</trkpt>\n';
        }
    });
    GPX += '</trkseg>\n';
    GPX += '</trk>\n';   
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
  for (let i = 0; i < addreses.length; i++ 

  ) {
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

    KML = '<?xml version="1.0" encoding="UTF-8"?>\n';
    KML += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
    KML += '<Document>\n';
    KML += `<name>${document.querySelector("#routename").value}</name>\n`;                                    
    KML += `<description>${document.querySelector("#description").value}</description>\n`;
    KML += '<Placemark>\n';
    KML += `<name>${document.querySelector("#routename").value}</name>\n`;                                   
    KML += `<description>${document.querySelector("#description").value}</description>\n`;        
    KML += '<LineString>\n';
    KML += '<coordinates>\n';

    addresses.forEach(address => {
        if (Array.isArray(address)) {
            KML += `${address[1]},${address[0]} `; 
        }
    });

    KML += '</coordinates>\n';
    KML += '</LineString>\n';
    KML += '</Placemark>\n';
    KML += '</Document>\n';
    KML += '</kml>\n';
}
async function exportToKML() {  
    await createKML();      
    var blob = new Blob([KML], { type: 'application/vnd.google-earth.kml+xml' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'tourou.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
async function exportToKMZ(){
    await createKML();
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
