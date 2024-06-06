let slidesCont = document.querySelector(".mySwiper-gallery .swiper-wrapper");
let numberOfImgs = 9;

for (let i = 1; i <= numberOfImgs; i++) {
  slidesCont.innerHTML += `<div class="swiper-slide">
  <img class="bg-img" src="./imgs/gallery_imgs/g_${i}.jpg" alt="gallery" />
  <img class="main-img" src="./imgs/gallery_imgs/g_${i}.jpg" alt="gallery" />
  </div>`;
}
