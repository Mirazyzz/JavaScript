'use strict';

// global variables
const firstScore = document.getElementById('score--0');
const secondScore = document.getElementById('score--1');
const diceElement = document.querySelector('.dice');

firstScore.textContent = '0';
secondScore.textContent = '0';
diceElement.classList.add('hidden');
