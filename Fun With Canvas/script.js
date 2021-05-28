const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const paintEditor = document.querySelector('.paint__editor');
const position = canvas.getBoundingClientRect();
const paintForm = document.querySelector('.paint__form');
const lineWidth = document.querySelector('.line-width__round');

const picture = {
    color: 'rgb(175, 45, 147)',
    width: 3,
    drawing: false,
};

const canvasMousePosition = {
    x: null,
    y: null,
}

const CHANGE_TYPE_TO_INPUTS_MAP = {
    pen: '<input type="range" class="form__input input-range" min="1" max="5" value="3" name="pen" step="1" data-property="width">',
    brush: '<input type="range" class="form__input input-range" min="6" max="30" value="6" name="brush" step="1" data-property="width">',
    palette: '<input type="color" class="form__input input-color" name="palette" value="#af2d93" data-property="color">',
    background: '<input type="color" class="form__input input-color input-background" name="background" value="#e0dae0" data-property="background">',
    eraser: '<input type="range" class="form__input input-range" min="3" max="30" value="3" name="eraser" step="1" data-property="heigth">',
};

canvas.width = (getComputedStyle(canvas.parentNode).width).slice(0, -2);
canvas.height = (getComputedStyle(canvas.parentNode).height).slice(0, -2);
ctx.lineCap = 'round';
ctx.lineCap = 'round';

let buttonName = null;
let eraserValue = null;  

paintEditor.addEventListener('click', (event) => {
    const clickedElement = event.target.closest('.paint__button');
    
    if(clickedElement) {   
        const changeType = clickedElement.dataset.changeType;

        paintEditor.querySelector('.paint__button--active').classList.remove('paint__button--active');
        clickedElement.classList.add('paint__button--active');  
        paintEditor.classList.add('paint__editor--opened');
        paintForm.innerHTML = CHANGE_TYPE_TO_INPUTS_MAP[changeType];
        buttonName = changeType;
        picture.width = paintForm.elements[0].value.length <= 2 ? paintForm.elements[0].value : picture.width;
        eraserValue = picture.width;
        lineWidth.style.width = `${paintForm.elements[0].value}px`;
        lineWidth.style.height = `${paintForm.elements[0].value}px`;
    }if (!clickedElement && !event.target.classList.contains('form__input')) {
        if (paintEditor.classList.contains('paint__editor--opened')) {
            paintEditor.classList.remove('paint__editor--opened');
        } else {
            return;
        }
    }
});

paintForm.addEventListener('change', (event) => {
    if (event.target.classList.contains('form__input')) {
        const propValue = event.target.value;
        const propName = event.target.dataset.property;

        buttonName == 'eraser' ? eraserValue = propValue : changeProperty(propName, propValue);
        changeInputValue(event); 
    }
});

paintForm.addEventListener('mousemove', (event) => {
    const value = event.target.value;

    lineWidth.style.width = `${value}px`;
    lineWidth.style.height = `${value}px`;
});

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', finish);

function changeProperty(propName, propValue) {
    if (propName == 'background') {
        canvas.parentNode.style.setProperty(`--${propName}`, propValue);
    }if (propName == 'eraser') {
        eraserValue = propValue;
    }else {
        picture[propName] = propValue;
    }  
};

function changeInputValue(event) {
    const string = CHANGE_TYPE_TO_INPUTS_MAP[event.target.name];
    const substring = string.match(/value="([^ ]*)/gi);
    const newSubstring = `value="${event.target.value}"`;
    const newString = string.replace(substring, newSubstring);

    CHANGE_TYPE_TO_INPUTS_MAP[event.target.name] = newString;
};

function start(event) {
    event.preventDefault();
    if (paintEditor.classList.contains('paint__editor--opened')) {
        paintEditor.classList.remove('paint__editor--opened');
    }
        picture.drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.pageX - position.x, event.pageY - position.y);
};

function draw(event) {
    event.preventDefault();
    if (!picture.drawing) {
        return;
    }if (picture.drawing) {
        if (buttonName == 'eraser') {
            clear(event);
        }else {
            drawLine(event);
        }
    }  
};

function drawLine(event) {
    ctx.strokeStyle = picture.color;
    ctx.lineWidth = picture.width;
    ctx.lineTo(event.pageX - position.x, event.pageY - position.y);
    ctx.stroke();  
}

function finish(event) {
    event.preventDefault();
    if (picture.drawing) {
        ctx.stroke();
        ctx.closePath();
        picture.drawing = false;
    } 
};

function clear(event) {
    ctx.clearRect(event.clientX - position.x - (eraserValue / 2), event.clientY - position.y - (eraserValue / 2), eraserValue, eraserValue);
};

