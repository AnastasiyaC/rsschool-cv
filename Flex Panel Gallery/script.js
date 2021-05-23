const generalBlock = document.querySelector('.blocks');
const blocks = generalBlock.querySelectorAll('.block');
const blocksArr = Array.from(blocks);

generalBlock.addEventListener('mousemove', (event) => {
  const blockFocused = event.target.closest('.block');

  if(!blockFocused) {
    blocks.forEach(block => block.classList.remove('block--focused'));
  }if(blockFocused) {
    blocks.forEach(block => block.classList.remove('block--focused'));
    event.target.classList.add('block--focused');
  }
})

generalBlock.addEventListener('click', (event) => {
  const clickedBlock = event.target.closest('.block');

  if(clickedBlock) {
    blocks.forEach((block) => {
      block.classList.remove('block--opened');
      block.classList.add('block--font-size');
    });
    event.target.classList.toggle('block--opened')
  }if(!clickedBlock) {
    blocks.forEach((block) => {
      block.classList.remove('block--opened', 'block--font-size');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('active');
});




