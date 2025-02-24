const new_route = document.getElementById("new_route");

    const new_name = document.getElementById("name");
    const new_lastname = document.getElementById("surname");
    const new_patronymic = document.getElementById("patronymic");
    const new_email = document.getElementById("new_email");
    const newInputData = [new_name, new_lastname, new_email];

new_route.addEventListener("click", () => {
  window.location.href = "/map";
});

(async () => {
  const response = await fetch("/user/get/data", {
    method: "GET",
  });
  const data = await response.json();
  const user_id = data.data.id;
  console.log(data);

  document.querySelector(
    "label[for='avatar']"
  ).style.backgroundImage = `url(http://localhost:3000/storages/images/${data.data.avatar})`;
  document.getElementById("fio").innerText = `${data.data.username} ${data.data.lastname} ${data.data.patronymic}`;
  document.getElementById("email").innerText = `${data.data.email}`;

  new_patronymic.value = `${data.data.patronymic}`;
  new_lastname.value = `${data.data.lastname}`;
  new_name.value = `${data.data.username}`;
  new_email.value = `${data.data.email}`;


  document
    .getElementById("avatar")
    .addEventListener("change", async function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user_id);

      try {
        const response = await fetch("/user/upload/new/avatar", {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      }
    });

  document.getElementById("save").addEventListener('click', async() => {
    
    for (const newID of newInputData) {
      if (newID.value.trim() === "") {
        alert("Все поля, кроме отчества не должны быть пустыми");
        return; 
      }
    }
    
    const newUserData = {
      user_id: data.data.id,
      user_name: new_name.value, 
      user_lastname: new_lastname.value, 
      user_patronymic: new_patronymic.value, 
      user_email: new_email.value,
    }
 
      await fetch("/user/update/user/data", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData), 
    });
  });

})();


document.addEventListener("DOMContentLoaded", renderUserRoutes)

async function renderUserRoutes () {
  const response = await fetch("/rote/get/all/user/routes", {
    method: "GET",
  })
  const userRoutes = await response.json()
  console.log(userRoutes)
  userRoutes.data.forEach(route => {
    
    let route_card = document.createElement("div")
    route_card.className = `border-2 rounded-10 h-full w-72 sm:w-80 shadow-card bg-cover bg-clip-padding flex flex-col justify-end p-4 gap-3 bg-center hover:bg-[100%] duration-300 shrink-0 snap-center snap-mandatory snap-always`
    route_card.style.backgroundImage = `url(/storages/Images/${route.RoutesHistories[0].route_images})`

    route_card.onclick = () => {
      window.location.href = `/route/watch?route_id=${route.route_id}`
    }
  
    let routeName = document.createElement("p")
    routeName.className = "text-gray-100 font-semibold text-2xl"
    routeName.innerText = route.RoutesHistories[0].route_name

    let routeDescription = document.createElement("p")
    routeDescription.className = "text-gray-300 font-medium text-lg overflow-hidden w-full h-12 mb-4"
    routeDescription.innerText = route.RoutesHistories[0].route_description.length < 24 ? route.RoutesHistories[0].route_description : route.RoutesHistories[0].route_description.substr(0,50) + "..."

    route_card.append(routeName, routeDescription)
    document.querySelector("#route_area").append(route_card)
  })
}