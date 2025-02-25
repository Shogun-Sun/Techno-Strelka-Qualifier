let routes = document.querySelector("#routes");
let current_user;
let active_route;

let currentDate = new Date();
console.log(currentDate.getMonth());

document.addEventListener("DOMContentLoaded", getAllRoutes);

function getAllRoutes() {
  fetch("/user/get/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      current_user = res;
    });

  fetch("/route/get/all/public/routes/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((allRoutes) => {
      console.log(allRoutes);
      document.querySelector("#loading").remove();

      allRoutes.data.forEach((route) => { 
  
          const firstHistory = route.RoutesHistories[0];
  
          if (!firstHistory) { 
            console.error("Маршрут не найден:", route.route_id);
            return; 
          }
  
          const allCardImages = firstHistory.route_images ? firstHistory.route_images.split(",") : []; 
          let routeCard = document.createElement("div");
          routeCard.className = `flex flex-col justify-between items-center bg-cover h-64 shadow-prl dark:shadow-prd rounded-10 p-3 w-[295px] shrink-0`;
  
          if (allCardImages.length > 0) { 
              routeCard.style.backgroundImage = `url(./storages/images/${allCardImages[0]})`;
          } else {
            routeCard.style.backgroundColor = '#ccc'; 
          }
  
          let routeName = document.createElement("span");
          routeName.className = "text-gray-200 text-xl";
          routeName.innerText = firstHistory.route_name || "название отсутствует"; 
  
          let desc_time_div = document.createElement("div");
          desc_time_div.className = "flex justify-between w-full text-base items-center text-gray-200";
          let buttom = document.createElement("div");
          buttom.className = "flex flex-col items-center w-full text-gray-200";
  
          let description = document.createElement("span");
          description.innerText = (firstHistory.route_description || "").length < 24 
              ? firstHistory.route_description || "" 
              : firstHistory.route_description.substr(0, 24) + "...";
          description.className = "mt-2";
  
          let distanse = document.createElement("span");
          distanse.innerHTML = `
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-none mr-1">
                  <path d="M6.81207 6.05324C9.53921 2.87158 14.4614 2.87158 17.1885 6.05324C19.382 8.61225 19.382 12.3884 17.1885 14.9474L13.0785 19.7424C12.7864 20.0831 12.6404 20.2535 12.4797 20.3413C12.1809 20.5045 11.8197 20.5045 11.5209 20.3413C11.3602 20.2535 11.2142 20.0831 10.9221 19.7424L6.81207 14.9474C4.61863 12.3884 4.61863 8.61225 6.81207 6.05324Z" class="stroke-2 stroke-gray-200"></path>
                  <path d="M14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10Z"class="stroke-2 stroke-gray-200"></path>
              </svg>`;
          distanse.insertAdjacentHTML("beforeend", `${firstHistory.route_distance || ""}`); 
          distanse.className = "flex";
  
          let time = document.createElement("span");
          time.innerHTML = `
              <svg class="w-6 h-6 stroke-2 stroke-gray-200 fill-none mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                   <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              `;
          time.insertAdjacentHTML("beforeend", `${firstHistory.route_time || ""}`);
          time.classList = "flex";
  
          desc_time_div.append(distanse, time);
          buttom.append(desc_time_div, description);
          routeCard.append(routeName, buttom);
          routes.append(routeCard);
          routeCard.onclick = () => {
              renderRoute(route.route_id);
          };
      });
  });
}

async function renderRoute(route_id) {
  fetch("/route/get/route/by/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ route_id }),
  })
    .then((res) => res.json())
    .then((responseRoute) => {
      active_route = responseRoute.data;
      console.log(active_route);
      document.querySelector("main").remove();
      let main = document.createElement("main");
      main.className =
        "mt-10 w-full min-h-[calc(100vh-56px)] px-2 sm:px-4 md:px-6 lg:px-8 pt-3 mb-12";
      let routeMap = document.createElement("div");
      routeMap.id = "map";
      routeMap.className =
        "h-[700px] w-full bg-white shadow-xl shadow-slate-300 rounded-10 dark:shadow-slate-950 dark:bg-slate-900 ";

      let back_button = document.createElement("button");
      back_button.className =
        " flex justify-between items-center text-sm w-10 mb-2 rounded-10 bg-yellow-500 text-gray-200 px-3 py-2";
      back_button.innerHTML = `
        <svg class="w-6 h-6 stroke-2 stroke-slate-900 dark:stroke-gray-200 fill-none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
        </svg>
        `;

      back_button.onclick = () => {
        location.reload();
      };

      let className_conteiner = document.createElement("div");
      className_conteiner.id = "className_conteiner";
      className_conteiner.className = "flex justify-center";
      let route_name = document.createElement("span");
      route_name.className =
        "text-4xl font-semibold p-3 text-slate-900 underline decoration-solid decoration-yellow-500 underline-offset-[10px] dark:text-gray-200";
      route_name.innerText = active_route.route_name;
      className_conteiner.append(route_name);

      let act_description_lable = document.createElement("lable");
      act_description_lable.innerText = "Описание маршрута:";
      act_description_lable.className =
        "text-2xl text-slate-900 dark:text-gray-200 underline decoration-solid decoration-yellow-500 font-semibold";

      let act_description = document.createElement("p");
      act_description.innerText = active_route.route_description;
      act_description.classList =
        "text-lg text-slate-900 dark:text-gray-300 px-3 mb-5";

      let act_distance = document.createElement("span");
      act_distance.innerText = `Дистанция - ${active_route.route_distance}`;
      act_distance.classList =
        " text-2xl underline decoration-solid decoration-yellow-500 font-semibold underline-offset-4 dark:text-gray-200";

      let act_time = document.createElement("span");
      act_time.innerText = `время прохождения - ${active_route.route_time}`;
      act_time.classList =
        " text-2xl underline decoration-solid decoration-yellow-500 font-semibold dark:text-gray-200";

      let userPoints = document.createElement("div");
      userPoints.id = "userPoints";
      userPoints.className =
        "mt-6 bg-white shadow-xl shadow-slate-300 rounded-10 dark:shadow-slate-950 dark:bg-slate-900 p-3";
      let userPoints_lable = document.createElement("lable");
      userPoints_lable.innerText = "Посещаемые места";
      userPoints_lable.className =
        "text-2xl underline decoration-solid decoration-yellow-500 font-semibold dark:text-gray-200";
      userPoints.append(userPoints_lable);

      let allImages = document.createElement("div");
      allImages.className =
        "flex flex-row flex-wrap justify-around gap-8 mt-6 bg-white shadow-xl shadow-slate-300 rounded-10 dark:shadow-slate-950 dark:bg-slate-900 p-6 mb-6";
      let act_images = active_route.route_images.split(",");
      act_images.forEach((image) => {
        let img = document.createElement("img");
        img.src = `./storages/images/${image}`;
        img.className =
          "h-64 w-auto shrink-0 rounded-10 shadow-2xl shadow-slate-500";
        allImages.append(img);
      });

      let act_description_div = document.createElement("div");
      act_description_div.id = "act_description_div";
      act_description_div.className =
        "flex flex-col mb-5 bg-white shadow-xl shadow-slate-300 rounded-10 dark:shadow-slate-950 dark:bg-slate-900 p-3";
      act_description_div.append(act_description_lable, act_description);

      let distanse_time_div = document.createElement("div");

      distanse_time_div.classList =
        "flex flex-col items-start w-full bg-white shadow-xl shadow-slate-300 rounded-10 dark:shadow-slate-950 dark:bg-slate-900 p-3";

      let route_info = document.createElement("div");
      route_info.id = "route_info";
      route_info.classList = "flex flex-col";

      let comments_div = document.createElement("div");
      comments_div.className = "mx-3 ";
      comments_div.id = "comments_div";

      let rating = document.createElement("div");
      rating.className =
        "flex gap-10 h-10 items-center mb-6 bg-white shadow-xl shadow-slate-300 rounded-10 dark:shadow-slate-950 dark:bg-slate-900 p-6";
      rating.id = "rating";

      distanse_time_div.append(act_distance, act_time);
      route_info.append(act_description_div, distanse_time_div);
      main.append(
        back_button,
        routeMap,
        className_conteiner,
        route_info,
        userPoints,
        allImages,
        rating,
        comments_div
      );
      document.querySelector("body").append(main);

      render_rating();
      renderComments();

      const socket = io("http://localhost:3000");

      socket.on("newComment", (comments) => {
        console.log("Соединение с сервером установлено");
        console.log(comments);
        renderComments();
      });

      function init() {
        let map = new ymaps.Map("map", {
          center: [56.304681092875974, 43.983099494694265],
          zoom: 10,
          controls: [],
        });
        let refPoints = [];
        active_route.Route.Points[0].point_data.forEach((point) => {
          refPoints.push(point.addres);
          let point_div = document.createElement("div");
          point_div.className = "flex gap-4";

          let point_name = document.createElement("span");
          point_name.className =
            "flex px-3 text-xl text-slate-9000 font-semibold w-32 items-center dark:text-gray-200";
          point_name.innerText = point.name;

          let point_addres = document.createElement("span");
          point_addres.className =
            "px text-xl text-slate-900 flex items-center dark:text-gray-300";
          point_addres.innerText = `По адресу:  ${point.addres}`;

          point_div.append(point_name, point_addres);
          userPoints.append(point_div);
        });

        let multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: refPoints,
          },
          {
            boundsAutoApply: true,
          }
        );
        map.geoObjects.add(multiRoute);
      }

      ymaps.ready(init);
    })
    .catch((err) => {
      alert("Маршрут недоступен");
      console.log(err);
    });
}

function renderComments() {
  console.log(active_route.Route.route_id);
  fetch("/comment/get/route/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ route_id: active_route.Route.route_id }),
  })
    .then((res) => res.json())
    .then((commentsResponse) => {
      commentsResponse = commentsResponse.data;
      console.log(commentsResponse);

      let comments_div = document.createElement("div");
      comments_div.className = "";
      comments_div.id = "comments_div";

      let allComments = document.createElement("div");
      allComments.id = " allComments";
      allComments.className =
        "px-6 text-xl text-slate-900 dark:text-gray-300 py-4 flex flex-col gap-6 rounded-10 shadow-xl shadow-slate-400 bg-white dark:shadow-slate-950 dark:bg-slate-900";

      let sup_div = document.createElement("div");
      sup_div.className = "hidden";

      allComments.append(sup_div);

      commentsResponse.forEach((comment) => {
        let com_div = document.createElement("div");
        com_div.className =
          "border-2 border-yellow-500 rounded-10 bg-none w-full p-3";

        let com_text = document.createElement("span");
        com_text.innerText = comment.comment_text;
        com_text.className = "";

        let com_date = document.createElement("span");
        time = comment.createdAt.split("T");
        console.log(time);
        com_date.innerText = time[0] + " " + time[1].slice(0, 5);
        com_date.className = "text-slate-900 dark:text-gray-300";

        let com_user = document.createElement("span");
        com_user.innerText =
          comment.User.user_lastname + " " + comment.User.user_name;
        com_user.className = "";

        let user_image = document.createElement("img");
        user_image.src = `/storages/images/${comment.User.user_avatar}`;
        user_image.className = "rounded-full h-10 w-10 border";

        let imageAndUser = document.createElement("div");
        imageAndUser.className = "flex items-end gap-4";
        imageAndUser.append(user_image, com_user);

        let userName_Date = document.createElement("div");
        userName_Date.className = "flex justify-between";
        userName_Date.append(imageAndUser, com_date);

        com_div.append(userName_Date, com_text);
        allComments.insertBefore(com_div, allComments.children[0]);
      });
      comments_div.append(allComments);
      if (current_user.data) {
        let createComment_div = document.createElement("div");
        createComment_div.id = "createComment_div";
        createComment_div.className = "flex gap-4";

        let com_input = document.createElement("input");
        com_input.className =
          "border-2 border-gray-500 w-full rounded-10 focus:outline-yellow-500 px-2 text-slate-900 dark:border-none dark:dark:bg-gray-700 dark:text-gray-300";

        let commit_btn = document.createElement("button");
        commit_btn.className =
          "text-white text-lg px-4 py-2 rounded-10 bg-yellow-500 dark:text-slate-900";
        commit_btn.innerText = "Отправить";
        commit_btn.onclick = () => {
          let sendMessange = {
            user_id: current_user.data.id,
            route_id: active_route.Route.route_id,
            comment_text: com_input.value,
          };
          console.log(sendMessange);
          fetch("/comment/new/route/comment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sendMessange),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              renderComments();
            });
        };
        createComment_div.append(com_input, commit_btn);
        allComments.append(createComment_div);
      }

      document.querySelector("#comments_div").remove();
      document.querySelector("main").append(comments_div);
    });
}

function render_rating() {
  fetch("/ratingroute/get/rating/route/id", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ route_id: active_route.Route.route_id }),
  })
    .then((res) => res.json())
    .then((route_rating) => {
      console.log(route_rating);

      let like_div = document.createElement("div");
      like_div.id = "like_div";
      like_div.className = "flex gap-2 items-center justify-between";
      like_div.onclick = () => {
        fetch("/ratingroute/post/rating", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            route_id: active_route.Route.route_id,
            user_id: current_user.data.id,
            rating: "1",
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            document.querySelector("#rating").innerHTML = "";
            render_rating();
          });
      };

      let like_icon = document.createElement("div");
      like_icon.className = "";
      like_icon.innerHTML = `
        <svg class="w-10 h-10 fill-none stroke-2 stroke-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"/>
        </svg>
        `;

      let like_count = document.createElement("span");
      like_count.className =
        "text-2xl font-semibold text-slate-900 dark:text-gray-200";
      like_count.innerText = route_rating.likes;

      let dislike_div = document.createElement("div");
      dislike_div.className = "flex gap-2 items-center";
      dislike_div.onclick = () => {
        fetch("/ratingroute/post/rating", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            route_id: active_route.Route.route_id,
            user_id: current_user.data.id,
            rating: "-1",
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            document.querySelector("#rating").innerHTML = "";
            render_rating();
          });
      };

      let dislike_icon = document.createElement("div");
      dislike_icon.innerHTML = `
        <svg class="w-10 h-10 fill-none stroke-2 stroke-rose-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0 0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475"/>
        </svg>
        `;

      let dislike_count = document.createElement("span");
      dislike_count.className =
        " text-2xl font-semibold text-slate-900 dark:text-gray-200";
      dislike_count.innerText = route_rating.dislikes;

      like_div.append(like_icon, like_count);
      dislike_div.append(dislike_icon, dislike_count);
      document.querySelector("#rating").append(like_div, dislike_div);
    });
}
