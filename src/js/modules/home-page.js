import Swiper from 'swiper';

export const chooseProductsSwiper = new Swiper('.choose-products__swiper', {
   slidesPerView: 1.115,
   spaceBetween: 10,
   centeredSlides: true,
   // Responsive breakpoints
   breakpoints: {
      // when window width is >= 320px
      480: {
         slidesPerView: 1.5,
         spaceBetween: 20,
         centeredSlides: true,
      },
      // when window width is >= 480px
      650: {
         slidesPerView: 1.8,
         spaceBetween: 20,
         centeredSlides: true,
      },
      // when window width is >= 768px
      768: {
         slidesPerView: 2,
         spaceBetween: 33,
         centeredSlides: false,
      }
   }
});