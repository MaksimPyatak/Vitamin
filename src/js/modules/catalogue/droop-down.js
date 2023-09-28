import { selectItem } from "../../utilits/function.js";
const openingBox = document.querySelector('.catalog-menu__opening-box');
const backArrow = document.querySelector('.catalog-menu__opening-icon');
const catalogList = document.querySelector('.catalog-menu__list');

openingBox.addEventListener('click', openList);
function openList() {
   if (!catalogList.classList.contains('catalog-menu__list--opening')) {
      catalogList.classList.add('catalog-menu__list--opening');
      backArrow.classList.add('catalog-menu__opening-icon--opening');
   } else {
      catalogList.classList.remove('catalog-menu__list--opening');
      backArrow.classList.remove('catalog-menu__opening-icon--opening');
   }
}
catalogList.addEventListener('click', (e) => {
   if (selectItem(e.target, catalogList, 'catalog-menu__item', 'catalog-menu__item--state--active')) {
      catalogList.classList.remove('catalog-menu__list--opening');
      backArrow.classList.remove('catalog-menu__opening-icon--opening');
   }
})