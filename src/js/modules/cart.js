import { checkCart, getScrollbarWidth } from "../utilits/function.js";
import { getDoc, doc, } from "firebase/firestore";
import { db, } from "./firebase.js";

let cart;
const iconCart = document.querySelector('.header__cart-icon');
document.addEventListener('DOMContentLoaded', whichEmptyCart);

export async function whichEmptyCart() {
   cart = await checkCart();
   iconCart.classList.toggle('header__cart-icon--not-empty', Object.keys(cart).length);
   await addCards(cart); //getProductsDataOfCart
   console.log(cart);
}
const cartBox = document.querySelector('.header__cart');
const body = document.querySelector('body');
const zero = document.querySelector('.header__zero');
const backLink = document.querySelector('.base__back-link');

iconCart.addEventListener('click', openCart);
async function openCart() {
   body.style.overflow = 'hidden';
   zero.classList.add('header__zero--active');
   if (backLink) {
      backLink.style.zIndex = '1';
   }
   const html = document.querySelector('html');
   document.body.style.paddingRight = `${getScrollbarWidth()}px`
   cartBox.classList.add('header__cart--active');
   zero.addEventListener('click', closeCart);
   const crissCross = cartBox.querySelector('.cart__title-criss-cross');
   crissCross.addEventListener('click', closeCart);
}
function closeCart() {
   zero.classList.remove('header__zero--active');
   body.style.overflow = 'visible';
   if (backLink) {
      backLink.style.zIndex = '51';
   }
   cartBox.classList.remove('header__cart--active');
   document.body.style.paddingRight = '0px'
}
async function addCards(cart) {
   for (const productUid in cart) {
      if (Object.hasOwnProperty.call(cart, productUid)) {
         try {
            const productData = cart[productUid];
            const productSnapshot = await getDoc(doc(db, 'products', productUid));
            const typeProductSnapshot = await getDoc(doc(db, 'constData', 'typeProduct'));
            const typeProduct = typeProductSnapshot.data();
            const product = productSnapshot.data();
            console.log(cart[productUid], product, productUid);
            const card = createCard(product, productData, productUid);
            const cardsWrapper = document.querySelector('.cart__cards-wrapper');
            cardsWrapper.appendChild(card);
            const imgBlock = card.querySelector('.card__img-block');
            console.log(product.base.type);
            imgBlock.style.background = typeProduct[product.base.type].bg_color;
            //card.querySelector('#autoship').checked = product.autoship;
         } catch (error) {
            console.log(error);
         }
      }
   }
}

function createCard(product, productData, productUid) {
   const cardInner = `<div class="card__img-block">
     <div class="card__img-wrapper">
       <div>
       <picture>
       <source srcset="${product.base.webP}" type="image/webp">
       <img  class="card__img" src="${product.base.png}" alt="${product.base.name}">
       </picture>
       </div>
     </div>
   </div>
   <div class="card__content">
     <div class="card__title-block">
       <a href="product.html?id=${productUid}" class="card__title">${product.base.name}</a>
       <div class="card__criss-cross"  data-uid="${productUid}">
       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
         <path d="M1 13L13 0.999998" stroke="#C7C7C7" stroke-width="2" />
         <path d="M13 13L1 0.999999" stroke="#C7C7C7" stroke-width="2" />
       </svg>
       </div>
     </div>
     <div class="card__price-block">
       <div class="card__quantity-choice">
         <div class="card__quantity-choice-minus-block card__quantity-choice-minus-block--not-active"  data-uid="${productUid}">
           <img src="img/product-card/minus.svg" alt="Minus" />
         </div>
         <div class="card__quantity-choice-out-block">${productData.count}</div>
         <div class="card__quantity-choice-plus-block" data-uid="${productUid}">
           <img src="img/product-card/plus.svg" alt="Plus" />
         </div>
       </div>
       <div class="card__price  ${product.base.sale != '' ? 'card__prise--text--strikethrough' : ''}">${product.base.price}</div>
       <div class="card__sale-price ${product.base.sale == '' ? 'card__sale-prise--display--none' : ''}">${(product.base.price * product.base.sale / 100).toFixed(2)}</div>
     </div>
     <div class="cart-autoship">
       <div class="cart-autoship__select-block cart-autoship__select-block--not-active">
         <div class="cart-autoship__start-label">Autoship this item every</div>
         <div class="cart-autoship__start-label-small">Deliver every</div>
         <div class="cart-autoship__select-box">
           <div class="cart-autoship__select-header">
             <div class="cart-autoship__select-header-text">${productData.autoshipPeriodicity}</div>
             <img class="cart-autoship__select-arrow" src="img/product-card/Back_arrow.svg" alt="Back arrow" />
           </div>
           <ul class="cart-autoship__select-list cart-autoship__select-list--not-show">
             <li class="cart-autoship__select-item cart-autoship__select-item--active" data-value="30">30</li>
             <li class="cart-autoship__select-item" data-value="45">45</li>
             <li class="cart-autoship__select-item" data-value="60">60</li>
             <li class="cart-autoship__select-item" data-value="90">90</li>
           </ul>
         </div>
         <div class="cart-autoship__finish-label">days</div>
       </div>
       <div class="cart-autoship__checkbox">
         <label for="cart-autoship" class="cart-autoship__checkbox-label">
           <input type="checkbox" name="cart-autoship" id="cart-autoship" class="cart-autoship__checkbox-input"  data-uid="${productUid}"/>
           <div class="cart-autoship__castom-checkbox cart-autoship__castom-checkbox--checked">
             <div class="cart-autoship__check-mark">
               <img src="img/product-card/check-mark.svg" alt="Chack mark" />
             </div>
           </div>
         </label>
       </div>
     </div>
   </div>`;
   const card = document.createElement('div');
   card.classList.add('cart__card', 'card');
   card.innerHTML = cardInner;
   return card
}