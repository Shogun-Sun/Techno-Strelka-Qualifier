const openModalButton = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const modalContent = document.getElementById("mainModal");
const log = document.querySelectorAll(".log")
const moderation_div = document.querySelectorAll(".moderation_div")


fetch("/user/get/data", {
    method:"GET",
    headers:{
        "Content-Type": "application/json",
    }
})
.then(res=>res.json())
.then((userData) => {
    console.log(userData)
    if(userData.data) {
        if (userData.data.role == "user") {
            moderation_div.forEach(elem => elem.remove())
        }
        log.forEach((elem) => {
            console.log(elem)
            console.log(elem)
            elem.innerHTML = "Log out"
            elem.onclick = () => {
                fetch("/user/logout", {
                    method:"Post",
                    headers:{
                        "Content-Type": "application/json",
                    },
                })
                .then(res=> res.json())
                .then((userOutMessage) => {
                    // console.log(userOutMessage)
                })
            }
        })
        
    } else {
        // console.log(moderation_div)
        moderation_div.forEach(elem => elem.remove())   
    }
})

openModalButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    setTimeout(() => {
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modal.classList.add('flex');    
    modal.classList.add('opacity-100');
    }, 10);
});

const closeModal = () => {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
    modal.classList.add('hidden');
    }, 10);
};

closeModalButton.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

const handleResize = () => {
    if (window.innerWidth > 1024) {
        document.querySelector("#desktopMenu").classList.remove('hidden');
        openModalButton.classList.add('hidden');
        closeModal();
    } else {
        document.querySelector("#desktopMenu").classList.add('hidden');
        openModalButton.classList.remove('hidden')
}};
window.addEventListener('resize', handleResize);
handleResize();

