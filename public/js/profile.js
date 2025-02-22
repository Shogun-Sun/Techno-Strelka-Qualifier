const new_route = document.getElementById("new_route");

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

  const socket = io("http://localhost:3000");
  socket.on("newAvatar", (data) => {
    document.querySelector(
      "label[for='avatar']"
    ).style.backgroundImage = `url(http://localhost:3000/storages/images/${data})`;
  });


  document.getElementById("save").addEventListener('click', async() => {
    const new_name = document.getElementById("name").value;
    const new_lastname = document.getElementById("surname").value;
    const new_patronymic = document.getElementById("patronymic").value;
    const new_email = document.getElementById("new_email").value
    const newUserData = {
      user_id: data.data.id,
      user_name: new_name, 
      user_lastname: new_lastname, 
      user_patronymic: new_patronymic, 
      user_email: new_email,
    }
    const saveData = await fetch("/user/update/user/data", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData), 
    });
  })






})();
