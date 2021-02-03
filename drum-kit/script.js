const keyBoard = document.querySelector('.keyboard');

keyBoard.addEventListener('click', (e) => {
    const clickedElement = e.target;

    if(clickedElement.classList.contains('key')) {
        console.log('hello');
        clickedElement.childNodes.querySelector('.key__audio').play();
    }
});