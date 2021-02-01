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
const modalHowTo = document.querySelector('.how-to');
const overlay = document.querySelector('.overlay-setup');
const overlayHowTo = document.querySelector('.overlay-how-to');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');
const btnNewGame = document.querySelector('.btn-new');
const btnRoll = document.querySelector('.btn-roll');
const btnHold = document.querySelector('.btn-hold');
const btnHowTo = document.querySelector('.fa-question-circle');

// player who started game on previous game/round
let previousStarted = 1;
// current player
let active = 0;
let goalScore;
let dice;
let isGameOn = false;
let firstTotalScore = 0;
let secondTotalScore = 0;

// setting up event listeners
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
overlayHowTo.addEventListener('click', closeHowToModal);
btnNewGame.addEventListener('click', () => openModal());
btnRoll.addEventListener('click', roll);
btnHold.addEventListener('click', hold);
btnHowTo.addEventListener('click', () => openHowToModal());

function openModal() {
  modalSetup.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  const goalScore = document.getElementById('goal-score');
  const diceSelect = document.getElementById('dice-number');
  const diceCount = diceSelect.options[diceSelect.selectedIndex].text;

  if (isValidNumber(goalScore.value)) {
    goalScore.style.border = '2px solid';
    modalSetup.classList.add('hidden');
    overlay.classList.add('hidden');

    setupGame(goalScore.value, diceCount);
  } else {
    document.getElementById('goal-score').style.borderColor = 'red';
    alert('Please, enter valid goal score value');
  }
}

function openHowToModal() {
  modalHowTo.classList.remove('hidden');
  overlayHowTo.classList.remove('hidden');
}

function closeHowToModal() {
  modalHowTo.classList.add('hidden');
  overlayHowTo.classList.add('hidden');
}

function setupGame(inputScore, diceCount) {
  goalScore = Number(inputScore);
  dice = diceCount;
  firstScore.textContent = '0';
  secondScore.textContent = '0';
  firstCurrentScore.textContent = '0';
  secondCurrentScore.textContent = '0';
  isGameOn = true;
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  if (previousStarted == 0) {
    previousStarted = 1;
    active = 1;

    firstPlayer.classList.remove('player-active');
    secondPlayer.classList.add('player-active');
  } else {
    previousStarted = 0;
    active = 0;

    firstPlayer.classList.add('player-active');
    secondPlayer.classList.remove('player-active');
  }

  if (dice == 1) {
    firstDice.src = 'img/dice-6.png';
    firstDice.style.visibility = 'visible';
  } else {
    firstDice.src = 'img/dice-6.png';
    secondDice.src = 'img/dice-6.png';
    firstDice.style.visibility = 'visible';
    secondDice.style.visibility = 'visible';
  }
}

function roll() {
  if (!isGameOn) {
    alert('Please, start a new game');
    return;
  }

  if (dice == 1) {
    const roll = Math.floor(Math.random() * 6) + 1;

    firstDice.src = `img/dice-${roll}.png`;

    if (roll === 1) {
      switchPlayer();
      return;
    }

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

    if (firstRoll == secondRoll) {
      switchPlayer();
      return;
    }

    active == 0
      ? (firstCurrentScore.textContent =
          firstRoll + secondRoll + Number(firstCurrentScore.textContent))
      : (secondCurrentScore.textContent =
          firstRoll + secondRoll + Number(secondCurrentScore.textContent));
  }
}

function hold() {
  if (!isGameOn) {
    alert('Please, start a new game');
    return;
  }

  if (active == 0) {
    // Add current score to the global score
    firstScore.textContent =
      Number(firstCurrentScore.textContent) + Number(firstScore.textContent);

    if (Number(firstScore.textContent) >= goalScore) {
      document.getElementById('name-0').textContent = 'Winner!';
      document.getElementById('total-0').textContent = ++firstTotalScore;
      isGameOn = false;
    }
  } else {
    // Add current score to the global score
    secondScore.textContent =
      Number(secondCurrentScore.textContent) + Number(secondScore.textContent);

    if (Number(secondScore.textContent) >= goalScore) {
      document.getElementById('name-1').textContent = 'Winner!';
      document.getElementById('total-1').textContent = ++secondTotalScore;
      isGameOn = false;
    }
  }

  switchPlayer();
}

function isValidNumber(value) {
  return /^\d+$/.test(value);
}

function switchPlayer() {
  active == 0 ? (active = 1) : (active = 0);

  firstPlayer.classList.toggle('player-active');
  secondPlayer.classList.toggle('player-active');

  firstCurrentScore.textContent = '0';
  secondCurrentScore.textContent = '0';
}
