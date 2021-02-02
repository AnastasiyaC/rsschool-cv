document.body.addEventListener('click', (e) => {
    const clickedElement = e.target;

    if(clickedElement.classList.contains('menu-button')) {
        document.body.classList.toggle('menu-opened');
    }
    else if(clickedElement.classList.contains('navigation__link')) {                              
        document.querySelector('.link--active').classList.remove('link--active');
        clickedElement.classList.add('link--active');  
    }
    else if(clickedElement.classList.contains('phone-button')) {
        clickedElement.parentNode.classList.toggle('phone-display-hiden'); 
    }
    else if(clickedElement.classList.contains('form__label')) {
        removeImages ();
        document.querySelector('.label--active').classList.remove('label--active');
        clickedElement.classList.add('label--active');  
    }
});

const gallery = document.querySelector('.portfolio__images-gallery');

function removeImages () {
    replacedNode = gallery.replaceChild(gallery.children[1], gallery.children[0]);
    gallery.appendChild(replacedNode);
}

