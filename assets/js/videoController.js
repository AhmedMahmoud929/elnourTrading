let controlBtn = document.querySelector("#home header i.fa-solid");
let videoBG = document.querySelector("#home video.video-bg");

controlBtn.addEventListener("click", () => {
  if (controlBtn.classList.contains("fa-circle-pause")) {
    controlBtn.classList.remove("fa-circle-pause");
    controlBtn.classList.add("fa-circle-play");
    videoBG.pause();
  } else {
    controlBtn.classList.remove("fa-circle-play");
    controlBtn.classList.add("fa-circle-pause");
    videoBG.play();
  }
});
