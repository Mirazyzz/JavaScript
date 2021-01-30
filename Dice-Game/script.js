'use strict';

// global variables
const firstScore = document.getElementById('score-0');
const secondScore = document.getElementById('score-1');
const firstPlayer = document.querySelector('.player-0');
const secondPlayer = document.querySelector('.player-1');
const diceElement = document.querySelector('.dice');
const modalSetup = document.querySelector('.modal');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');
const btnNewGame = document.querySelector('.btn-new');

let goalScore;

// setting up event listeners
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
btnNewGame.addEventListener('click', () => openModal());

// document.addEventListener('keydown', function (e) {
//   // console.log(e.key);

//   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
//     closeModal();
//   }
// });

// firstScore.textContent = '0';
// secondScore.textContent = '0';
// diceElement.classList.add('hidden');

// const openModal = () => {
//   modal.classList.remove('hidden');
//   overlay.classList.remove('hidden');
// };

// const closeModal = () => {
//   modal.classList.add('hidden');
//   overlay.classList.add('hidden');
// };

function openModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  const goalScore = document.getElementById('goal-score');

  if (goalScore.value) {
    goalScore.style.border = '2px solid';
    modal.classList.add('hidden');
    overlay.classList.add('hidden');

    setupGame(goalScore.value);
  } else {
    document.getElementById('goal-score').style.borderColor = 'red';
    alert('Please, enter goal score value');
  }
}

const setupGame = (goalScore) => {
  goalScore = goalScore;
  firstScore.textContent = '0';
  secondScore.textContent = '0';
};
