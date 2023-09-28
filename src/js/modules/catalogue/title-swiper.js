import Swiper, { Navigation, Pagination } from 'swiper';
// init Swiper:
const swiper = new Swiper('.title-swiper', {
   modules: [Navigation, Pagination],
   navigation: {
      nextEl: '.swiper__button-next',
      prevEl: '.swiper__button-prev',
   },
   pagination: {
      el: '.swiper-pagination',
   },
   mousewheel: {
      invert: true,
   },
   loop: true,
   slidesPerView: '1',
   spaceBetween: 20,
   centeredSlides: true,
   // Responsive breakpoints
   breakpoints: {
      // when window width is >= 650px
      651: {
         slidesPerView: 'auto',
         spaceBetween: 35,
      },
      // when window width is >= 1025px
      1440: {
         slidesPerView: 'auto',
         spaceBetween: 50,
      }
   }
});