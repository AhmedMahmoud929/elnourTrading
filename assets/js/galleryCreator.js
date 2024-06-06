let galleryCont = document.querySelector("#gallery-page .frames");
let numberOfImgs = 9;

for (let i = 1; i <= numberOfImgs; i++) {
  galleryCont.innerHTML += `<div class="item" data-aos="flip-right" data-aos-duration="900" data-aos-delay="100">
  <img class="bg-img" src="./imgs/gallery_imgs/g_${i}.jpg" alt="gallery" />
  <img class="main-img" src="./imgs/gallery_imgs/g_${i}.jpg" alt="gallery" />
  </div>`;
}
