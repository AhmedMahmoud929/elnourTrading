let dropDownItems = document.querySelectorAll(".drop-down-item");
let subLists = document.querySelectorAll(".sub-list");
let subListsLinks = document.querySelectorAll(".sub-list li a");
let mainLinks = document.querySelectorAll(".main-a");
const isPhone = window.innerWidth <= 768;

// OPEN the drop down
dropDownItems.forEach((item, ix) => {
  if (!isPhone) {
    item.addEventListener("mouseenter", () => {
      subLists[ix].classList.add("active");
      item.classList.add("active");
    });
    item.addEventListener("mouseleave", () => {
      subLists[ix].classList.remove("active");
      item.classList.remove("active");
    });
  } else {
    item.addEventListener("click", () => {
      subLists[ix].classList.toggle("active");
      item.classList.toggle("active");
    });
  }
});

// CLOSE when click on a link [pc & phone]
subListsLinks.forEach((item, ix) => {
  item.addEventListener("click", () => {
    subLists.forEach((ele) => ele.classList.remove("active"));
    dropDownItems.forEach((ele) => ele.classList.remove("active"));
  });
});

// CLOSE when click outside [phone]
document.addEventListener("click", (event) => {
  dropDownItems.forEach((item, ix) => {
    if (!item.contains(event.target) && !subLists[ix].contains(event.target)) {
      subLists[ix].classList.remove("active");
      item.classList.remove("active");
    }
  });
});

if (!isPhone) {
  mainLinks.forEach((ele) => {
    const route = ele.getAttribute("route");
    const lang = ele.getAttribute("lang");
    ele.setAttribute("href", `/${route}${lang}`);
  });
}
