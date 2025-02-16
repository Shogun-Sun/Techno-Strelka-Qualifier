let addreses = []
let photos = []
let newPoint = document.querySelector("#newPoint")
let points = document.querySelector("#points")
let savebtn = document.querySelector("#savebtn")
let clickAddres = -1
let pointCount = 1
const selectedFiles = [];

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
        clickAddres = clickAddres = {
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
        point.className = "point"

        let name_lable = document.createElement("lable")
        name_lable.innerText = "Название";
        name_lable.classList.add("point_lable");
        let name_input = document.createElement("input")
        name_input.className = "savepoint addresname point_input"
        let delete_button = document.createElement("button")
        delete_button.innerText = "Удалить точку"
        delete_button.classList.add('point_btn')

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

        point.append(name_lable, name_input)

        let addres_lable = document.createElement("lable")
        addres_lable.innerText = "Адрес";
        addres_lable.classList.add('point_lable')
        let addres_input = document.createElement("input")
        addres_input.className = "savepoint addres  point_input"
        let addres_button = document.createElement("button")
        addres_button.innerText = "Поставить на карте"
        addres_button.classList.add('point_btn')

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
        let div_btns = document.createElement('div');
        div_btns.className = 'flex flex-betwen'
        
        div_btns.append(delete_button, addres_button)

        point.append(addres_lable, addres_input, div_btns)

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



    savebtn.onclick = async () => {
        let savedRoute = {}
        let sevedPoints = []
        let saveNodeList = document.querySelectorAll(".savepoint")
        for (let i = 0; i<saveNodeList.length; i +=2) {
            let pointdesc = {}
            await ymaps.geocode(saveNodeList[i+1].value).then( 
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
            var activeRoute = multiRoute.getActiveRoute();
            savedRoute.distanse = activeRoute.properties.get("distance").text
            savedRoute.time = activeRoute.properties.get("duration").text
        console.log(savedRoute);

        fetch("http://localhost:3000/upload/new/route", {
            method: "POST",
            body: JSON.stringify(savedRoute),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(res => res.json)
        .then((data) => {
        })
    }
}

document.querySelector("#inputpicture").addEventListener("change", (event) => {
    const files = event.target.files;

    for (const file of files) {
        let reader = new FileReader();
        let img = document.createElement("img");

        reader.onload = e => {
            img.src = e.target.result;
            // img.style.width = "100px";
            img.className = "rounded-10 h-full w-full shadow-2xl shadow-slate-900"; 
            document.querySelector("#puctureArea").append(img);
        };

        reader.readAsDataURL(file);
        selectedFiles.push(file); 
    }

});

document.querySelector("#uploadButton").addEventListener("click", async () => {
    if (selectedFiles.length === 0) {
        alert("Вы не выбрали картинки!");
        return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
        formData.append('file', file);
    });

    try {
        const response = await fetch("http://localhost:3000/upload/images", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("Файлы успешно загружены!");
            selectedFiles.length = 0; 
            document.querySelector("#puctureArea").innerHTML = ""; 
        } else {
            alert("Ошибка при загрузке файлов");
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Произошла ошибка");
    }
});



ymaps.ready(init)