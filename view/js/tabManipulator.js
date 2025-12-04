const buttons = document.querySelectorAll(".sidebar-item");
const sections = document.querySelectorAll(".content-area");
const arrow = document.querySelector(".sidebar-arrow");
const nav = document.querySelector(".sidebar-nav");

let currentSection = document.querySelector(".content-area");

function moveArrowTo(element) {
  const relativeOffset = element.offsetTop - nav.offsetTop;
  const center = element.offsetHeight / 2;
  const arrowHeight = 20;

  arrow.style.transform = `translateY(calc(10rem + ${
    relativeOffset + center - arrowHeight
  }px))`;
}

function changeSection(nextSectionId) {
  const nextSection = document.getElementById(nextSectionId);
  if (nextSection === currentSection) return;

  currentSection.style.opacity = 0;
  currentSection.style.transform = "translateY(10px)";

  setTimeout(() => {
    currentSection.style.display = "none";

    nextSection.style.display = "flex";
    nextSection.style.opacity = 0;
    nextSection.style.transform = "translateY(10px)";

    nextSection.getBoundingClientRect();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nextSection.style.opacity = 1;
        nextSection.style.transform = "translateY(0)";
      });
    });

    currentSection = nextSection;
  }, 400);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = btn.dataset.section;

    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    moveArrowTo(btn);
    changeSection(target);
  });
});

window.addEventListener("load", () => {
  const activeItem = document.querySelector(".sidebar-item.active");

  sections.forEach((sec) => {
    if (sec.id === activeItem.dataset.section) {
      sec.style.display = "flex";
      sec.style.opacity = 1;
      sec.style.transform = "translateY(0)";
      currentSection = sec;
    } else {
      sec.style.display = "none";
      sec.style.opacity = 0;
      sec.style.transform = "translateY(10px)";
    }
  });

  moveArrowTo(activeItem);
});
