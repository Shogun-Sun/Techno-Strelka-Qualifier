var map
document.addEventListener("DOMContentLoaded", loadContent)

async function loadContent() {
    const routeModerResponse  = await fetch("/moderation/get/all/public/unverifi/routes", {
        method:"GET",
        headers: {
            "Content-type" : "application/json",
        },
    })
    let routeModer = await routeModerResponse.json()
    console.log(routeModer)

    let moderTableBody = document.querySelector("#moderTableBody")

    routeModer.data.forEach(route => {
        let tr = document.createElement("tr")
        tr.className = "moder_table_row"

        tr.onclick = () => {
            let route_addres = route.Points[0].point_data.map(elem => elem.addres)
            console.log(route_addres)
            try {
                map.geoObjects.remove(multiRoute);
            } catch(err) {}
                document.querySelector("#photos").innerHTML = ""
            multiRoute = new ymaps.multiRouter.MultiRoute(
                {
                  referencePoints: route_addres,
                },
                {
                  boundsAutoApply: true,
                }
              );
              map.geoObjects.add(multiRoute);

              document.querySelector("#description").innerText = route.RoutesHistories[0].route_description

              console.log(route.RoutesHistories[0].route_images.split(","))
              route.RoutesHistories[0].route_images.split(",").forEach((photo) => {
                let img = document.createElement("img")
                img.src = `/storages/images/${photo}`
                document.querySelector("#photos").append(img)
              })

        }

        td_name = document.createElement("td")
        td_name.className = "px-2 text-base lg:text-lg text-slate-900 dark:text-gray-300"
        td_name.innerText = route.RoutesHistories[0].route_name

        td_autor = document.createElement("td")
        td_autor.className = "px-2 text-base lg:text-lg text-slate-900 dark:text-gray-300"
        td_autor.innerText = route.user_id

        td_date = document.createElement("td")
        td_date.className = "px-2 text-base lg:text-lg text-slate-900 dark:text-gray-300"
        let add_at = route.RoutesHistories[0].edited_at.split("T")
        td_date.innerText = add_at[0] + " " + add_at[1].substr(0, 5)

        td_buttons = document.createElement("td")
        td_buttons.classList = "flex justify-around items-center h-12 w-[370px] md:w-[430px] lg:w-[500px] gap-4 px-2"

        reject_btn = document.createElement("button")
        reject_btn.className = "text-slate-900 rounded-lg bg-red-600 text-base lg:text-lg px-1 py-1 w-28 md:w-32 lg:w-40 z-10 dark:text-gray-300"
        reject_btn.innerText = "Отклонить"
        reject_btn.onclick = async () => {
            closeModal()
            const verifiResponse = await fetch("/moderation/set/verifi", {
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: JSON.stringify({route_id: route.route_id, route_verifi: 0})
            })
            const verifi = await verifiResponse.json()
            console.log(verifi)
            tr.remove()
        }
        
        accept_btn = document.createElement("button")
        accept_btn.className = "text-slate-900 rounded-lg bg-emerald-500 text-base lg:text-lg px-1 py-1 w-28 md:w-32 lg:w-40 z-10 dark:text-gray-300"
        accept_btn.innerText = "Подтвердить"
        accept_btn.onclick = async () => {
            closeModal()
            const verifiResponse = await fetch("/moderation/set/verifi", {
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: JSON.stringify({route_id: route.route_id, route_verifi: 1})
            })
            const verifi = await verifiResponse.json()
            console.log(verifi)
            tr.remove()
        }

        td_buttons.append(reject_btn, accept_btn)
        tr.append(td_name, td_autor, td_date, td_buttons)

        moderTableBody.append(tr)

    });

    const open_modals = document.getElementsByClassName("moder_table_row");
    const modalModer = document.getElementById('modalModer');
    const closeModalButton = document.getElementById('closeModalModer');
    const cancelButton = document.getElementById('cancelButton');
    const modalContent = document.getElementById("mainModal");

    function Open_Modal() {
        modalModer.classList.remove('hidden');
        setTimeout(() => {
            modalModer.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
            modalModer.classList.add('flex');
            modalModer.classList.add('opacity-100');
        }, 10);
    }

    for (var i = 0; i < open_modals.length; i++) {
        open_modals[i].addEventListener('click', () => {
            Open_Modal();   
        });
    }

    const closeModal = () => {
        modalModer.classList.remove('opacity-100');
        modalModer.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            modalModer.classList.add('hidden');
        }, 10);
    };

    closeModalButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

}

function init() {
    map = new ymaps.Map("map", {
        center: [56.304681092875974, 43.983099494694265],
        zoom: 7,
        controls: [],
    });
}
ymaps.ready(init);