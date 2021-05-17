const form = document.querySelector('.form');

const enLayout = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
    'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
    'space'
];

class Keyboard {
    constructor() {
        this._keysLayout = [];
        this._keysButtons = [];
        this._capsLock = false; 
    }
    setKeyboard(keysLayout) {
        this._keysLayout = keysLayout;
    }
    init() {
        const keyboard = document.createElement('div');
        const keysContainer = document.createElement("div");

        keyboard.classList.add('form__keyboard', 'keyboard');
        keysContainer.classList.add('keyboard__keys');

        keysContainer.appendChild(this._createKeys());
        keyboard.appendChild(keysContainer);
        form.appendChild(keyboard);

        this._keysButtons = keyboard.querySelectorAll('.keyboard__key');

        form.addEventListener('focusin', () => {
            if(form.classList.contains('form--opened')) {
                return;
            }else {
                form.classList.add('form--opened');
            }
        });
        
        form.addEventListener('click', (event) => {
            const clickedElement = event.target;
            const clickedButton = clickedElement.closest('.keyboard__key');
            const text = form.elements.text;

            event.preventDefault();
            
            if(!clickedButton) {
                return;
            }if(clickedButton.dataset.name == 'backspace') {
                text.value = text.value.substring(0, text.value.length - 1);
                text.focus();
            }if(clickedButton.dataset.name == 'caps') {
                this._capsLock = !this._capsLock ? true : false;
                this._toggleCapsLock();
                clickedButton.firstChild.setAttribute('src', !this._capsLock ? 'assets/icons/icon-caps.jpg' : 'assets/icons/icon-caps-on.jpg');
                text.focus();
            }if(clickedButton.dataset.name == 'enter') {
                text.value += "\n";
                text.focus();
            }if(clickedButton.dataset.name == 'done') {
                if(form.classList.contains('form--opened')) {
                    form.classList.remove('form--opened');
                }
            }if(clickedButton.dataset.name == 'space') {
                text.value += ' ';
                text.focus();
            }if(clickedElement.dataset.name == 'symbol'){
                text.value += clickedElement.innerHTML;
                text.focus();
            }   
        })
    }
    _createKeys() {
        const fragment = document.createDocumentFragment();

        this._keysLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const createIconHTML = (iconName) => {
                 return `<img src="assets/icons/icon-${iconName}.jpg" class="keyboard__key-icon" alt="icon-${iconName}">`;
            };
            const createAttribute = (element, elementName) => {
                element.setAttribute('data-name', elementName);
            };

            keyElement.classList.add('keyboard__key');

            switch (key) {
                case "backspace":
                keyElement.classList.add('keyboard__key--color-blue', 'keyboard__key--width_size-m');
                keyElement.innerHTML = createIconHTML("backspace");
                createAttribute(keyElement, 'backspace');
                
                break;
                
                case "caps":
                keyElement.classList.add('keyboard__key--color-blue', 'keyboard__key--width_size-m', "keyboard__key--activatable");
                keyElement.innerHTML = createIconHTML("caps");
                createAttribute(keyElement, 'caps');
                
                break;
                
                case "enter":
                keyElement.classList.add('keyboard__key--color-blue', 'keyboard__key--width_size-m');
                keyElement.innerHTML = createIconHTML("enter");
                createAttribute(keyElement, 'enter');
                
                break;
                
                case "done":
                keyElement.classList.add('keyboard__key--color-blue', 'keyboard__key--width_size-m', "keyboard__key--dark");
                keyElement.innerHTML = createIconHTML("done");
                createAttribute(keyElement, 'done');
                
                break;
  
                case "space":
                    keyElement.classList.add('keyboard__key--color-blue', 'keyboard__key--width_size-l');
                    createAttribute(keyElement, 'space');
    
                    break;

                default:
                    keyElement.classList.add('keyboard__key--color-symbol', 'keyboard__key-symbol', 'keyboard__key--width_size-s');
                    keyElement.textContent = key.toLowerCase();
                    createAttribute(keyElement, 'symbol');
                
                    break;
            };

            fragment.appendChild(keyElement);
    
            if(['backspace', 'p', 'enter', '?'].includes(key)) { 
            fragment.appendChild(document.createElement('br'));
            };   
        });
            return fragment;
    }
    _toggleCapsLock() {
        this._keysButtons.forEach(button => {
            if(button.dataset.name == 'symbol') {
                button.textContent = this._capsLock ? button.textContent.toUpperCase() : button.textContent.toLowerCase();
            } 
        });
    }
};

const en = new Keyboard();
en.setKeyboard(enLayout);

document.addEventListener('DOMContentLoaded', () => {
    en.init();
});
