const editorArea = document.querySelector('.editor-area'),
    title = document.querySelector('.editor-area__title'),
    titleText = title.textContent,
    image = document.querySelector('.photo-area__image'),
    inputForm = document.querySelectorAll('.modification__input');

editorArea.addEventListener('click', (e) => {
    const clickedElement = e.target;

    if(clickedElement.closest('.filter__button')) {
        console.log('hello');
        title.textContent = clickedElement.closest('.filter__button').textContent;
        editorArea.classList.toggle('form-opened');
    }
    else if(clickedElement.classList.contains('modification__exit-button')) {
        removeToggle();
    }
    else if(clickedElement.classList.contains('modification__submit-button')) {
        removeToggle();
    }
});


function removeToggle() {
    editorArea.classList.remove('form-opened');
    title.textContent = titleText;
};

// function confirmFilter() {
//     let addedFilter = '';


//     return function makeChanges() {
//         const suffix = this.dataset.sizing || '';

//         document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
//     };

// };

// let filter = confirmFilter();

// inputForm.forEach(input => input.addEventListener('change', filter));

// inputForm.forEach(input => input.addEventListener('mousemove', filter));

function imageUpdate() {
    const suffix = this.dataset.sizing || '';

    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
};





const editorForm = document.querySelector('.modification__form');

editorForm.addEventListener('change', (e) => {
    if(e.target.classList.contains('input-range')) {
        console.log(e.target.value);
        // imageUpdate();
        document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value + e.target.dataset.sizing);
    } else if(e.target.classList.contains('input-color')) {
        console.log(e.target.value);
        // imageUpdate();
        document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value);
    }
});

editorForm.addEventListener('mousemove', (e) => {
    if(e.target.classList.contains('input-range')) {
        console.log(e.target.value);
        // imageUpdate();
        document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value + e.target.dataset.sizing);
    } else if(e.target.classList.contains('input-color')) {
        console.log(e.target.value);
        // imageUpdate();
        document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value);
    }
});




// TERRIBLE CODE STARTS HERE 
// const inputColor = document.querySelector('.input-color');
// const background = document.querySelector('.photo-area');

// const form = document.querySelectorAll('.modification__form');

// inputColor.addEventListener('change', (e) => {
//     console.log(e.target.value);
//     background.style.setProperty('--background-color', e.target.value);
//     background.style.backgroundColor = e.target.value;
// });



// CONTRAST

// const inputContrast = document.querySelector('.input-contrast');

// inputContrast.addEventListener('change', (e) => {
//     console.log(e.target);
//     console.log(inputContrast.name);

//     image.style.setProperty('--' + inputContrast.name, e.target.value + inputContrast.dataset.sizing);
// });

// inputContrast.addEventListener('mousemove', (e) => {
//     console.log(e.target.value); 

//     image.style.setProperty('--' + inputContrast.name, e.target.value + inputContrast.dataset.sizing);
// });






    
