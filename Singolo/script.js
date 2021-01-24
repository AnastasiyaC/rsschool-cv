document.body.addEventListener('click', (e) => {
    const clickedElement = e.target;

    if(clickedElement.classList.contains('menu-button')) {
        document.body.classList.toggle('menu-opened');
    }
    else if(clickedElement.classList.contains('navigation__link')) {
        console.log('hello');
        document.body.classList.remove('active');
        clickedElement.classList.add('active');
    }
    else if(clickedElement.classList.contains('form__label')) {

    }
});

const gallery = document.querySelector('.portfolio__images-gallery');

replacedNode = gallery.replaceChild(gallery.children[1], gallery.children[0]);
gallery.appendChild(replacedNode);



// const menuButton = document.querySelector('.menu-button');

// menuButton.addEventListener('click', () => {
//     document.body.classList.toggle('menu-opened');
// });

// const links = document.querySelectorAll('.navigation__link');

// links.forEach((link) =>
//     link.addEventListener('click', () => {
//         console.log('hello');
//         links.forEach(link => link.classList.remove('active'));

//         link.classList.add('active');
//     })
// );



// const gallery = document.querySelector('.portfolio__images-gallery');
// const inputButtons = document.querySelectorAll('.form__label');

// inputButtons.forEach((inputButton) =>
//     inputButton.addEventListener('click', () => {
//         inputButtons.forEach(inputButton => inputButton.classList.remove('label--active'));

//         inputButton.classList.add('label--active');
//         replacedNode = gallery.replaceChild(gallery.children[1], gallery.children[0]);
//         gallery.appendChild(replacedNode);
//     })
// );



// window.onscroll = () => {
//     if (window.scrollY > 300) {
//         links.forEach(link => link.classList.add('scrolled'));
//     } else {
//         links.forEach(link => link.classList.remove('scrolled'));
//     }
// };