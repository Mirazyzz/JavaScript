'use strict';

// global variables
const firstScore = document.getElementById('score-0');
const secondScore = document.getElementById('score-1');
const firstCurrentScore = document.getElementById('current-0');
const secondCurrentScore = document.getElementById('current-1');
const firstDice = document.getElementById('dice-0');
const secondDice = document.getElementById('dice-1');
const firstPlayer = document.querySelector('.player-0');
const secondPlayer = document.querySelector('.player-1');
const modalSetup = document.querySelector('.modal');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');
const btnNewGame = document.querySelector('.btn-new');
const btnRoll = document.querySelector('.btn-roll');
const btnHold = document.querySelector('.btn-hold');

let active = 0;
let goalScore;
let dice;
let isGameOn = false;

// setting up event listeners
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
btnNewGame.addEventListener('click', () => openModal());
btnRoll.addEventListener('click', roll);
btnHold.addEventListener('click', hold);

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
  const diceSelect = document.getElementById('dice-number');
  const diceCount = diceSelect.options[diceSelect.selectedIndex].text;

  if (goalScore.value) {
    goalScore.style.border = '2px solid';
    modal.classList.add('hidden');
    overlay.classList.add('hidden');

    setupGame(goalScore.value, diceCount);
  } else {
    document.getElementById('goal-score').style.borderColor = 'red';
    alert('Please, enter goal score value');
  }
}

function setupGame(goalScore, diceCount) {
  goalScore = goalScore;
  dice = diceCount;
  firstScore.textContent = '0';
  secondScore.textContent = '0';
  isGameOn = true;

  if (dice == 1) {
    firstDice.style.visibility = 'visible';
  } else {
    firstDice.style.visibility = 'visible';
    secondDice.style.visibility = 'visible';
  }
}

function roll() {
  if (!isGameOn) return;

  if (dice == 1) {
    const roll = Math.floor(Math.random() * 6) + 1;

    firstDice.src = `img/dice-${roll}.png`;

    active == 0
      ? (firstCurrentScore.textContent =
          roll + Number(firstCurrentScore.textContent))
      : (secondCurrentScore.textContent =
          roll + Number(secondCurrentScore.textContent));
  } else {
    const firstRoll = Math.floor(Math.random() * 6) + 1;
    const secondRoll = Math.floor(Math.random() * 6) + 1;

    firstDice.src = `img/dice-${firstRoll}.png`;
    secondDice.src = `img/dice-${secondRoll}.png`;

    active == 0
      ? (firstCurrentScore.textContent =
          firstRoll + secondRoll + Number(firstCurrentScore.textContent))
      : (secondCurrentScore.textContent =
          firstRoll + secondRoll + Number(secondCurrentScore.textContent));
  }
}
function hold() {
  if (!isGameOn) return;

  if (active == 0) {
    firstScore.textContent =
      Number(firstCurrentScore.textContent) + Number(firstScore.textContent);
    firstCurrentScore.textContent = '0';
    active = 1;
  } else {
    secondScore.textContent =
      Number(secondCurrentScore.textContent) + Number(secondScore.textContent);
    secondCurrentScore.textContent = '0';
    active = 0;
  }

  firstPlayer.classList.toggle('player-active');
  secondPlayer.classList.toggle('player-active');
}
