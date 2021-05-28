const video = document.querySelector('.video');
const inputSpeed = document.querySelector('.form__input');
const speedValue = document.querySelector('.form__input-value');

let inputClick = false;

setValue = () => {
    newValue = +(inputSpeed.value - inputSpeed.min) * 100 / (inputSpeed.max - inputSpeed.min);
    newPosition = 15 - (newValue * 0.2);
    speedValue.innerHTML = `<span class="speed-value">${inputSpeed.value}</span>`;
    speedValue.style.left = `calc(${newValue}% + (${newPosition}px))`;
}

document.addEventListener('DOMContentLoaded', setValue);

inputSpeed.addEventListener('change', (event) => {
    video.playbackRate = event.target.value;
    setValue();
});

inputSpeed.addEventListener('mousedown', () => {
    inputClick = true;
})

inputSpeed.addEventListener('mousemove', () => {
    inputClick && setValue();
})

inputSpeed.addEventListener('mouseout', () => {
    inputClick = false;
})