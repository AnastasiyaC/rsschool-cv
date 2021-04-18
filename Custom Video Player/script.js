const videoPlayer = document.querySelector('.player');
const video = document.querySelector('.player__video');
const form = document.forms.controls;
const inputDuration = form.elements.duration;
const generalTime = document.querySelector('.time__general-time');
const currentTime = document.querySelector('.time__current-time');
const iconPlay = document.querySelector('.icon-play');
const iconVolume = document.querySelector('.icon-volume');

const playIcon = {
    play: './assets/icons/icon-play.jpg',
    pause: './assets/icons/icon-pause.jpg',
}

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
        changeIcon(iconPlay);
    }else if(clickedElement.closest('.button-runback')) {
        video.currentTime -= 10;
    }else if(clickedElement.closest('.button-fastforward')) {
        video.currentTime += 10;
    }else if(clickedElement.closest('.button-volume')) {             //////click on button-value ---???
        if(form.elements.volume.value > 0) {
            inputVolumeValue = form.elements.volume.value;
            video.volume = 0;
            iconVolume.setAttribute('src', icon.volume.mute);
            form.elements.volume.value = 0;
        }else if(form.elements.volume.value == 0) {
            form.elements.volume.value = inputVolumeValue;
            video.volume = inputVolumeValue;
            iconVolume.setAttribute('src', icon.volume.unmute);
        }
    }else if(clickedElement.closest('.button-fullscreen')) {
        if(videoPlayer.classList.contains('player--fullscreen')) {
            videoPlayer.classList.remove('player--fullscreen');
        }else{
            videoPlayer.classList.add('player--fullscreen');
        }
    }
})

videoPlayer.addEventListener('mouseover', (e) => {
    if(e.target.closest('.player')) {
        form.classList.add('form--opened')
    }
})

videoPlayer.addEventListener('mouseout', (e) => {
    if(e.target.closest('.player')) {
        form.classList.remove('form--opened')
    }
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
    }else if(e.target.classList.contains('input-volume')) {
        video.volume = e.target.value;
        if(e.target.value == 0) {
            iconVolume.setAttribute('src', icon.volume.mute);
        }else if(e.target.value > 0) {
            iconVolume.setAttribute('src', icon.volume.unmute);
        }
    }
})

form.addEventListener('mousedown', (e) => {
    if(e.target.classList.contains('input-duration')) {
        clickedInputDuration = true;
    }
})

form.addEventListener('mousemove', (e) => {
    if(e.target.classList.contains('input-duration')) {
        if(clickedInputDuration) {
            changeCurrentTime(e);
        }     
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
    }else {
        video.pause();
    }
}

function changeIcon(icon) {     
    if(video.paused) {
        icon.setAttribute('src', playIcon.play);
    }else {
        icon.setAttribute('src', playIcon.pause);
    }
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


// class VideoPlay {
//     constructor(videoName) {
//         this.videoName = videoName;
//         this._volume = 0;
//         this._currentTime = 0;
//         this._duration = 0;
//     }
//     openFullscreenVideo() {

//     }
//     getVolumeValue() {
//         return this._volume;
//     }
//     setVolumeValue(volumeValue) {
//         this._volume = volumeValue;
//     }
//     setCurrentVideoTime(currentTimeValue) {
//         this._currentTime = currentTimeValue;
//     }
// }

