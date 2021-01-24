const numberBtns = document.querySelectorAll('.number'),
    operationBtns = document.querySelectorAll('.operation'),
    clearBtn = document.querySelector('.clear'),
    backspaceBtn = document.querySelector('.backspace'),
    resultBtn = document.querySelector('.result'),
    displayPrevious = document.querySelector('.display-previous'),
    displayCurrent = document.querySelector('.display-current');

let previousValue = '';  
let currentValue = '';  
let result = null;
let lastOperation = '';
let haveDot = false;
let memory = '';

numberBtns.forEach( number => {
    number.addEventListener('click', (e)=> {
        e.preventDefault();
        if(e.target.innerText === '.' && !haveDot) {
            haveDot = true;
        } else if(e.target.innerText ==='.' && haveDot) {
            return;
        }
        currentValue += e.currentTarget.value;
        displayCurrent.value = currentValue;
    })
})

operationBtns.forEach(operation => {
    operation.addEventListener('click', (e)=> {
        e.preventDefault();
        if (!currentValue) result;
        haveDot = false;
        const operationName = e.target.innerText;
        if (previousValue && currentValue && lastOperation) {
            mathOperation();
        }else {
           result = parseFloat(currentValue);
        };
        removeVariable(operationName);
        lastOperation = operationName;
        console.log(result);
    })
})

function removeVariable (name = '') {
    previousValue += currentValue + ' ' + name + ' ';
    displayPrevious.value = previousValue;
    displayCurrent.value = '';
    currentValue = '';
    memory.value = result;
}

function mathOperation() {
    if(lastOperation === '×') {
        result = parseFloat(result) * parseFloat(currentValue);
    } else if(lastOperation === '+') {
        result = parseFloat(result) + parseFloat(currentValue);
    } else if(lastOperation === '-') {
        result = parseFloat(result) - parseFloat(currentValue);
    } else if(lastOperation === '÷') {
        result = parseFloat(result) / parseFloat(currentValue);
    }
}

resultBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(!previousValue || !currentValue) return;
    haveDot = false;
    mathOperation();
    removeVariable();
    displayCurrent.value = result;
    memory.value = '';
    currentValue = result;
    previousValue = '';
})

clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    displayCurrent.value = '';
    displayPrevious.value = '';
    currentValue = '';
    previousValue = '';
    memory.value = '';
})

backspaceBtn.addEventListener('click', (e) => {
    e.preventDefault();
        currentValue = currentValue.slice(0, -1);
        displayCurrent.value = currentValue;
        console.log(currentValue);
})

