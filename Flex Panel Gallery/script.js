const blocks = document.querySelectorAll(".block");

function closeOpens() {
  const opens = document.querySelectorAll(".block-opened");

  if (opens.length > 0) {
    opens.forEach((openBlock) => {
      openBlock.classList.remove("block-opened");
    });
  }
};

function toggleActive(e) {
    if (e.propertyName.includes('flex')) {
        this.classList.toggle('opened-active');
    }
};

blocks.forEach((block) => {
  block.addEventListener("click", () => {
    closeOpens();
    block.classList.add("block-opened");
  });
});

blocks.forEach((block) =>
  block.addEventListener("transitionend", toggleActive)
);



