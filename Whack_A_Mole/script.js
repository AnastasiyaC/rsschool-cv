const game = document.querySelector('.game');
const holes = document.querySelectorAll('.plaing-field__unit');
const scoreSpan = document.querySelector('.score__number');
const playingField = document.querySelector('.game__plaing-field');
const finalScore = document.querySelector('.helper__score');

let lastHole = null;
let {clickOnMole, timeUp} = false;
let score = 0;

const holesArray = Array.prototype.slice.call(holes);

function getRandomTime(minTime, maxTime) {
    return Math.round(Math.random() * (maxTime - minTime) + minTime);
};

function getRandomHole(array) {
    const index = Math.floor(Math.random() * array.length);
    const hole = array[index];

    if (hole === lastHole) {
      return getRandomHole(array);
    }
    lastHole = hole;
    return hole;
};

function showRandomMole() {
    const time = getRandomTime(400, 1000);
    const hole = getRandomHole(holes);

    hole.classList.add('plaing-field__unit--activated'); 
    
    setTimeout(() => {
        hole.classList.remove('plaing-field__unit--activated');
        if(!timeUp) {
            showRandomMole();
        }
    }, time);
};

function createScoreElement(elem) {
    const scorePoint = document.createElement('span');

    scorePoint.classList.add('unit__score');
    scorePoint.textContent = '+1';
    elem.parentNode.parentNode.appendChild(scorePoint); 
    setTimeout(() => scorePoint.remove(), 900);
};

function startGame() {
    showRandomMole();
    setTimeout(() => {
        timeUp = true;
        finishGame();
    }, 15000);
};

function finishGame() {
    if(timeUp) {
        game.classList.remove('game--started');
        game.classList.add('game--finished');
        finalScore.textContent = score > 0 ? `${score} points` : `${score} point`;
        score = 0;
        scoreSpan.textContent = score;
    }
};

document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if(clickedElement.classList.contains('game__button-start') && !game.classList.contains('game--started') && !game.classList.contains('game--finished')) {
        game.classList.add('game--started');
        startGame();
    }if(clickedElement.closest('.plaing-field__mole') && !clickOnMole) {
        score++;
        scoreSpan.textContent = score;
        createScoreElement(clickedElement);
    }if(clickedElement.classList.contains('helper__button')) {
        game.classList.remove('game--finished');
        timeUp = false;
    }
});
