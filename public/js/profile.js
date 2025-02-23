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
