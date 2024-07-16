let navIcon = document.querySelector(".toggle-icon");
let navMenu = document.querySelector(".nav-phone");
let navLinks = document.querySelectorAll(".nav-phone li a");
let navIsOpen = false;

navIcon.addEventListener("click", () => {
  if (!navIsOpen) openNavbar();
  else closeNavbar();
});

function closeNavbar() {
  // ICON
  navIcon.children[0].style.transform = "";
  navIcon.children[1].style.opacity = "1";
  navIcon.children[2].style.transform = "";
  navIcon.style.position = "";
  // FLAG
  navIsOpen = false;
  // MENU
  navMenu.style.cssText = `
  opacity: 0;
  pointer-events: none;`;
}
function openNavbar() {
  // ICON
  navIcon.children[0].style.transform = "translateY(12px) rotate(45deg)";
  navIcon.children[1].style.opacity = "0";
  navIcon.children[2].style.transform = "translateY(-7px) rotate(-45deg)";
  navIcon.style.position = "fixed";
  navIcon.style.right = "35px";
  // FLAG
  navIsOpen = true;
  // MENU
  navMenu.style.cssText = `
     opacity: 1;
     pointer-events: auto;`;
}

// When click on a link
// navLinks.forEach((ele, ix) => {
//   ele.addEventListener("click", () => {
//     closeNavbar();
//   });
// });
