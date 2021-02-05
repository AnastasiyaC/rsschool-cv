// const keyBoard = document.querySelector('.keyboard');

// document.body.addEventListener('click', (e) => {
//     const clickedElement = e.target;

//     if(clickedElement.classList.contains('keyboard__key')) {
//         console.log('hello');
//         clickedElement.querySelector('.key__audio').play();
//     }
// });


const keys = document.querySelectorAll('.keyboard__key');

keys.forEach(key => {
    key.addEventListener('click', () => {
        key.querySelector('.key__audio').play();
    })
});