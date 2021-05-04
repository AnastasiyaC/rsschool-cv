const videoPlayer = document.querySelector('.player');
const video = document.querySelector('.player__video');
const form = document.forms.controls;
const inputDuration = form.elements.duration;
const inputVolume = form.elements.volume;
const generalTime = document.querySelector('.time__general-time');
const currentTime = document.querySelector('.time__current-time');
const playerButtonIcon = document.querySelector('.player__button-icon');
const iconAct = document.querySelector('.icon-act');
const iconVolume = document.querySelector('.icon-volume');
const iconResize = document.querySelector('.icon-resize');

const icon = {
    act: {
        play: './assets/icons/icon-play.jpg',
        pause: './assets/icons/icon-pause.jpg',
    },
    volume: {
        unmute: './assets/icons/icon-volume.jpg',
        mute: './assets/icons/icon-mute.jpg'
    },
    resize: {
        fullscreen: './assets/icons/icon-fullscreen.jpg',
        smallscreen: './assets/icons/icon-smallscreen.jpg',
    },
}

let inputVolumeValue = null;
let clickedInputDuration = false;

videoPlayer.addEventListener('click', (e) => {
    const clickedElement = e.target;
    e.preventDefault();
    if(clickedElement.classList.contains('player__video') || clickedElement.closest('.button-play')) {
        playOrPause();
        videoPlayer.classList.add('player--button-apperance');
        setTimeout(removeApperance, 600);  
    }if(clickedElement.closest('.button-runback')) {
        video.currentTime -= 10;
    }if(clickedElement.closest('.button-fastforward')) {
        video.currentTime += 10;
    }if(clickedElement.closest('.button-volume')) {
        changeVolume();
    }if(clickedElement.closest('.button-fullscreen')) {
        changeScreenSize();
    }
})

videoPlayer.addEventListener('mouseover', (e) => {
    // if(e.target.closest('.player')) {
    //     form.classList.add('form--opened');
    // }
    e.target.closest('.player') && form.classList.add('form--opened');   // -is it a good decision to replace "if(){}"??
})

videoPlayer.addEventListener('mouseout', (e) => {
    // if(e.target.closest('.player')) {
    //     form.classList.remove('form--opened')
    // }
    e.target.closest('.player') && form.classList.remove('form--opened');  // -is it a good decision to replace "if(){}"??
})

video.addEventListener('loadedmetadata', (e) => {
    const duration = video.duration.toFixed();
    inputDuration.setAttribute('max', duration);
    generalTime.innerHTML = convertSecondsIntoMinutes(duration); 
});

video.addEventListener('timeupdate', (e) => {
    const time =  Math.floor(video.currentTime);
    currentTime.innerHTML = convertSecondsIntoMinutes(time);
    moveInputThumb();
});

form.addEventListener('change', (e) => {
    if(e.target.classList.contains('input-duration')) {
        changeCurrentTime(e);
    }if(e.target.classList.contains('input-volume')) {
        video.volume = e.target.value;
        e.target.value == 0 ? iconVolume.setAttribute('src', icon.volume.mute) : iconVolume.setAttribute('src', icon.volume.unmute);
    }
})

form.addEventListener('mousedown', (e) => {
    if(e.target.classList.contains('input-duration')) {
        clickedInputDuration = true;
    }
})

form.addEventListener('mousemove', (e) => {
    if(e.target.classList.contains('input-duration')) {    
        clickedInputDuration && changeCurrentTime(e);
    }
})

form.addEventListener('mouseup', (e) => {
    if(e.target.classList.contains('input-duration')) {
        clickedInputDuration = false;
    }
})

function playOrPause() {
    if(video.paused) {
        video.play();   
        iconAct.setAttribute('src', icon.act.pause);
        playerButtonIcon.setAttribute('src', icon.act.play);
    }else {
        video.pause();
        iconAct.setAttribute('src', icon.act.play);
        playerButtonIcon.setAttribute('src', icon.act.pause);
    }
}

function changeVolume() {
    if(inputVolume.value > 0) {
        inputVolumeValue = inputVolume.value;
        video.volume = 0;
        iconVolume.setAttribute('src', icon.volume.mute);
        inputVolume.value = 0;
    }else if(inputVolume.value == 0) {
        inputVolume.value = inputVolumeValue;
        video.volume = inputVolumeValue;
        iconVolume.setAttribute('src', icon.volume.unmute);
    }
}

function changeScreenSize() {
    if(videoPlayer.classList.contains('player--fullscreen')) {
        iconResize.setAttribute('src', icon.resize.fullscreen);
        videoPlayer.classList.remove('player--fullscreen');
    }else{
        videoPlayer.classList.add('player--fullscreen');
        iconResize.setAttribute('src', icon.resize.smallscreen);
    }
}

function removeApperance() {
    // if(videoPlayer.classList.contains('player--button-apperance')) {
    //     videoPlayer.classList.remove('player--button-apperance')
    // }else return
    videoPlayer.classList.contains('player--button-apperance') && videoPlayer.classList.remove('player--button-apperance');
    // -is it a good decision to replace "if(){}"??
}

function changeCurrentTime(e) {
    const time = e.target.value;
    video.currentTime = time;
    currentTime.innerHTML = convertSecondsIntoMinutes(time);
}

function moveInputThumb() {
    inputDuration.value = video.currentTime;
}

function convertSecondsIntoMinutes(seconds) {
    const modulo = seconds % 60;
    const result = `${Math.floor(seconds / 60)}:${modulo < 10 ? '0' : ''}${modulo}`;
    return result;
}