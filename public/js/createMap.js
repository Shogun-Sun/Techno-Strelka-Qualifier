let addreses = []
let photos = []
let newPoint = document.querySelector("#newPoint")
let points = document.querySelector("#points")
let savebtn = document.querySelector("#savebtn")
let clickAddres = -1
let pointCount = 1

//--------------------------------------------------------------карта
function init() {
    let map = new ymaps.Map("map", {
        center: [56.304681092875974,43.983099494694265],
        zoom: 13,
        controls:[]
    })

    map.events.add('click', function (e) {
        if (clickAddres != null) {
            var coords = e.get('coords');
            addreses[clickAddres.index] = coords
            clickAddres.target.value = coords
            map.geoObjects.remove(multiRoute)
            multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: addreses
            }, {
                boundsAutoApply: true,
            })
            map.geoObjects.add(multiRoute)
            clickAddres = null
        }
    }); 
    
    document.querySelector("#selectAddres").onclick = () => {
        clickAddres =  clickAddres = {
            target: document.querySelector(".addres"),
            index: 0,
        }
    }

    map.controls.add('geolocationControl'); // удаляем геолокацию
    map.controls.add('searchControl'); // удаляем поиск
    map.controls.add('trafficControl'); // удаляем контроль трафика
    map.controls.add('typeSelector'); // удаляем тип
    map.controls.add('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    map.controls.add('zoomControl'); // удаляем контрол зуммирования
    map.controls.add('rulerControl'); // удаляем контрол правил
    


    let multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: addreses
    }, {
        boundsAutoApply: true,
    })
    map.geoObjects.add(multiRoute)

    newPoint.onclick = () => {
        let cnt = pointCount

        let point = document.createElement("div")
        point.className = "point grid grid-cols-2 grid-rows-2 gap-x-3  gap-y-0 border-2 rounded-lg bg-indigo-300"

        let caption = document.createElement("p")
        caption.className = "col-span-2 m-0"
        caption.innerText="Добавьте следующую точку вашего маршрута"

        let name_div = document.createElement("div")
        name_div.className = "flex flex-col"
        let name_lable = document.createElement("lable")
        name_lable.innerText = "Название точки:"
        let name_input = document.createElement("input")
        name_input.className = "savepoint addresname border-2"
        let delete_button = document.createElement("button")
        delete_button.innerText = "Удалить точку"

        delete_button.onclick = () => {
            map.geoObjects.remove(multiRoute)
            addreses[cnt] = "";
            multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: addreses
            }, {
                boundsAutoApply: true,
            })
            map.geoObjects.add(multiRoute)
            point.remove()
        }

        name_div.append(name_lable, name_input, delete_button)

        let addres_div = document.createElement("div")
        addres_div.className = "flex flex-col"
        let addres_lable = document.createElement("lable")
        addres_lable.innerText = "Адрес точки:"
        let addres_input = document.createElement("input")
        addres_input.className = "savepoint addres border-2"
        let addres_button = document.createElement("button")
        addres_button.innerText = "Выбрать точку на карте"

        name_input.addEventListener("blur", (elem) => {
            map.geoObjects.remove(multiRoute)
            addreses[cnt] = addres_input.value
            multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: addreses
            }, {
                boundsAutoApply: true,
            })
            map.geoObjects.add(multiRoute)
        })

        addres_button.onclick = () => {
            clickAddres = {
                target: addres_input,
                index: cnt,
            }
        }

        addres_input.addEventListener("blur", (elem) => {
            map.geoObjects.remove(multiRoute)
            addreses[cnt] = addres_input.value
            multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: addreses
            }, {
                boundsAutoApply: true,
            })
            map.geoObjects.add(multiRoute)
        })

        addres_div.append(addres_lable, addres_input, addres_button)

        point.append(caption, name_div, addres_div)
        points.appendChild(point)
        console.log(cnt)
        pointCount = pointCount + 1   
    }


    document.querySelector(".addres").addEventListener("blur", (elem) => {
        map.geoObjects.remove(multiRoute)
        addreses[0] = elem.target.value
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: addreses
        }, {
            boundsAutoApply: true,
        })
        map.geoObjects.add(multiRoute)
    })



    multiRoute.model.events.add("requestsuccess", function (event) {
        var activeRoute = multiRoute.getActiveRoute();
        console.log("Длина: " + activeRoute.properties.get("distance").text);
        console.log("Время прохождения: " + activeRoute.properties.get("duration").text);
    });

    savebtn.onclick = () => {
        let savedRoute = {}
        let sevedPoints = []
        let saveNodeList = document.querySelectorAll(".savepoint")
        for (let i = 0; i<saveNodeList.length; i +=2) {
            let pointdesc = {}
            ymaps.geocode(saveNodeList[i+1].value).then( 
                function (res) { 
                    let firstGeoObject = res.geoObjects.get(0); 
                    let coord = firstGeoObject.geometry.getCoordinates();  
                    pointdesc.coord = coord
                }, 
                function (error) { 
                    console.error('Ошибка геокодирования адреса:', error);
                    alert("Ошибка, проверьте достоверность всех адресов"); 
                } 
            );
            pointdesc.addres = saveNodeList[i+1].value,
            pointdesc.name = saveNodeList[i].value,
            sevedPoints.push(pointdesc)
        }
        savedRoute.points = sevedPoints
        savedRoute.description = document.querySelector("#description").value
        savedRoute.name = document.querySelector("#routename").value
        multiRoute.model.events.add("requestsuccess", function (event) {
            var activeRoute = multiRoute.getActiveRoute();
            savedRoute.distanse = activeRoute.properties.get("distance").text
            savedRoute.time = activeRoute.properties.get("duration").text
        });
        console.log(savedRoute)


        
    }
}


document.querySelector("#inputpicture").onchange = (event) => {
    let reader = new FileReader();
    let img = document.createElement("img")
    reader.onload = e => img.src = e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    document.querySelector("#puctureArea").append(img)    
}


ymaps.ready(init)