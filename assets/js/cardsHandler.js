let card = document.querySelectorAll("#values .card-cont .card");
let cardIcon = document.querySelectorAll("#values .card-cont .icon");
let viewMore = document.querySelectorAll("#values .card-cont .view-more");
let viewLess = document.querySelectorAll("#values .card-cont .view-less");

// open
viewMore.forEach((ele, ix) => {
  ele.addEventListener("click", () => {
    card[ix].style.transform = "rotateY(0.5turn)";
    setTimeout(() => {
      card[ix].style.height = "280px";
    }, 200);
    setTimeout(() => {
      cardIcon[ix].style.top = "calc( 100% - 50px )";
      cardIcon[ix].style.left = "calc( 100% - 50px )";
    }, 500);
  });
});

// close
viewLess.forEach((ele, ix) => {
  ele.addEventListener("click", () => {
    card[ix].style.transform = "";
    setTimeout(() => {
      card[ix].style.height = "160px";
    }, 200);
    setTimeout(() => {
      cardIcon[ix].style.top = "-15px";
      cardIcon[ix].style.left = "-30px";
    }, 500);
  });
});
