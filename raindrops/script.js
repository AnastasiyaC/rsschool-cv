const game = document.querySelector('.game');
const drops = document.querySelector('.playing-field__drops');
const keyboardButtonsContainer = document.querySelector('.keyboard__buttons');
const keyboardInput = document.querySelector('.keyboard__input');
const score = document.querySelector('.score__number');
const lives = document.querySelectorAll('.lives__heart');
const wavesContainer = document.querySelector('.playing-field__waves');
const waves = document.querySelectorAll('.wave');
const wawesSound =document.querySelector('.sounds__sound-waves');
const answerSounds = document.querySelectorAll('.sounds__sound-short');
const finalScore = document.querySelector('.window-end__score-number');
const gameOver = document.querySelector('.game__game-over');

//buttons
const buttonMuteAudio = document.querySelector('.button-sound');
const buttonMuteAudioIcon = document.querySelector('.button-sound__icon');
const settingButtons = document.querySelector('.game__setting');
const keyboardButtons = document.querySelectorAll('.keyboard__button');
const windowStartButtons = document.querySelector('.window-start__buttons');
const windowEndButtons = document.querySelector('.window-end__buttons');

const DEFAULT = {
    level: 1,
    points: 10,
    mistakes: 3,
    speed: 15,
    tutorialBonus: 3,
    pointsToChangeLevel: 100,
    wavesLevel: 85,
    wavesLevelUp: 7,
    maxInputLength: 8,
}

const dropsArr = [];  // {element: this._dropElement, result: this._expressionResult, bonus: this._bonus, check: false,};
let [gameLevel, points, dropSpeed, wavesLevel] = [DEFAULT.level, DEFAULT.points, DEFAULT.speed, DEFAULT.wavesLevel];
let soundVolume = 1;
let dropCounter = 0;
let mistakesCounter = 0;
let usersExpressionResult = null;
let gameScore = 0;
let correctAnswer = false;
let randomBonusNumber = getRandomNumber(3, 10);
let gameStarted = false;
let tutorialStarted = false;
let gameMode = null;

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

class Drop {
    constructor(level, speed) {
        this._gameLevel = level;
        this._dropDownSpeed = speed;
        this._operators = ['+', '-', '×', '÷'];
        this._dropElement = null;
        this._expressionElement = null;
        this._positionLeft = this._getPositionLeft();
        this._operator = null;
        this._operandOne = null;
        this._operandTwo = null;
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
        drop.style.animationDuration = `${this._dropDownSpeed}s`;
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
        return this._getRandomNumber(10, 90);
    }
    _getRandomOperator() {
        const randomIndex = Math.floor(Math.random() * this._operators.length);
        const randomOperator = this._operators[randomIndex];
        return randomOperator;
    }
    _getRandomNumber(min = 1, max = 10 * this._gameLevel) {
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
                this._expressionResult = operandOne + operandTwo;
                break;
      
            case '-':
                this._operator = operator;
                if (operandOne >= operandTwo) {
                    this._operandOne = operandOne;
                    this._operandTwo = operandTwo;
                    this._expressionResult = operandOne - operandTwo;
                } else {
                    this._operandOne = operandTwo;
                    this._operandTwo = operandOne;
                    this._expressionResult = operandTwo - operandOne;
                }
                break;
      
            case '×':
                this._operator = operator;
                this._operandOne = operandOne;
                this._operandTwo = operandTwo;
                this._expressionResult = operandOne * operandTwo;
                break;
      
            case '÷':
                do {
                    operandTwo = this._getRandomNumber();
                } while (operandOne % operandTwo !== 0);
                this._operator = operator;
                this._operandOne = operandOne;
                this._operandTwo = operandTwo;
                this._expressionResult = operandOne / operandTwo;
                break;
          }
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

function playGame(mode) {
    gameMode = mode;
    setGameParameters();
    addGamePlayClass();
    startOrStopWavesAnimation('start');
    playWavesSound();
    [gameStarted, tutorialStarted] = gameMode === 'game' ? [true, false] : [false, true];
    createDrops(gameMode);
}

function addGamePlayClass() {
    if (game.classList.contains('game--finish')) {
        game.classList.remove('game--finish');
    }
    if (game.classList.contains('game--start')) {
        game.classList.remove('game--start');
    }
    
    game.classList.add('game--play');
}

function setGameParameters() {
    dropsArr.length = 0;
    [gameLevel, points, dropSpeed, wavesLevel] = [DEFAULT.level, DEFAULT.points, DEFAULT.speed, DEFAULT.wavesLevel];
    dropCounter = 0;
    gameScore = 0;
    mistakesCounter = 0;
    score.innerHTML = gameScore;
    wavesContainer.style.top = `${wavesLevel}%`;
    keyboardInput.value = '';
    resetLives();
    deleteDrops();
}

function createDrops(mode) {
    const drop = new Drop(gameLevel, dropSpeed);
    const bonusDrop = new BonusDrop(gameLevel, dropSpeed);
    const time = 2000;
    const isGameOver = mistakesCounter === DEFAULT.mistakes;
    let dropObject = null;

    if (mode === 'game') {
        const isBonus = dropCounter === randomBonusNumber;

        if (isBonus && !isGameOver) {
            dropsArr.push(bonusDrop.init());
            dropCounter = 0;
            getRandomBonus();
        } 
        if (!isBonus && !isGameOver) {
            dropsArr.push(drop.init());
            dropCounter++;
        }
    }
    if (mode === 'tutorial') {
        const isBonus = dropCounter === DEFAULT.tutorialBonus;

        if (isBonus && !isGameOver) {
            dropsArr.push(bonusDrop.init());
        }
        if (!isBonus && !isGameOver) {
            dropsArr.push(drop.init());   
        }
        dropCounter++;
        instruction(dropsArr, dropCounter);
    }

    dropObject = dropsArr[dropsArr.length - 1] || dropsArr.first();
    checkDropPosition(dropObject);

    let timerId = setTimeout(() => {
        createDrops(mode);
     }, time);

    if (isGameOver) {
        clearTimeout(timerId);  
        // finishGame();
    }
}

function getRandomBonus() {
    randomBonusNumber = getRandomNumber(3, 10);
}

function checkDropPosition(dropObj) {
    const dropEl = dropObj.element;
    const wawesPos = wavesContainer.getBoundingClientRect();
    const wawesPosTop = wawesPos.top;
    const dropPos = dropEl.getBoundingClientRect();
    const dropPosBottom = dropPos.bottom;

    let timer = setTimeout(() => {
        checkDropPosition(dropObj);
    }, 500);

    if (gameStarted || tutorialStarted) {
        if (dropObj.check) {
            clearTimeout(timer);
        }
        if (!dropObj.check && dropPosBottom >= wawesPosTop) {
            removeDropWithWaves(dropEl);
            dropObj.check = true;
            setMistake();
            updateScore(correctAnswer);
            
            if (mistakesCounter === DEFAULT.mistakes) {
                clearTimeout(timer);
                showGameOver();
            }
        }
    } if (!gameStarted && !tutorialStarted) {
        clearTimeout(timer);
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

function showGameOver() {
    stopDropsFall();
    gameOver.style.display = 'block';
    [gameStarted, tutorialStarted] = [false, false];
    setTimeout(() => {
        gameOver.style.display = 'none';
        game.classList.remove('game--play');
        startOrStopWavesAnimation('stop');
        stopWavesSound();
        if (gameMode === 'game') {
            showFinalScore();
        }
        if (gameMode === 'tutorial') {
            game.classList.add('game--start'); 
        }
        
    }, 3000);   
}

function showFinalScore() {
    const topScores = new TopScore(gameScore);

    game.classList.add('game--finish'); 
    finalScore.innerHTML = gameScore;
    topScores.checkHighScore(gameScore);
}

function exitGame() {
    game.classList.remove('game--finish')
    game.classList.add('game--start');
}

function checkUsersAnswer(value) {
    const targetDrop = dropsArr.find(i => i.result === value && !i.check);

    if (targetDrop && !targetDrop.bonus) {
        setCorrectAnswer(targetDrop);
    }
    if (targetDrop && targetDrop.bonus) {
        setCorrectAnswer(targetDrop, true);
    }
    if (!targetDrop) {
        setMistake();
        if (mistakesCounter === DEFAULT.mistakes) {
            showGameOver();
        }
    }
   updateScore(correctAnswer);
}

function removeDropWithCorrectAnswer(dropEl) {
    const dropPos = dropEl.getBoundingClientRect();

    dropEl.innerHTML = '<img src="./assets/icons/icon_check.png" class="drop__icon" alt="icon-check">';
    dropEl.classList.add('drop--burst_green');
    dropEl.style.animationDuration = '1s';
    dropEl.style.top = `${dropPos.top}px`;
    playAnswerSound('correct');
}

function removeAllDropsWithBonus() { 
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

function removeDropWithWaves(dropEl) {
    const dropPos = dropEl.getBoundingClientRect();

    dropEl.innerHTML = '<img src="./assets/icons/icon_mistake.png" class="drop__icon" alt="icon_mistake">';
    dropEl.classList.add('drop--burst_red');
    dropEl.style.animationDuration = '1s';
    dropEl.style.top = `${dropPos.top}px`;
}

function setCorrectAnswer(dropEl, isBonus = false) {
    const drop = dropEl;

    correctAnswer = true;
    drop.check = true;
    removeDropWithCorrectAnswer(drop.element);
    if (isBonus) {
        removeAllDropsWithBonus(); 
    }
}

function setMistake() {
    correctAnswer = false;
    mistakesCounter++;
    minusLive(mistakesCounter);
    playAnswerSound('incorrect');
    upWaves();
}

function updateScore(booleanResult) {
    if (booleanResult) {
        gameScore += points;
        points++;
    } if (!booleanResult) {
        gameScore--;
        gameScore = gameScore < 0 ? 0 : gameScore; 
    }

    score.innerHTML = gameScore;
    updateGameLevel();
}

function updateGameLevel() {
    if (gameScore / DEFAULT.pointsToChangeLevel >= gameLevel) {
        gameLevel++;
        dropSpeed -= 0.5;
    }
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

function resetLives() {
    Array.from(lives).map((item) => {
        if (item.classList.contains('heart--minus')) {
            item.classList.remove('heart--minus')
        } else {
            return;
        }
    })
}

function startOrStopWavesAnimation(string) {
    const start = 'running';
    const stop = 'paused';
    const action = string == 'start' ? start : stop;

    Array.from(waves).map((wave) => {
        wave.style.animationPlayState = action;
    })
}

function upWaves() {
    wavesLevel -= DEFAULT.wavesLevelUp;
    wavesContainer.style.top = `${wavesLevel}%`;
}

function playWavesSound() {
    const playSound = () => {
        wawesSound.currenttime = 0;
        wawesSound.play();
    }

    playSound();
    wawesSound.addEventListener('ended', playSound);
}

function stopWavesSound() {
    wawesSound.pause();
}

function playAnswerSound(dataName) {
    const targetSound = Array.from(answerSounds).find(sound => sound.dataset.sound === dataName);

    if ( !targetSound.paused ) {
        targetSound.pause();   
    }
    targetSound.currentTime = 0;
    targetSound.muted = wawesSound.muted ? true : false;
    targetSound.play(); 
}

function muteAudio() {
    if (!wawesSound.muted) {
        wawesSound.muted = true;
        buttonMuteAudioIcon.setAttribute('src', './assets/icons/icon_sound_on.png');
        buttonMuteAudio.classList.remove('button-sound--unmuted');
        buttonMuteAudio.classList.add('button-sound--muted');
    } else {
        wawesSound.muted = false;
        buttonMuteAudioIcon.setAttribute('src', './assets/icons/icon_sound_off.png');
        buttonMuteAudio.classList.remove('button-sound--muted');
        buttonMuteAudio.classList.add('button-sound--unmuted');
    }
}

function toggleFullscreen() {
    if (!game.fullscreenElement) {
        game.requestFullscreen();
    } if (document.exitFullscreen) {
        document.exitFullscreen();
    };
}

class TopScore {
    constructor(score) {
        this._score = score;
        this._numOfHighScores = 5;
        this._nameHighScores = 'highScores';
        this._highScores = [];
        this._lowestScore = null;
        this._highScoresList = document.querySelector('.score-best__list');
    }
    checkHighScore(score) {
        this._highScores = JSON.parse(localStorage.getItem(this._nameHighScores)) ?? [];
        this._lowestScore = this._highScores[this._numOfHighScores - 1]?.score ?? 0;
        
        if (score > this._lowestScore) {
          this._saveHighScore(this._score, this._highScores);  
        };
        this._showHighScores(); 
    }
    _saveHighScore(score, highScores) {
        const d = new Date();
        const date = this._formateDate(d);
        const newScore = { score, date };
    
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score).splice(this._numOfHighScores);
        localStorage.setItem(this._nameHighScores, JSON.stringify(highScores));
    }
    _showHighScores() {
        const fragment = document.createDocumentFragment();
        
        this._clearScoresList(this._highScoresList);
        this._highScores.map((item) => {
            const liElement = document.createElement('li');
    
            liElement.classList.add('score-best__item');
            liElement.innerHTML = `<span class="score-best__score">${item.score}</span>
            <span class="score-best__date">${item.date}</span>`;
            fragment.appendChild(liElement);
        });
    
        this._highScoresList.appendChild(fragment);
    }
    _clearScoresList(list) {
        while (list.firstChild) {
            list.firstChild.remove();
        }
    }
    _formateDate(date) {
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const yy = date.getFullYear();
    
        return `${this._addZero(dd)}/${this._addZero(mm)}/${this._addZero(yy)}`;
    }
    _addZero(num) {
        return num < 10 ? `0${num}` : num;
    }
}

function clickKeyboardButtons(event) {
    const clickedKey = event.target;
    const clickedOperationKey = clickedKey.dataset.name;

    if (clickedKey.classList.contains('keyboard__button-number')) {
        keyboardInput.value = gameStarted ? keyboardInput.value + clickedKey.textContent : '';
        checkInputLength();
    } 
    if (clickedKey.classList.contains('keyboard__button-operation')) {
        if (clickedOperationKey == 'Backspace') {
            keyboardInput.value = keyboardInput.value.substring(0, keyboardInput.value.length - 1);
        } if (clickedOperationKey == 'Delete') {
            keyboardInput.value = '';
        } if (clickedOperationKey == 'Enter') {
            enterUsersAnswer();
        }
    }
}

function enterUsersAnswer() {
    if (keyboardInput.value.length > 0) {
        usersExpressionResult = +keyboardInput.value;
        checkUsersAnswer(usersExpressionResult);
        keyboardInput.value = '';
    } else {
        return;
    }
}

function checkKey(key, event) {
    if (key >= '0' && key <= '9' && gameStarted) {
        keyboardInput.value = gameStarted ? keyboardInput.value + event.key : '';
        checkInputLength();
        toggleKeyClass('number', event);
    }
    if (key == 'Backspace') {
        keyboardInput.value = keyboardInput.value.substring(0, keyboardInput.value.length - 1);
        toggleKeyClass('clear', event);
    }
    if (key == 'Delete') {
        keyboardInput.value = '';
        toggleKeyClass('clear', event);
    }
    if (key == 'Enter') {
        enterUsersAnswer();
        toggleKeyClass('enter', event);
    }
}

function toggleKeyClass(name, event) {
    Array.from(keyboardButtons).map((button) => {
        if (button.dataset.name === event.key) {
            button.classList.toggle(`keyboard__button--active_${name}`);
        }
    })
}

function removeButtonClass(name, event) {
    Array.from(keyboardButtons).map((button) => {
        if (button.dataset.name === event.key) {
            button.classList.remove(`keyboard__button--active_${name}`);
        }
    })
}

function keyUp(key, event) {
    if (key >= '0' && key <= '9') {
        removeButtonClass('number', event);
    }
    if (key == 'Backspace') {
        removeButtonClass('clear', event);
    }
    if (key == 'Delete') {
        removeButtonClass('clear', event);
    }
    if (key == 'Enter') {
        removeButtonClass('enter', event);  
    }
}

function checkInputLength() {
    const maxLength = DEFAULT.maxInputLength;

    if (keyboardInput.value.length > maxLength) {
        keyboardInput.value = keyboardInput.value.substring(0, maxLength);
    }
}

function instruction(drops, counter) {
    const i = counter;
    const drop = drops[i - 1];
    
        switch (i) {
            case 1:
                imitateCorrectAnswer(drop, 3000);
                break;

            case 3:
                imitateCorrectAnswer(drop, 2500);
                break;

            case 4:
                imitateCorrectAnswer(drop, 4500, true);
                break;

            case 7:
                imitateMistake(drop, 3500);
                break;

            case 8:
                imitateCorrectAnswer(drop, 4000);
                break;

            case 11:
                imitateCorrectAnswer(drop, 2000);
                break;

            default:
                return;
        }
}

function imitateCorrectAnswer(dropEl, time, isBonus = false) {
    const targetDrop = dropEl;
    
    setTimeout(() => {
        let promise = imitateKeyPress(targetDrop.result);

        promise.then(() => {
            imitateEnterPress();
            removeDropWithCorrectAnswer(targetDrop.element);
            targetDrop.check = true;
            updateScore(true);
            if (isBonus) {
                removeAllDropsWithBonus();
            }
        })
    }, time)
}

function imitateMistake(dropEl, time) {
    const targetDrop = dropEl; 

    setTimeout(() => {
        let promise = imitateKeyPress(targetDrop.result + 1);

        promise.then(() => {
            imitateEnterPress();
            setMistake();
            updateScore(false);
        })
    }, time);
}

function imitateKeyPress(num, index = 0) {
    const strFromNum = String(num);

    return new Promise((resolve, reject) => {
        if(index === strFromNum.length) {
            resolve();
        } else {
            Array.from(keyboardButtons).find((button) => {
                if (button.dataset.name == strFromNum[index]) {
                    button.classList.toggle('keyboard__button--active_number');
                    keyboardInput.value += strFromNum[index];
                    setTimeout(() => button.classList.remove('keyboard__button--active_number'), 400)
                    setTimeout(() => resolve(imitateKeyPress(num, index + 1)), 700)
                }
            })
        } 
    })    
}

function imitateEnterPress() {
    Array.from(keyboardButtons).find((button) => {
        if (button.dataset.name == "Enter") {
            button.classList.toggle('keyboard__button--active_enter');
            keyboardInput.value = '';
            setTimeout(() => button.classList.remove('keyboard__button--active_enter'), 400);
        }
    })
}

keyboardButtonsContainer.addEventListener('click', clickKeyboardButtons);
document.addEventListener('keydown', (event) => checkKey(event.key, event));
document.addEventListener('keyup', (event) => keyUp(event.key, event));

settingButtons.addEventListener('click', (event) => {
    if (event.target.closest('.button-fullscreen')) {
        toggleFullscreen();
    } if (event.target.closest('.button-sound')) {
        muteAudio();
    } 
})

windowStartButtons.addEventListener('click', (event) => playGame(event.target.dataset.mode));

windowEndButtons.addEventListener('click', (event) => {
    const clickedButtonMode = event.target.dataset.mode;

    if (clickedButtonMode) {
        playGame(clickedButtonMode);
    } else {
        exitGame();
    }
})