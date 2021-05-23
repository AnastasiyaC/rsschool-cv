const keyBoard = document.querySelector('.keyboard');
const audio = document.querySelectorAll('.key__audio');

keyBoard.addEventListener('click', (event) => {
    const clickedElement = event.target;
    const button = clickedElement.closest('.keyboard__key');

    if (button) {
        const buttonName = button.dataset.name;

        playAudio(buttonName);
    }
});

function playAudio(buttonName) {
    audio.forEach(audioSound => {
        if (audioSound.dataset.name == buttonName) {
            audioSound.play();
        };
    })
};

document.addEventListener('keydown', (event) => {
    const buttonName = event.code.slice(3).toLocaleLowerCase();

    if (event.code) {
       playAudio(buttonName);
    }
});

