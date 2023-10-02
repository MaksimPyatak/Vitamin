import { renderFilteredCards, productsFilter, renderCard } from "../../utilits/function.js";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db, } from "../firebase.js";

const productsBlock = document.querySelector('.products__products-block');
const openingBox = document.querySelector('.catalog-menu__opening-box');
const backArrow = document.querySelector('.catalog-menu__opening-icon');
const catalogList = document.querySelector('.catalog-menu__list');
const items = catalogList.querySelectorAll(`.catalog-menu__item`);
let productsType = {};
let products = {};
try {
   productsType = await getDoc(doc(db, 'constData', 'typeProduct'));
   products = await getDocs(collection(db, 'products'));
   const locationHash = window.location.hash;
   filterProducts(locationHash, products, productsType);
} catch (error) {
   console.log(error);
}
function filterProducts(param, products, productsType) {
   //! якщо парам це локалХаш  то він є рядком і ми шукаємо по ньому в спимску необхідний елемент
   items.forEach((item) => item.classList.remove('catalog-menu__item--state--active'));
   if (typeof param == 'string') {
      items.forEach((item) => {
         if (item.getAttribute('data-filter') == param) {
            markMenuItem(item);
         }
      })
   } else {
      markMenuItem(param);
      param = param.dataset.filter;
   }
   if ('' != param) {
      const keyParam = param.substring(1, param.indexOf('='));
      const valueParam = param.substring(param.indexOf('=') + 1);
      const filterProducts = productsFilter(products, keyParam, valueParam);
      renderFilteredCards(filterProducts, productsBlock, productsType);
   } else {
      renderCards(products, productsType)
   }
}

function markMenuItem(item) {
   item.classList.add('catalog-menu__item--state--active');
   catalogList.classList.remove('catalog-menu__list--opening');
   backArrow.classList.remove('catalog-menu__opening-icon--opening');
   productsBlock.innerHTML = '';
}

function renderCards(products, productsType) {
   products.forEach((doc) => {
      const data = doc.data().base;
      const card = renderCard(data, productsType, doc.id)
      productsBlock.appendChild(card);
   })
}

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
//catalogList.addEventListener('click', (e) => {
//   if (selectItem(e.target, catalogList, 'catalog-menu__item', 'catalog-menu__item--state--active')) {
//      items.forEach((item) => item.classList.remove('catalog-menu__item--state--active'));
//      e.target.classList.add('catalog-menu__item--state--active');
//      catalogList.classList.remove('catalog-menu__list--opening');
//      backArrow.classList.remove('catalog-menu__opening-icon--opening');
//   }
//})
catalogList.addEventListener('click', (e) => {
   if (e.target.classList.contains('catalog-menu__item') && !e.target.classList.contains('catalog-menu__item--state--active')
   ) {

      //items.forEach((item) => item.classList.remove('catalog-menu__item--state--active'));
      //e.target.classList.add('catalog-menu__item--state--active');
      //catalogList.classList.remove('catalog-menu__list--opening');
      //backArrow.classList.remove('catalog-menu__opening-icon--opening');
      //productsBlock.innerHTML = '';
      //filterProducts(e.target.dataset.filter, products, productsType);
      filterProducts(e.target, products, productsType);
   }
})
document.addEventListener('click', (e) => {
   if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('data-filter')) {
      filterProducts(e.target.dataset.filter, products, productsType);
   }
})