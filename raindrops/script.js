const buttons = document.querySelector('.keyboard__buttons');
const keyboardInput = document.querySelector('.keyboard__input');
const score = document.querySelector('.score__number');

// const firstOperand = document.querySelector('.drop__operand--position_first');
// const secondOperand = document.querySelector('.drop__operand--position_second');
// const operation = document.querySelector('.drop__operator');

const drops = document.querySelector('.playing-field__drops');

let timeUp = false;
let expressionResult = [];
let playerExpressionResult = null;



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
    }
    init() {
        drops.appendChild(this._createDrop());
        return this._dropElement;
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
    _moveDrop() {
        this._dropElement.classList.add('playing-field__drop--active');
    }
    _getPositionLeft() {
        return this._getRandomNumber(10, 90);
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
    init () {
        super.init();
        this._dropElement.classList.remove('drop--color_blue');
        this._dropElement.classList.add('drop--color_bonus');
    }
}

function createDrops(level) {
    const time = getRandomNumber(2000, 3000);
    const drop = new Drop(level);

    drop.init();
    expressionResult = drop.getExpressionResult();
    console.log(expressionResult);

    setTimeout(() => {
        if (!timeUp) {
            createDrops();
        }  
    }, time);
}

function startLevel() {
    createDrops();
    setTimeout(() => {
        timeUp = true;
    }, 15000);
}

// startLevel();

class Game {
    gameLevel = 1;
    gameScore = 0;
    dropsCount = 0;
    bonusDrop = false;
    dropElements = [];
    expressionResults = [];
    usersExpressionResult = null;
    wrongExpressionResult = 0;
    timeUp = false;

    constructor() {
        this._gameLevel = 1;
    }

    playGame() {
        this.createDrop();
        setTimeout(() => {
            this.timeUp = true;
        }, 25000);
    }

    createDrop() {
        const time = getRandomNumber(4000, 5000);
        const drop = new Drop(1);
        const bonusDrop = new BonusDrop(1);
    
        
        this.dropsCount += 1;

        if (this.dropsCount == 5) {
            this.dropElements.push(bonusDrop.init());
            this.expressionResults.push(bonusDrop.getExpressionResult());
        } else {
            drop.init();
            this.dropElements.push(drop.init());
            this.expressionResults.push(drop.getExpressionResult());
        }
        
        console.log(this.expressionResults);
        console.log(this.dropElements)
        console.log(this.dropsCount)
    
        setTimeout(() => {
            if (!this.timeUp) {
                this.createDrop();
            }  
        }, time);
    }
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
            playerExpressionResult = +keyboardInput.value;
            console.log(playerExpressionResult);
            if (playerExpressionResult === expressionResult) {
                score.textContent = +score.textContent + 1;   
            }
            keyboardInput.value = '';
        }
    }
})