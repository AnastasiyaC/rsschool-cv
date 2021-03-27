const editorArea = document.querySelector('.editor-area');
const title = document.querySelector('.editor-area__title');
const titleText = title.textContent;
const image = document.querySelector('.photo-area__image');
const editorForm = document.querySelector('.modification__form');

const CHANGE_TYPE_TO_INPUTS_MAP = {
    background: '<input class="modification__input input-color" type="color" name="background" value="#afafaf" data-name="background">',
    resize: '<input class="modification__input input-range input-range--rotate" type="range" min="0" max="80" value="40" name="resize" step="1" data-suffix="px" data-name="resize">',
    contrast: ' <input class="modification__input input-range" type="range" min="30" max="200" value="100" name="contrast" step="1" data-suffix="%" data-name="contrast">',
    brightness: '<input class="modification__input input-range" type="range" min="20" max="200" value="100" name="brightness" step="1" data-suffix="%" data-name="brightness">',
    tint: '<input class="modification__input input-range" type="range" min="0" max="360" value="0" name="tint" step="1" data-suffix="deg" data-name="tint">',
    blur: '<input class="modification__input input-range" type="range" min="0" max="10" value="0" name="blur" step="0.1" data-suffix="px" data-name="blur">',
    suturation: '<input class="modification__input input-range" type="range" min="0" max="200" value="100" name="suturation" step="1" data-suffix="%" data-name="saturate">',
    grayscale: '<input class="modification__input input-range" type="range" min="0" max="100" value="0" name="grayscale" step="1" data-suffix="%" data-name="grayscale">',
    sepia: '<input class="modification__input input-range" type="range" min="0" max="100" value="0" name="sepia" step="1" data-suffix="%" data-name="sepia">',
}

const defaultImage = {
    propName: null,
    propValue: null,
};

let {propName, propValue} = defaultImage;

editorArea.addEventListener('click', (e) => {
    const clickedElement = e.target;
    const clickedButton = clickedElement.closest('.filter__button');

    if(clickedButton) {
        const button = clickedButton;
        const changeType = button.dataset.changeType;

        editorForm.innerHTML = CHANGE_TYPE_TO_INPUTS_MAP[changeType];
        title.textContent = clickedButton.textContent;
        editorArea.classList.toggle('form--opened');
        defaultImage.propName = `--${changeType}`;
        defaultImage.propValue = editorForm[changeType].value + (editorForm[changeType].dataset.suffix || '');
    }
    else if(clickedElement.classList.contains('modification__exit-button')) {
        console.log(defaultImage);
        // document.documentElement[defaultImage.propName]= defaultImage;
        removeToggle();

    }
    else if(clickedElement.classList.contains('modification__submit-button')) {
        removeToggle();
    }
});

function removeToggle() {
    editorArea.classList.remove('form--opened');
    title.textContent = titleText;
};

function imageUpdate(propName, propValue, suffix) {
    document.documentElement.style.setProperty(`--${propName}`, propValue + suffix);
};

editorForm.addEventListener('change', (e) => {
    const propName = e.target.dataset.name;
    const propValue = e.target.value;
    const suffix = e.target.dataset.suffix || '';

    if(e.target.classList.contains('modification__input')) {
        imageUpdate(propName, propValue, suffix);
    };
});

editorForm.addEventListener('mousemove', (e) => {
    const propName = e.target.dataset.name;
    const propValue = e.target.value;
    const suffix = e.target.dataset.suffix || '';

    if(e.target.classList.contains('modification__input')) {
        imageUpdate(propName, propValue, suffix);
    };

});








    
