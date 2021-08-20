const game = document.querySelector('.game');
const buttons = document.querySelector('.keyboard__buttons');
const keyboardInput = document.querySelector('.keyboard__input');
const score = document.querySelector('.score__number');
const lives = document.querySelectorAll('.lives__heart');
const answerSounds = document.querySelectorAll('.sounds__sound-short');
const wawesSound =document.querySelector('.sounds__sound-waves');


//buttons
const buttonFullscreen = document.querySelector('.button-fullscreen__icon');
const settingButtons = document.querySelector('.game__setting');
const buttonStart = document.querySelector('.window-start__button-start');
const buttonPlayAgain = document.querySelector('.window-end__button-start');
const buttonExit = document.querySelector('.window-end__button-exit');

const drops = document.querySelector('.playing-field__drops');
const waves = document.querySelectorAll('.wave');
const wavesContainer = document.querySelector('.playing-field__waves');

const dropsArr = [];  // {element: this._dropElement, result: this._expressionResult, bonus: this._bonus, check: false,};
// const mistakesNumber = 3;

const DEFAULT = {
    points: 10,
    mistakes: 3,
    speed: 15,
    level: 1,
    pointsToChangeLevel: 100,
    wavesStartLevet: 84,
}

let dropCounter = 0;
let randomBonusNumber = getRandomNumber(3, 10);;
let mistakesCounter = 0;
let usersExpressionResult = null;  // entered user's answer
let points = 10;  // accrued number of points
let gameScore = 0;
let correctAnswer = false;
let level = 1;
let dropSpeed = DEFAULT.speed;
let wavesLevel = DEFAULT.wavesStartLevet;


function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

class Drop {
    constructor(gameLevel, speed) {
        this._gameLevel = gameLevel;
        this._dropDownSpeed = speed;
        this._operators = ['+', '-', '×', '÷'];
        this._dropElement = null;
        this._expressionElement = null;
        this._positionLeft = this._getPositionLeft();
        this._operator = null;
        this._operandOne = null;
        this._operandTwo = null;
        this._expressionString = null;
        this._expressionResult = null;
        this._bonus = false;
    }
    init() {
        drops.appendChild(this._createDrop(this._dropDownSpeed));
        return {
            element: this._dropElement,
            result: this._expressionResult,
            bonus: this._bonus,
            check: false,
        };
    }
    _createDrop(speed) {
        const drop = document.createElement('div');
        const expression = document.createElement('div');
        const operandOne = document.createElement('span');
        const operandTwo = document.createElement('span');
        const operator = document.createElement('span');

        this._createExpression();

        drop.classList.add('playing-field__drop', 'drop', 'drop--color_blue');
        drop.style.left = `${this._positionLeft}%`;
        drop.style.animationDuration = `${speed}s`;
        expression.classList.add('drop__expression');
        operandOne.classList.add('drop__operand', 'drop__operand--position_first');
        operandOne.innerHTML = this._operandOne;
        operandTwo.classList.add('drop__operand', 'drop__operand--position_second');
        operandTwo.innerHTML = this._operandTwo;
        operator.classList.add('drop__operator');
        operator.innerHTML = this._operator;

        expression.appendChild(operandOne);
        expression.appendChild(operandTwo);
        expression.appendChild(operator);
        drop.appendChild(expression);

        this._dropElement = drop;
        this._expressionElement = expression;

        return drop;
    }
    _getPositionLeft() {
        return this._getRandomNumber(5, 90);
    }
    _getRandomOperator() {
        const randomIndex = Math.floor(Math.random() * this._operators.length);
        const randomOperator = this._operators[randomIndex];
        return randomOperator;
    }
    _getRandomNumber(min = 1, max = 10 * this._gameLevel) {
        // max = 10 * this._gameLevel;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    _createExpression() {
        const operator = this._getRandomOperator();
        let operandOne = this._getRandomNumber();
        let operandTwo = this._getRandomNumber();

        switch (operator) {
            case '+':
                this._operator = operator;
                this._operandOne = operandOne;
                this._operandTwo = operandTwo;
                this._expressionString = `${operandOne} + ${operandTwo}`;
                this._expressionResult = operandOne + operandTwo;
                break;
      
            case '-':
                this._operator = operator;
                if (operandOne >= operandTwo) {
                    this._operandOne = operandOne;
                    this._operandTwo = operandTwo;
                    this._expressionString = `${operandOne} - ${operandTwo}`;
                    this._expressionResult = operandOne - operandTwo;
                } else {
                    this._operandOne = operandTwo;
                    this._operandTwo = operandOne;
                    this._expressionString = `${operandTwo} - ${operandOne}`;
                    this._expressionResult = operandTwo - operandOne;
                }
                break;
      
            case '×':
                this._operator = operator;
                this._operandOne = operandOne;
                this._operandTwo = operandTwo;
                this._expressionString = `${operandOne} × ${operandTwo}`;
                this._expressionResult = operandOne * operandTwo;
                break;
      
            case '÷':
                do {
                    operandTwo = this._getRandomNumber();
                } while (operandOne % operandTwo !== 0);
                this._operator = operator;
                this._operandOne = operandOne;
                this._operandTwo = operandTwo;
                this._expressionString = `${operandOne} ÷ ${operandTwo}`;
                this._expressionResult = operandOne / operandTwo;
                break;
          }
    }
    getExpressionResult() {
        return this._expressionResult;
    }
}

class BonusDrop extends Drop {
    init() {
        super.init();
        this._dropElement.classList.remove('drop--color_blue');
        this._dropElement.classList.add('drop--color_bonus');
        this._bonus = true;
        return  {
            element: this._dropElement,
            result: this._expressionResult,
            bonus: this._bonus,
            check: false,
        };
    }
}

function playGame() {
    if (game.classList.contains('game--finish')) {
        game.classList.remove('game--finish');
    }
    if (game.classList.contains('game--start')) {
        game.classList.remove('game--start');
    }
    game.classList.add('game--play');
    resetGameScore();
    deleteDrops();
    resetLives();
    createDrops();
    startWavesAnimation();
    playWavesSound();
}

function resetGameScore() {
    dropCounter = 0;  //make drops counter and mistakes reset or make function for the future
    gameScore = 0;
    points = DEFAULT.points;
    mistakesCounter = 0;
    dropsArr.length = 0;
    score.innerHTML = gameScore;
    wavesContainer.style.top = `${DEFAULT.wavesStartLevet}%`;
}

// playGame();

function getRandomBonus() {
    randomBonusNumber = getRandomNumber(3, 10);
}

function startWavesAnimation() {
    Array.from(waves).map((wave) => {
        wave.style.animationPlayState = 'running';
    })
}

function stopWavesAnimation() {
    Array.from(waves).map((wave) => {
        wave.style.animationPlayState = 'paused';
    })
}

function createDrops() {
    const drop = new Drop(level, dropSpeed);
    const bonusDrop = new BonusDrop(level, dropSpeed);
    const time = getRandomNumber(2000, 4000);

    if (dropCounter === randomBonusNumber) {
        dropsArr.push(bonusDrop.init());
        dropCounter = 0;
        getRandomBonus();
    } else {
        dropsArr.push(drop.init());
        dropCounter++;
    }

    let timerId = setTimeout(() => {
       createDrops();
    }, time);

    if (mistakesCounter === DEFAULT.mistakes) {
        clearTimeout(timerId);  
    }
}

function stopDropsFall() {
    dropsArr.forEach(drop => {
        if(drop.check === false) {
            drop.element.style.animationPlayState = 'paused';
        }
    })
}

function deleteDrops() {
    while (drops.firstChild) {
        drops.firstChild.remove();
    }
}

// createDrops();

function finishGame() {
    game.classList.remove('game--play');
    game.classList.add('game--finish');
    stopWavesAnimation();
    stopWavesSound();
    stopDropsFall();
}

function checkUsersAnswer(value) {
    const targetDrop = dropsArr.find(i => i.result === value && !i.check);

    if (targetDrop && !targetDrop.bonus) {
        removeDrop(targetDrop);
    }
    if (targetDrop && targetDrop.bonus) {
        removeDrop(targetDrop);
        removeDropsWithBonus(); 
    }
    if (!targetDrop) {
        correctAnswer = false;
        mistakesCounter++;
        playAnswerSound('incorrect');
        minusLive(mistakesCounter);
        upWaves();
        if (mistakesCounter === DEFAULT.mistakes) {
            setTimeout(() => finishGame(), 1000); ;
        }
   }
   
   updateScore(correctAnswer);
}

function updateGameLevel() {
    if (gameScore / DEFAULT.pointsToChangeLevel >= level) {
        level++;
        dropSpeed -= 0.5;
    }
}

function removeDrop(dropEl) {
    correctAnswer = true;
    dropEl.check = true;
    removeDropWithCorrectAnswer(dropEl.element);
}

function removeDropWithCorrectAnswer(dropEl) {
    const dropPos = dropEl.getBoundingClientRect();

    dropEl.innerHTML = '<img src="./assets/icons/icon_check.png" class="drop__icon" alt="icon-check">';
    dropEl.classList.add('drop--burst');
    dropEl.style.animationDuration = '1s';
    dropEl.style.top = `${dropPos.top}px`;
}

function removeDropsWithBonus() { 
    dropsArr.map((drop) => {
        if (!drop.check) {
            const dropPos = drop.element.getBoundingClientRect();

            drop.element.classList.add('drop--burst_all');
            drop.element.style.animationDuration = '1s';
            drop.element.style.top = `${dropPos.top}px`;
            drop.check = true;
        }
        else {
            return;
        }
    })    
}

function updateScore(booleanResult) {
    if (booleanResult) {
        gameScore += points;
        points++;
        playAnswerSound('correct');
    } if (!booleanResult) {
        gameScore--;
        gameScore = gameScore < 0 ? 0 : gameScore;
        playAnswerSound('incorrect');
    }

    score.innerHTML = gameScore;
    updateGameLevel();
}

function minusLive(num) {
    Array.from(lives).map(item => {
        const checkNum = +item.dataset.count === num;
        
        if (checkNum) {
            item.classList.add('heart--minus');
        } else {
            return;
        } 
    })
}

function upWaves() {
    wavesLevel -= 10;
    wavesContainer.style.top = `${wavesLevel}%`;
}

function resetLives() {
    Array.from(lives).map((item) => {
        if (item.classList.contains('heart--minus')) {
            item.classList.remove('heart--minus')
        } else {
            return;
        }
    })
}

function playWavesSound() {
    wawesSound.currenttime = 0;
    wawesSound.play();

    wawesSound.addEventListener('ended', () => {
        wawesSound.currenttime = 0;
        wawesSound.play(); 
    })
}

function stopWavesSound() {
    wawesSound.pause();
}

function playAnswerSound(dataName) {
    const targetSound = Array.from(answerSounds).find(sound => sound.dataset.sound === dataName);

    targetSound.currenttime = 0;
    targetSound.play(); 
}

buttons.addEventListener('click', (event) => {
    if (event.target.classList.contains('keyboard__button-number')) {
        keyboardInput.value += event.target.textContent;
    } if (event.target.classList.contains('keyboard__button-operation')) {
        if (event.target.textContent == 'delete') {
            keyboardInput.value = keyboardInput.value.substring(0, keyboardInput.value.length - 1);
        } if (event.target.textContent == 'clear') {
            keyboardInput.value = '';
        } if (event.target.textContent == 'enter') {
            if (keyboardInput.value.length > 0) {
                usersExpressionResult = +keyboardInput.value;
                checkUsersAnswer(usersExpressionResult);
                keyboardInput.value = '';
            } else {
                return;
            }
        }
    }
})

function toggleFullscreen() {
    if (!game.fullscreenElement) {
        game.requestFullscreen();
    } if (document.exitFullscreen) {
        document.exitFullscreen();
    };
}

function changeVolume() {

}

settingButtons.addEventListener('click', (event) => {
    if (event.target.closest('.button-fullscreen')) {
        toggleFullscreen();
    } if (event.target.closest('.button-sound')) {
        console.log('sound');
    } 
})

buttonStart.addEventListener('click', playGame);

buttonPlayAgain.addEventListener('click', playGame);

function exit() {
    game.classList.remove('game--finish')
    game.classList.add('game--start');
}

buttonExit.addEventListener('click', exit);