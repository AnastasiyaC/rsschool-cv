const game = document.querySelector('.game');
const buttons = document.querySelector('.keyboard__buttons');
const keyboardInput = document.querySelector('.keyboard__input');
const score = document.querySelector('.score__number');
const lives = document.querySelectorAll('.lives__heart');
const answerSounds = document.querySelectorAll('.sounds__sound-short');
const wawesSound =document.querySelector('.sounds__sound-waves');
const settingButtons = document.querySelector('.game__setting');
const buttonFullscreen = document.querySelector('.button-fullscreen__icon');

const drops = document.querySelector('.playing-field__drops');
const waves = document.querySelectorAll('.wave');

const dropsArr = [];  // {element: this._dropElement, result: this._expressionResult, bonus: this._bonus, check: false,};
const mistakesNamber = 3;

let dropCounter = 0;
let mistakesCounter = 0;
let usersExpressionResult = null;  // entered user's answer
let points = 10;  // accrued number of points
let gameScore = 0;
let correctAnswer = false;


function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

class Drop {
    constructor(gameLevel) {
        this._gameLevel = gameLevel;
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
        drops.appendChild(this._createDrop());
        return {
            element: this._dropElement,
            result: this._expressionResult,
            bonus: this._bonus,
            check: false,
        };
    }
    _createDrop() {
        const drop = document.createElement('div');
        const expression = document.createElement('div');
        const operandOne = document.createElement('span');
        const operandTwo = document.createElement('span');
        const operator = document.createElement('span');

        this._createExpression();

        drop.classList.add('playing-field__drop', 'drop', 'drop--color_blue');
        drop.style.left = `${this._positionLeft}%`;
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
    // _moveDrop() {
    //     this._dropElement.classList.add('playing-field__drop--move-down');
    // }
    _getPositionLeft() {
        return this._getRandomNumber(5, 90);
    }
    _getRandomOperator() {
        const randomIndex = Math.floor(Math.random() * this._operators.length);
        const randomOperator = this._operators[randomIndex];
        return randomOperator;
    }
    _getRandomNumber(min = 1, max = 10) {
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
    createDrops();
    startWavesAnimation();
    playWavesSound();
}

// playGame();

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
    const drop = new Drop(1)
    const bonusDrop = new BonusDrop(1);
    const time = getRandomNumber(2000, 4000);

    if (dropCounter === 3) {
        dropsArr.push(bonusDrop.init());
        dropCounter = 0;
    } else {
        dropsArr.push(drop.init());
        dropCounter++;
    }

    let timerId = setTimeout(() => {
       createDrops();
    }, time);

    if (mistakesCounter === mistakesNamber) {
        clearTimeout(timerId);
    }
}

// createDrops();

function finishGame() {
    stopWavesAnimation();
    stopWavesSound();
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
        playSound('incorrect');
        minusLive(mistakesCounter);
   }
   
   updateScore(correctAnswer);
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
    dropEl.style.top = `${dropPos.top}px`;
}

function removeDropsWithBonus() { 
    dropsArr.map((drop) => {
        if (!drop.check) {
            const dropPos = drop.element.getBoundingClientRect();

            drop.element.classList.add('drop--burst_all');
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
        playAnswerSound('incorrect');
    }

    score.innerHTML = gameScore;
}

function minusLive(num) {
    Array.from(lives).map((item => {
        const checkNum = +item.dataset.count === num;
        
        if (checkNum) {
            item.classList.add('heart--minus');
        } else {
            return;
        } 
    }))
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