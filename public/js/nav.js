const openModalButton = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const modalContent = document.getElementById("mainModal");

const handleResize = () => {
    if (window.innerWidth >= 1024) {
        desktopMenu.classList.remove('hidden');
        mobileMenu.classList.add('hidden');
    } else {
        desktopMenu.classList.add('hidden');
}};
window.addEventListener('resize', handleResize);
handleResize();

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

if(window.innerWidth > 1024){
    closeModal;
    alert("OK")
}    
closeModalButton.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});