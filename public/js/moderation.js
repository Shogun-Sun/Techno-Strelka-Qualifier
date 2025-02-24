const open_modals = document.getElementsByClassName("moder_table_row");
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const cancelButton = document.getElementById('cancelButton');
const modalContent = document.getElementById("mainModal");

function Open_Modal() {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modal.classList.add('flex');
        modal.classList.add('opacity-100');
    }, 10);
}

for (var i = 0; i < open_modals.length; i++) {
    open_modals[i].addEventListener('click', () => {
        Open_Modal();   
    });
}

const closeModal = () => {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 10);
};

closeModalButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);