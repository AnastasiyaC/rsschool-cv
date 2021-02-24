const keyBoard = document.querySelector('.keyboard');
const audio = document.querySelectorAll('.key__audio');

keyBoard.addEventListener('click', (e) => {
    const clickedElement = e.target;
    const button = clickedElement.closest('.keyboard__key');

    if(button) {
        const buttonName = button.dataset.name;
        playAudio(buttonName);
    }
});

function playAudio(buttonName) {
    audio.forEach(audioSound => {
        if(audioSound.dataset.name == buttonName) {
            audioSound.play();
        };
    })
};

document.addEventListener('keydown', (e) => {
    const buttonName = e.code.slice(3).toLocaleLowerCase();

    if(e.code) {
       playAudio(buttonName);
    }
});

