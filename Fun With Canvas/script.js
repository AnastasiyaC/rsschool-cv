const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const paintEditor = document.querySelector('.paint__editor');
const paintForm = document.querySelector('.paint__form');
const position = canvas.getBoundingClientRect();

const picture = {
    color: 'rgb(175, 45, 147)',
    width: 1,
    drawing: false,
};

const CHANGE_TYPE_TO_INPUTS_MAP = {
    pen: '<input type="range" class="form__input input-range" min="1" max="5" value="3" name="pen" step="1" data-property="width">',
    brush: '<input type="range" class="form__input input-range" min="6" max="30" value="6" name="brush" step="1" data-property="width">',
    palette: '<input type="color" class="form__input input-color" name="palette" value="#af2d93" data-property="color">',
    background: '<input type="color" class="form__input input-color input-background" name="background" value="#e0dae0" data-property="background">',
    eraser: '<input type="range" class="form__input input-range" min="3" max="30" value="3" name="eraser" step="1" data-property="width">',
};

canvas.width = (getComputedStyle(canvas.parentNode).width).slice(0, -2);
canvas.height = (getComputedStyle(canvas.parentNode).height).slice(0, -2);
ctx.lineCap = 'round';
ctx.lineCap = 'round';

paintEditor.addEventListener('click', (e) => {
    const clickedElement = e.target.closest('.paint__button');

    if(clickedElement) {                 
        paintEditor.querySelector('.paint__button--active').classList.remove('paint__button--active');
        clickedElement.classList.add('paint__button--active');  

        if(clickedElement.dataset.changeType) {
            const changeType = clickedElement.dataset.changeType;
            paintForm.classList.add('paint__form--opened');
            paintForm.innerHTML = CHANGE_TYPE_TO_INPUTS_MAP[changeType];
        }
    }else if(!clickedElement && !e.target.classList.contains('form__input')) {
        paintEditor.querySelector('.paint__form--opened').classList.remove('paint__form--opened');
    }
});

paintForm.addEventListener('change', (e) => {
    if(e.target.classList.contains('form__input')) {
        const propValue = e.target.value;
        const propName = e.target.dataset.property;

        changeProperty(propName, propValue);
        changeInputValue(e); 
    }
});

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', finish);

function changeProperty(propName, propValue) {
    if(propName == 'background') {
        canvas.parentNode.style.setProperty(`--${propName}`, propValue);
    }else 
        picture[propName] = propValue;
};

function changeInputValue(e) {
    const string = CHANGE_TYPE_TO_INPUTS_MAP[e.target.name];
    const substring = string.match(/value="([^ ]*)/gi)[0];
    const newSubstring = `value="${e.target.value}"`;
    const newString = string.replace(substring, newSubstring);

    CHANGE_TYPE_TO_INPUTS_MAP[e.target.name] = newString;
};

function start(e) {
    if(paintForm.classList.contains('paint__form--opened')) {
        paintForm.classList.remove('paint__form--opened');
    }
    picture.drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - position.left, e.clientY - position.top);

    e.preventDefault();
};

function draw(e) {
    if( picture.drawing === true) {
        ctx.strokeStyle = picture.color;
        ctx.lineWidth = picture.width;
        ctx.lineTo(e.clientX - position.left, e.clientY - position.top);
        ctx.stroke();     
    }
    e.preventDefault();
}

function finish(e) {
    if( picture.drawing === true) {
        ctx.stroke();
        ctx.closePath();
        picture.drawing = false;
    }
    e.preventDefault();
};

// function clear(e) {
//     if( picture.drawing === false) {
//         ctx.clearRect(e.clientX - position.left, e.clientY - position.top, e.target.value, e.target.value);
//     } 
// };

