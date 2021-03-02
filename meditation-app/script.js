const mainPage = document.querySelector('.page');

document.addEventListener('click', (e) => {
    if(e.target.closest('.navigation__item')) {
        console.log('hello');
        mainPage.classList.toggle('timer-controls_opened');
    }
})