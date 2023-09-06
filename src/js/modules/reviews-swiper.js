import Swiper from 'swiper';
// init Swiper:
const swiper = new Swiper('.swiper-reviews', {
   mousewheel: {
      invert: true,
   },
   loop: true,
   slidesPerView: 1.,
   spaceBetween: 10,
   centeredSlides: true,
   // Responsive breakpoints
   breakpoints: {
      // when window width is >= 320px
      375: {
         slidesPerView: 1.,
         spaceBetween: 10,
         centeredSlides: true,
      },
      480: {
         slidesPerView: 1.5,
         spaceBetween: 20,
         centeredSlides: true,
      },
      // when window width is >= 650px
      650: {
         slidesPerView: 2.045,
         spaceBetween: 33,
         centeredSlides: false,
      },
      // when window width is >= 1025px
      1025: {
         slidesPerView: 3,
         spaceBetween: 33,
         centeredSlides: false,
      }
   }
});