const modal = document.querySelector('.modal');
const trigger = document.querySelector('.btn-rules');
const closeBtn = document.querySelector('.close-button');

function toggleModal() {
  modal.classList.toggle('show-modal');
}

function windowOnClick(event) {
  if (event.targer === modal) {
    toggleModal();
  }
}

trigger.addEventListener('click', toggleModal);
closeBtn.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);
