const dateToday = new Date();

const year = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDay = getWeekDay(dateToday);
const month = year[dateToday.getMonth()];
const dateNumber = dateToday.getDate();
const greetForm = document.forms.greet;

greetForm.addEventListener('keydown', (e) => {
  if (e.code == 'Enter') {
    e.target.blur();
  }else 
    return;
});

greetForm.addEventListener('change', (e) => {
  const {name, value} = e.target;
   
  localStorage.setItem(name, value);
});

document.querySelector('.date__day-of-week').innerHTML = weekDay;
document.querySelector('.date__date').innerHTML = dateNumber;
document.querySelector('.date__month').innerHTML = month;  

function getWeekDay(date) {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let day = date.getDay();
  let result = (day != 0) ? day - 1 : day = 6;

  return week[result];
};

// show current time
function showTime() {
  const timeNow = new Date();
  const hourNow = timeNow.getHours();
  const minuteNow = timeNow.getMinutes();
  const secondNow = timeNow.getSeconds();

  document.querySelector('.time__hour').innerHTML = addZero(hourNow);
  document.querySelector('.time__minute').innerHTML = addZero(minuteNow);
  document.querySelector('.time__second').innerHTML = addZero(secondNow);

  setTimeout(showTime, 1000);
};

function addZero(num) {
  return ((num < 10) ? '0' : '') + num;
};

// change background image and greet-phase
function DayPart(name) {
  this.name = name;
  this.phase = `Good ${this.name}, `;
  this.background = ` url("./assets/images/${this.name}.jpg")`;
};

function showBackground() {
  const time = new Date();
  const hour = time.getHours();
  
  if(hour >= 0 && hour < 6) {
    changeBackground('night');
  }else if(hour >= 6 && hour < 12) {
    changeBackground('morning');
  }else if(hour >= 12 && hour < 18) {
    changeBackground('afternoon');
  }else {
    changeBackground('evening');
  };

  setTimeout(showBackground, 1000);
};

function changeBackground(part) {
  const labelName = document.querySelector('.label-name');  
  const partObj = new DayPart(part);

  document.body.style.backgroundImage = partObj.background;
  labelName.textContent = partObj.phase;
};

function getValue1(formElemName) {
  const a = greetForm.elements[formElemName];

  a.value = localStorage.getItem(formElemName);
};

showTime();
showBackground(); 
getValue1('name');
getValue1('plan');







