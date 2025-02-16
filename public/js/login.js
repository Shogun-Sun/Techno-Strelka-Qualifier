//-------------------------log in
document.querySelector("#login_btn").onclick = login_function

function login_function() {
    let login_user_data = {}
   
    login_user_data.user_email = document.querySelector("#login")
    login_user_data.user_password = document.querySelector("#password")

    del_errs()

    let pass = validate(login_user_data)
    
    if (pass == true) {
        convert(login_user_data)
        fetch("/user/log", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(login_user_data),
        })
        .then(res => res.json())
        .then((res) => {
            if (res.message == "Успешный вход") {
                window.location.href = "/";
            } else {
                alert(res.message)
            }
        })
    }
}

//----------------------------------------------вывод ошибок на форму
function create_err(element, message) {
    let errors = document.createElement("p")
    errors.classList.add("errors", "text-pink-600")
    element.classList.add("border-pink-600")
    errors.innerText = message
    element.parentNode.append(errors)
}

//-------------------------------------------------------------проверка валидности формы
function validate(user_data) {
    let pass = true;
    Object.values(user_data).forEach((elem) => {
        let messages = []
        if (elem.value == "" || elem.value == null) {
            messages.push("Заполните поле")
            pass = false
        } else { 
            if ((!["fio", "email", "login"].includes(elem.id)) && (elem.value.length < 8 || elem.value.length > 20)) {
                messages.push("поле должно содержать от 8 до 20 символов")
                pass = false
            }
            if ((elem.id == "login" || elem.id == "email" ) && (!elem.value.includes("@"))) {
                messages.push("Неверный формат почты")
                pass = false
            }
            if ((elem.id == "reg_password" || elem.id == "reg_password_2") && (document.querySelector("#reg_password").value != document.querySelector("#reg_password_2").value)) {
                messages.push("Пароли не совпадают")
                pass = false
            }
            if (elem.id == "fio" && ![2, 3].includes(elem.value.split(" ").length)) {
                messages.push("Пример: Иванов Иван Иванович(при наличии)")
                pass = false
            }
            
        }
        messages.forEach((err) => {
            create_err(elem, err)
        })
    })
    return pass
}

//-----------------------------------конвертация данных пользователя из DOM элементов в значения
function convert(user_data) {
    Object.keys(user_data).forEach((key) => {
        user_data[key] = user_data[key].value 
    })
}

//------------------------------------удаление всех сообщений валидации
function del_errs() {
    document.querySelectorAll(".errors").forEach((err) => {
        err.remove()
    })
    document.querySelectorAll("input").forEach((input) => {
        input.classList.remove("border-pink-600")
    })
}
//-----------------------------------registration
document.querySelector("#reg_btn").onclick = reg_function

function reg_function() {
    let reg_user_data = {
        user_name:document.querySelector("#fio"),
        user_email:document.querySelector("#email"),
        user_password:document.querySelector("#reg_password"),
        user_password_2:document.querySelector("#reg_password_2"),
    }

    del_errs()

    let pass = validate(reg_user_data)

    if (pass == true) {
        let fio = reg_user_data.user_name.value.split(" ")

        reg_user_data.user_name = fio[1]
        reg_user_data.user_lastname = fio[0]
        reg_user_data.user_patronymic = fio[2] ?? null
        reg_user_data.user_email = reg_user_data.user_email.value
        reg_user_data.user_password = reg_user_data.user_password.value
        delete reg_user_data.user_password_2

        console.log(reg_user_data)

        fetch("/user/reg", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reg_user_data),
        })
        .then(res => res.json())
        .then((res) => {
            if (res.message == "Успешный вход") {
                window.location.href = "/";
            } else {
                alert(res.message)
            }
        })
    }
}