const generalBlock = document.querySelector('.blocks');
const blocks = generalBlock.querySelectorAll('.block');

generalBlock.addEventListener('mousemove', (e) => {
  const blockFocused = e.target.closest('.block');

  if(blockFocused.classList.contains('block')) {
    blocks.forEach(block => block.classList.remove('block--focused'));
  } 
  e.target.classList.add('block--focused');
})

generalBlock.addEventListener('click', (e) => {
  const blockOpened = e.target.closest('.block');

  if(blockOpened.classList.contains('block')) {
    blocks.forEach((block) => {
      block.classList.remove('block--opened');
      block.classList.add('block--font-size');
    });
  }
  e.target.classList.toggle('block--opened');
});

function addClass() {
  document.body.classList.add('active');
};

setTimeout(() => {
  addClass();
}, 500);





