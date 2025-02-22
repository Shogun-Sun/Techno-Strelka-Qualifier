let routes = document.querySelector("#routes")
let current_user
let active_route

let currentDate = new Date();
console.log(currentDate.getMonth());

document.addEventListener("DOMContentLoaded", getAllRoutes)


function getAllRoutes() {
    fetch("/user/get/data", {
        method:"GET",
        headers:{
            "Content-Type": "application/json",
        },
    })
    .then(res=> res.json())
    .then((res) => {
        current_user = res
        console.log(current_user)
    })
    
    fetch("/route/get/all/public/routes/data", {
        method:"GET",
        headers:{
            "Content-Type": "application/json",
        }
    })
    .then(res => res.json())
    .then((allRoutes) => {
        console.log(allRoutes)
        document.querySelector("#loading").remove()
        allRoutes.data.forEach((route) => {
            let allCardImages = route.route_images.split(",")

            let routeCard = document.createElement("div")
            routeCard.className = `flex flex-col justify-between items-center border-2 border-gray-900 bg-cover h-52`
            routeCard.style.backgroundImage = `url(./storages/images/${allCardImages[0]})`
            let routeName = document.createElement("span")
            routeName.className="text-white"
            routeName.innerText = route.route_name? route.route_name : "название отсутствует"


            let desc_time_div = document.createElement("div")
            desc_time_div.className = "flex flex-row justify-between w-full text-sm px-3"
            let buttom = document.createElement("div")
            buttom.className = "flex flex-col items-center w-full text-white"


            let description = document.createElement("span")
            description.innerText = route.route_description.length < 10 ? route.route_description : route.route_description.substr(0,10) + "..."
            description.className = ""
            let distanse = document.createElement("span")
            distanse.innerText = route.route_distance
            distanse.className = ""
            let time = document.createElement("span")
            time.innerText = route.route_time
            time.classList = ""

            desc_time_div.append(distanse, time)
            buttom.append(desc_time_div, description)
            routeCard.append(routeName, buttom)
            routes.append(routeCard)
            routeCard.onclick = () => {
                renderRoute(route.route_id)
            }
        })
        
    })
}

async function renderRoute (route_id) {
    fetch("/route/get/route/by/id", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({route_id}),
    })
    .then(res => res.json())
    .then((responseRoute) => {
        active_route = responseRoute.data
        console.log(active_route)
        document.querySelector("main").remove()
        let main = document.createElement("main")
        let routeMap = document.createElement("div")
        routeMap.id = "map"
        routeMap.className = "h-[300px] w-[300px]"

        let back_button = document.createElement("button")
        back_button.className = "border-3"
        back_button.innerText = "Назад"
        back_button.onclick = () => {location.reload()}

        let userPoints_lable = document.createElement("lable")
        userPoints_lable.innerText = "Точки маршрута:"
        userPoints_lable.className = ""

        let className_conteiner = document.createElement("div")
        className_conteiner.className = "flex justify-center"
        let userPoints = document.createElement("div")
        userPoints.className = "mt-5"
        userPoints.append(userPoints_lable)


        let route_name = document.createElement("span")
        route_name.className = "text-5xl"
        route_name.innerText = active_route.route_name

        className_conteiner.append(route_name)

        let act_description = document.createElement("p")
        act_description.innerText = active_route.route_description
        act_description.classList = ""

        let act_distance = document.createElement("span")
        act_distance.innerText = `Дистанция маршрута: ${active_route.route_distance}`
        act_distance.classList = ""

        let act_time = document.createElement("span")
        act_time.innerText = `время прохождения маршрута: ${active_route.route_time}`
        act_time.classList = ""

        let allImages = document.createElement("div")
        allImages.classList = "grid grid-cols-5 gap-5"
        let images_desc = document.createElement("lable")
        images_desc.className = "col-span-5 place-self-center p-0"
        images_desc.innerText = "Фотографии этого маршрута:"
        allImages.append(images_desc)
        let act_images = active_route.route_images.split(",")
        act_images.forEach((image) => {
            let img = document.createElement("img")
            img.src = `./storages/images/${image}`
            img.classList = "max-h-full h-auto"
            allImages.append(img)
        })

        let act_description_lable = document.createElement("lable")
        act_description_lable.innerText = "Описание маршрута:"
        act_description_lable.className = ""


        let act_description_div = document.createElement("div")
        act_description_div.className = "flex flex-col mb-3"
        act_description_div.append(act_description_lable, act_description)

        let distanse_time_div = document.createElement("div")
        distanse_time_div.classList = "flex flex-col items-start w-full"

        let route_info = document.createElement("div")
        route_info.classList = "flex flex-col"

        let comments_div = document.createElement("div")
        comments_div.className = "mx-3"
        comments_div.id= "comments_div"

        // fetch("/comment/get/route/comments", {
        //     method:"POST",
        //     headers:{
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({route_id}),
        // })
        // .then(res=> res.json())
        // .then((commentsResponse) => {
        //     commentsResponse = commentsResponse.data
        //     console.log(commentsResponse)
        //     commentsResponse.forEach((comment) => {
        //         let com_div = document.createElement("div")
        //         com_div.className = "border-2 rounded-xl my-2 p-2"

        //         let com_text = document.createElement("span")
        //         com_text.innerText = comment.comment_text
        //         com_text.className = "pl-14"

        //         let com_date = document.createElement("span")
        //         time = comment.createdAt.split("T")
        //         console.log(time)
        //         com_date.innerText = time[0] + " " + time[1].slice(0, 5)
        //         com_date.className = ""

        //         let com_user = document.createElement("span")
        //         com_user.innerText = comment.User.user_lastname + " " + comment.User.user_name
        //         com_user.className = ""

        //         let user_image = document.createElement("img")
        //         user_image.src = `/storages/usersData/${comment.User.user_avatar}`
        //         user_image.className = "rounded-full h-10 w-10"

        //         let imageAndUser = document.createElement("div")
        //         imageAndUser.className = "flex items-end gap-4"
        //         imageAndUser.append(user_image, com_user)

        //         let userName_Date = document.createElement("div")
        //         userName_Date.className = "flex justify-between"
        //         userName_Date.append(imageAndUser, com_date)

        //         com_div.append(userName_Date, com_text)
        //         allComments.append(com_div)
        //     })
        //         comments_div.append(allComments)
        //         if (current_user.data) {
        //             let createComment_div = document.createElement("div")
        //             createComment_div.classList = ""

        //             let com_input = document.createElement("input")
        //             com_input.className = ""

        //             let commit_btn = document.createElement("button")
        //             commit_btn.classList = ""
        //             commit_btn.innerText = "Отправить"
        //             commit_btn.onclick = () => {
        //                 let sendMessange = {
        //                     user_id: current_user.data.id,
        //                     route_id: active_route.Route.route_id,
        //                     comment_text: com_input.value
        //                 }
        //                 console.log(sendMessange)
        //                 fetch("/comment/new/route/comment", {
        //                     method:"POST",
        //                     headers:{
        //                         "Content-Type": "application/json",
        //                     },
        //                     body: JSON.stringify(sendMessange),
        //                 })
        //                 .then(res=> res.json())
        //                 .then((res)=> {
        //                     console.log(res)
        //                 })
        //             }
        //             createComment_div.append(com_input, commit_btn)
        //             comments_div.append(createComment_div)
        //         }

        // })
        distanse_time_div.append(act_distance, act_time)
        route_info.append(act_description_div, distanse_time_div)
        main.append(back_button, routeMap, className_conteiner, route_info, userPoints, allImages, comments_div)
        document.querySelector("body").append(main)

        renderComments()

        function init() {
            let map = new ymaps.Map("map", {
                center: [56.304681092875974,43.983099494694265],
                zoom: 10,
                controls:[]
            })
            let refPoints = []
            active_route.Route.Points[0].point_data.forEach((point) => {
                refPoints.push(point.addres)
                let point_div = document.createElement("div")
                point_div.className = ""

                let point_name = document.createElement("span")
                point_name.className = "mx-3 border-2 px-3"
                point_name.innerText = point.name

                let point_addres = document.createElement("span")
                point_addres.className = "mx-3 border-2 px-3"
                point_addres.innerText = `Адрес:  ${point.addres}`

                point_div.append(point_name, point_addres)
                userPoints.append(point_div)
            })

            let multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: refPoints,
            }, {
                boundsAutoApply: true,
            })
            map.geoObjects.add(multiRoute)


         


        }

        ymaps.ready(init)   

    }) 
    .catch((err) => {
        alert("Маршрут недоступен")
        console.log(err)
    })
}




function renderComments() {
    console.log(active_route.Route.route_id)
    fetch("/comment/get/route/comments", {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({route_id: active_route.Route.route_id}),
        })
        .then(res=> res.json())
        .then((commentsResponse) => {
            commentsResponse = commentsResponse.data
            console.log(commentsResponse)

            let comments_div = document.createElement("div")
            comments_div.className = "mx-3"
            comments_div.id= "comments_div"

            let allComments = document.createElement("div")
            allComments.className = ""

            commentsResponse.forEach((comment) => {

                let com_div = document.createElement("div")
                com_div.className = "border-2 rounded-xl my-2 p-2"

                let com_text = document.createElement("span")
                com_text.innerText = comment.comment_text
                com_text.className = "pl-14"

                let com_date = document.createElement("span")
                time = comment.createdAt.split("T")
                console.log(time)
                com_date.innerText = time[0] + " " + time[1].slice(0, 5)
                com_date.className = ""

                let com_user = document.createElement("span")
                com_user.innerText = comment.User.user_lastname + " " + comment.User.user_name
                com_user.className = ""

                let user_image = document.createElement("img")
                user_image.src = `/storages/usersData/${comment.User.user_avatar}`
                user_image.className = "rounded-full h-10 w-10"

                let imageAndUser = document.createElement("div")
                imageAndUser.className = "flex items-end gap-4"
                imageAndUser.append(user_image, com_user)

                let userName_Date = document.createElement("div")
                userName_Date.className = "flex justify-between"
                userName_Date.append(imageAndUser, com_date)

                com_div.append(userName_Date, com_text)
                allComments.append(com_div)
            })
            comments_div.append(allComments)
            if (current_user.data) {
                let createComment_div = document.createElement("div")
                createComment_div.classList = ""

                let com_input = document.createElement("input")
                com_input.className = ""

                let commit_btn = document.createElement("button")
                commit_btn.classList = ""
                commit_btn.innerText = "Отправить"
                commit_btn.onclick = () => {
                    let sendMessange = {
                        user_id: current_user.data.id,
                        route_id: active_route.Route.route_id,
                        comment_text: com_input.value
                    }
                    console.log(sendMessange)
                    fetch("/comment/new/route/comment", {
                        method:"POST",
                        headers:{
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(sendMessange),
                    })
                    .then(res=> res.json())
                    .then((res)=> {
                        console.log(res)
                        renderComments()
                    })
                }
                createComment_div.append(com_input, commit_btn)
                comments_div.append(createComment_div)
            }
            
            document.querySelector("#comments_div").remove()
            document.querySelector("main").append(comments_div)
        
        })
}