'use strict';

// players elements
const firstScore = document.getElementById('score-0');
const secondScore = document.getElementById('score-1');
const firstCurrentScore = document.getElementById('current-0');
const secondCurrentScore = document.getElementById('current-1');
const firstDice = document.getElementById('dice-0');
const secondDice = document.getElementById('dice-1');
const firstPlayer = document.querySelector('.player-0');
const secondPlayer = document.querySelector('.player-1');

// ui elements
const modalSetup = document.querySelector('.modal');
const modalHowTo = document.querySelector('.modal-how-to');
const overlay = document.querySelector('.overlay-setup');
const overlayHowTo = document.querySelector('.overlay-how-to');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');
const btnNewGame = document.querySelector('.btn-new');
const btnRoll = document.querySelector('.btn-roll');
const btnHold = document.querySelector('.btn-hold');
const btnHowTo = document.querySelector('.fa-question-circle');
const btnCancelSetup = document.querySelector('.cancel-setup');
const btnCancelHowTo = document.querySelector('.close-how-to');

// --- game variables ---

// player who started game on previous game/round
// will be switching between 0 and 1
let previousStarted = 1;
// current player
let active = 0;
let goalScore;
let dice;
// to check if game is started
let isGameOn = false;
// total scores of players
let firstTotalScore = 0;
let secondTotalScore = 0;

// setting up event listeners
btnCloseModal.addEventListener('click', submitSetup);
overlay.addEventListener('click', submitSetup);
overlayHowTo.addEventListener('click', closeHowToModal);
btnNewGame.addEventListener('click', openSetupModal);
btnRoll.addEventListener('click', roll);
btnHold.addEventListener('click', hold);
btnHowTo.addEventListener('click', openHowToModal);
btnCancelSetup.addEventListener('click', cancelSetup);
btnCancelHowTo.addEventListener('click', closeHowToModal);

// modals
function openSetupModal() {
  modalSetup.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function submitSetup() {
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

function cancelSetup() {
  modalSetup.classList.add('hidden');
  overlay.classList.add('hidden');
}

function openHowToModal() {
  modalHowTo.classList.remove('hidden');
  overlayHowTo.classList.remove('hidden');
}

function closeHowToModal() {
  modalHowTo.classList.add('hidden');
  overlayHowTo.classList.add('hidden');
}

// game logic
function setupGame(inputScore, diceCount) {
  // set initial values to the UI elements
  goalScore = Number(inputScore);
  dice = diceCount;
  firstScore.textContent = '0';
  secondScore.textContent = '0';
  firstCurrentScore.textContent = '0';
  secondCurrentScore.textContent = '0';
  isGameOn = true;
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  // if player 1 started game on previous round
  // then player 2 starts the game in current round
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

  // check the number of dice in the game for current round
  if (dice == 1) {
    firstDice.src = 'img/dice-6.png';
    firstDice.style.visibility = 'visible';
    secondDice.style.visibility = 'hidden';

    // set the position to center
    firstDice.style.top = '20.5rem';
  } else {
    firstDice.src = 'img/dice-6.png';
    secondDice.src = 'img/dice-6.png';
    firstDice.style.visibility = 'visible';
    secondDice.style.visibility = 'visible';

    firstDice.style.top = '12.5rem';
    secondDice.style.top = '25.5rem';
  }
}

function roll() {
  // check if game has started
  if (!isGameOn) {
    alert('Please, start a new game');
    return;
  }

  // check how many dices are on the game
  if (dice == 1) {
    const roll = Math.floor(Math.random() * 6) + 1;

    firstDice.src = `img/dice-${roll}.png`;

    // if the number of dice is 1 and player rolls dice with number 1,
    // then switch player
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

    // if player rolls two dice with the same numbers,
    // then switch the player
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
  // check if game has started
  if (!isGameOn) {
    alert('Please, start a new game');
    return;
  }

  // check which player's turn currently
  if (active == 0) {
    // Add current score to the global score
    firstScore.textContent =
      Number(firstCurrentScore.textContent) + Number(firstScore.textContent);

    // check if player 1 has one, if yes, then increment his 'global score' by one
    if (Number(firstScore.textContent) >= goalScore) {
      document.getElementById('name-0').textContent = 'Winner!';
      document.getElementById('total-0').textContent = ++firstTotalScore;
      isGameOn = false;
    }
  } else {
    // Add current score to the global score
    secondScore.textContent =
      Number(secondCurrentScore.textContent) + Number(secondScore.textContent);

    // check if player 2 has one, if yes, then increment his 'global score' by one
    if (Number(secondScore.textContent) >= goalScore) {
      document.getElementById('name-1').textContent = 'Winner!';
      document.getElementById('total-1').textContent = ++secondTotalScore;
      isGameOn = false;
    }
  }

  // if there is no winner yet, then switch current player
  if (isGameOn) switchPlayer();
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
