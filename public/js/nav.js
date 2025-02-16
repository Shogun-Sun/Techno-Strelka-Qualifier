const openModalButton = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const modalContent = document.getElementById("mainModal");

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

