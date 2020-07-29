let dice,
  roundScore,
  totalScore,
  activePlayer,
  starterPlayer,
  goalScore,
  isGameOn,
  previousDices;

init();

// Check if player has won the game
document.querySelector('.btn-hold').addEventListener('click', () => {
  if (isGameOn === true) {
    totalScore[activePlayer] += roundScore;

    if (totalScore[activePlayer] >= goalScore) {
      document
        .querySelector(`.player-${activePlayer}-panel`)
        .classList.add('winner');
      document
        .querySelector(`.player-${activePlayer}-panel`)
        .classList.remove('active');

      document.getElementById('dice-1').style.display = 'none';
      document.getElementById('dice-2').style.display = 'none';

      document.getElementById(`name-${activePlayer}`).textContent = 'Winner!';
      isGameOn = false;
    }
    nextPlayer();
  } else {
    alert(`Click the 'new game' button`);
  }
});

// Update the UI
document.querySelector('.btn-roll').addEventListener('click', () => {
  if (isGameOn == true) {
    // toss dices
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;

    document.getElementById('dice-1').src = `dice-${dice1}.png`;
    document.getElementById('dice-2').src = `dice-${dice2}.png`;

    console.log(previousDices);

    // if user tosses two times 6 dices then he losses his total points and player switches
    if (
      previousDices[0] === 6 &&
      dice1 === 6 &&
      previousDices[1] === 6 &&
      dice2 === 6
    ) {
      totalScore[activePlayer] = 0;
      console.log(`player ${activePlayer} loses his points`);
      nextPlayer();
    } else {
      // if player tosses two dice 1 then change current player
      if (dice1 === 1 && dice2 === 1) {
        nextPlayer();
      } else {
        roundScore += dice1 + dice2;
        document.getElementById(
          `current-${activePlayer}`
        ).textContent = roundScore;
      }
      previousDices = [dice1, dice2];
    }
  } else {
    alert(`Click the 'new game' button`);
  }
});

// Initialize a new game
document.querySelector('.btn-new').addEventListener('click', () => {
  init();
  goalScore = document.querySelector('.final-score').value;
  // check for input of final score
  if (!goalScore) {
    alert('Please, enter final score of the game');
    document.querySelector('.final-score').style.border = '2px solid red';
    isGameOn = false;
  } else if (isNaN(Number(goalScore))) {
    alert('Please, enter correct number for the final score of the game');
    document.querySelector('.final-score').style.border = '2px solid red';
    isGameOn = false;
  } else {
    goalScore = Number(goalScore);

    document.querySelector('.final-score').style.border = '2px solid #ccc';

    document.getElementById('dice-1').style.display = 'block';
    document.getElementById('dice-2').style.display = 'block';
    document.getElementById('dice-1').src = 'dice-6.png';
    document.getElementById('dice-2').src = 'dice-6.png';

    isGameOn = true;
  }
});

// change player

function nextPlayer() {
  // change active player
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');

  // set the total volue
  document.getElementById(`score-${activePlayer}`).textContent =
    totalScore[activePlayer];

  // set round score to 0
  document.getElementById(`current-${activePlayer}`).textContent = '0';

  // change player values
  activePlayer = activePlayer === 0 ? 1 : 0;
  roundScore = 0;
  previousDices = [0, 0];
}

// start a new game
function init() {
  roundScore = 0;
  totalScore = [0, 0]; // scores of both players
  goalScore = document.querySelector('.final-score').value;
  isGameOn = false;
  previousDices = [0, 0]; // to follow players previous tosses

  if (starterPlayer) {
    starterPlayer = starterPlayer === 0 ? 1 : 0;
  } else {
    starterPlayer = 0;
  }

  activePlayer = starterPlayer; // user must insert goal score to start the game

  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.remove('active');
  document.querySelector('.player-1-panel').classList.remove('active');

  document.getElementById('dice-1').style.display = 'none';
  document.getElementById('dice-2').style.display = 'none';

  document
    .querySelector(`.player-${starterPlayer}-panel`)
    .classList.add('active');
}
