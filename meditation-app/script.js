const navigationButtons = document.querySelectorAll('.navigation__button-element');
const controllTimeButtons = document.querySelectorAll('.controll__button-time');
const videoWrapper = document.querySelector('.video-block__wrapper');
const videos = document.querySelectorAll('.meditation__video');
const audios = document.querySelectorAll('.sounds');
const playButton = document.querySelector('.controll__button-play');
const playButtonText = playButton.querySelector('.button-play__text');
const minutes = document.querySelector('.timer__minutes');
const seconds = document.querySelector('.timer__seconds');

let elementName = document.querySelector('.button-element--active').dataset.name;
let playTime = getTime(document.querySelector('.button-time--active').innerHTML);

let currentVideo = getCurrentMedia(elementName, videos);
let currentAudio = getCurrentMedia(elementName, audios);

let videoIsActive = false;

let count = playTime;

document.addEventListener('click', (event) => {
    const clickedElement = event.target;
    const clickedNavigationButton = clickedElement.closest('.navigation__button-element')

    if (clickedNavigationButton) {  
        document.querySelector('.button-element--active').classList.remove('button-element--active');
        clickedNavigationButton.classList.add('button-element--active'); 
        stopMedia(currentVideo, currentAudio);
        
        elementName = clickedNavigationButton.dataset.name;
        
        currentVideo = getCurrentMedia(elementName, videos);
        currentAudio = getCurrentMedia(elementName, audios);
        slideSlider(clickedNavigationButton);

        count = playTime;
        innerTime(count);
    } if (clickedElement.classList.contains('controll__button-time')) {
        document.querySelector('.button-time--active').classList.remove('button-time--active');
        clickedElement.classList.add('button-time--active'); 
        playTime = getTime(clickedElement.innerHTML);
        count = playTime;
        innerTime(count);
    } if (clickedElement.closest('.controll__button-play') || clickedElement.classList.contains('meditation__video')) {
        event.preventDefault();
        playMedia(currentVideo, currentAudio);
        mediaRepeat(currentVideo);
        mediaRepeat(currentAudio);
        countdown();
    } if (clickedElement.classList.contains('controll__button-reset')) {
        stopMedia(currentVideo, currentAudio);
        count = playTime;
        innerTime(count);
        playButtonText.textContent = 'play';
    }
})

function slideSlider(elem) {
    const index = Array.prototype.slice.call(navigationButtons).findIndex((button) => button === elem);

    videoWrapper.style.transform = `translateX(-${index}00%)`;
}

function playMedia(video, audio) {
    console.log(video)
    console.log(audio)
    if(video.paused) {
        video.play();
        audio.play();
        videoIsActive = true;
        playButtonText.textContent = 'pause';
    } else {
        video.pause();
        audio.pause();
        videoIsActive = false;
        playButtonText.textContent = 'play';
    }
}

function getCurrentMedia(name, arr) {
    return Array.from(arr).find((item) => item.dataset.name === name);
}

function getTime(string) {
    return +string.replace(/[^0-9]/g, '') * 60;
}

// function mediaRepeat(media, n) {
//     let timesRepeat = Math.floor(playTime / media.duration);
//     let timeModulo = Math.floor(playTime % media.duration);

//     console.log(n)

//     if (timesRepeat == n) {
//         media.addEventListener('timeupdate', () => {
//             if (timeModulo == Math.floor(media.currentTime)) {
//                 media.pause();
//                 media.currentTime = 0;
//             } else {
//                 return;
//             }
//         })
//     } else {
//         media.addEventListener('ended', () => {
//             media.currentTime = 0;
//             media.play();  
//             return mediaRepeat(media, n + 1)
//         })
//     }
// }

function mediaRepeat(media) {
    media.addEventListener('ended', () => {
        media.currentTime = 0;
        media.play();
    })
}

function countdown() {
    if(videoIsActive) {
        let timer = setTimeout(countdown, 1000); 
    
        innerTime(count);
        count -= 1;
    
        if (count <= -1) {
            console.log('stop')
            clearTimeout(timer);
            stopMedia(currentVideo, currentAudio);
            count = playTime;
            videoIsActive = false;
        }
    }else {
        innerTime(count);
    }
}

function innerTime(n) {
    let min = Math.floor(n / 60);
    let sec = Math.floor(n % 60);

    minutes.innerHTML = min < 10 ? `0${min}` : min;
    seconds.innerHTML = sec < 10 ? `0${sec}` : sec;
}

function stopMedia(video, audio) {
        console.log('stop media')
        video.pause();
        audio.pause();
        video.currentTime = 0;
        audio.currentTime = 0;
        videoIsActive = false;
}

