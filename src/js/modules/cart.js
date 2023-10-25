import { checkCart, getScrollbarWidth, changeSlectListPosition } from "../utilits/function.js";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, } from "./firebase.js";

let cart;
const products = {};
let typeProduct;
let pressingTime;
let timerId;
const maxQuantity = 10;
const localCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
const header = document.querySelector('.header');

const iconCart = document.querySelector('.header__cart-icon');
document.addEventListener('DOMContentLoaded', whichEmptyCart);

export async function whichEmptyCart() {
   cart = await checkCart();
   iconCart.classList.toggle('header__cart-icon--not-empty', Object.keys(cart).length);
   const typeProductSnapshot = await getDoc(doc(db, 'constData', 'typeProduct'));
   typeProduct = typeProductSnapshot.data();
   await addCards(cart);
   calcAmount();
}

const priceSum = document.querySelector('.cart__sum');
function calcAmount() {
   let sum = 0;
   for (const productUid in cart) {
      if (Object.hasOwnProperty.call(cart, productUid)) {
         const product = cart[productUid];
         if (products[productUid].base.sale) {
            sum += +(products[productUid].base.sale * products[productUid].base.price / 100 * product.count).toFixed(2);
         } else {
            sum += +(products[productUid].base.price * product.count).toFixed(2);
         }
      }
   }
   priceSum.innerHTML = sum.toFixed(2);
}

const cartBox = document.querySelector('.header__cart');
const html = document.querySelector('html');
const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const zero = document.querySelector('.header__zero');
const backLink = document.querySelector('.base__back-link');
const cardsWrapper = document.querySelector('.cart__cards-wrapper');
const cards = document.querySelector('.cart__cards');
let wrapperMaxWidth = null;
let headerMaxWidth = null;

iconCart.addEventListener('click', openCart);
async function openCart() {
   //document.body.style.paddingRight = `${getScrollbarWidth()}px`;
   //header.style.paddingRight = `${getScrollbarWidth()}px`;
   cartBox.style.display = 'block';
   wrapperMaxWidth = wrapper.style.maxWidth;
   headerMaxWidth = header.style.maxWidth;
   header.style.maxWidth = `${getScrollbarWidth()}px`;
   wrapper.style.maxWidth = `${getScrollbarWidth()}px`;
   html.style.overflow = 'hidden';
   zero.classList.add('header__zero--active');
   if (backLink) {
      backLink.style.zIndex = '1';
   }
   cartBox.classList.add('header__cart--active');
   zero.addEventListener('click', closeCart);
   submitCart();
   const crissCross = cartBox.querySelector('.cart__title-criss-cross');
   crissCross.addEventListener('click', closeCart);

}
function closeCart() {
   zero.classList.remove('header__zero--active');
   //body.style.overflow = 'visible';
   //document.body.style.paddingRight = '0px';
   //header.style.paddingRight = '0px';
   header.style.maxWidth = headerMaxWidth == '' ? '' : `${headerMaxWidth}px`;
   wrapper.style.maxWidth = wrapperMaxWidth == '' ? '' : `${wrapperMaxWidth}px`;
   window.setTimeout(() => cartBox.style.display = 'none', 300);
   html.style.overflow = 'visible';
   if (backLink) {
      backLink.style.zIndex = '51';
   }
   cartBox.classList.remove('header__cart--active');
}
async function addCards(cart) {
   cardsWrapper.innerHTML = '';
   for (const productUid in cart) {
      if (Object.hasOwnProperty.call(cart, productUid)) {
         try {
            const productData = cart[productUid];

            const productSnapshot = await getDoc(doc(db, 'products', productUid));
            const product = productSnapshot.data();
            products[productUid] = product;

            const card = createCard(product, productData, productUid);
            cardsWrapper.appendChild(card);

            const imgBlock = card.querySelector('.cart-card__img-block');
            imgBlock.style.background = typeProduct[product.base.type].bg_color;

            const crissCross = card.querySelector('.cart-card__criss-cross');
            crissCross.addEventListener('click', removeCard);
            addFancToQuantityButtons(card);

            const autoshipCheckbox = card.querySelector('#cart-autoship');
            autoshipCheckbox.checked = productData.autoship;
            const selectBlock = card.querySelector('.cart-autoship__select-block');
            isChectedAutoship();
            autoshipCheckbox.addEventListener('change', () => {
               isChectedAutoship();
               pressingTime = Date.now();
               runSaveCart();
            });
            function isChectedAutoship() {
               selectBlock.classList.toggle('cart-autoship__select-block--not-active', !autoshipCheckbox.checked);
               cart[productUid].autoship = autoshipCheckbox.checked ? true : false;
            }

            const selectHeader = card.querySelector('.cart-autoship__select-header');
            selectHeader.addEventListener('click', () => useSelect(card, autoshipCheckbox, selectBlock, productUid))
         } catch (error) {
            console.log(error);
         }
      }
   }
}

function useSelect(card, autoshipCheckbox, selectBlock, productUid) {
   if (!autoshipCheckbox.checked) {
      return
   }
   const selectList = card.querySelector('.cart-autoship__select-list');
   const selectArrow = card.querySelector('.cart-autoship__select-arrow');

   if (selectList.classList.contains('cart-autoship__select-list--not-show')) {
      selectList.classList.remove('cart-autoship__select-list--not-show');
      selectArrow.classList.add('cart-autoship__select-arrow--open-list');
      selectList.addEventListener('click', selectOption);
      document.addEventListener('click', closeSelect);
   } else {
      selectList.classList.add('cart-autoship__select-list--not-show');
      selectArrow.classList.remove('cart-autoship__select-arrow--open-list');
      selectList.removeEventListener('click', selectOption);
      document.removeEventListener('click', closeSelect);
   }
   pressingTime = Date.now();
   runSaveCart();

   function closeSelect(e) {
      if (!selectBlock.contains(e.target) && selectBlock != e.target) {
         selectList.classList.add('cart-autoship__select-list--not-show');
         selectArrow.classList.remove('cart-autoship__select-arrow--open-list');
         selectList.removeEventListener('click', selectOption);
         document.removeEventListener('click', closeSelect);
      }
   }

   const selectHeaderText = card.querySelector('.cart-autoship__select-header-text');
   const selectItems = card.querySelectorAll('.cart-autoship__select-item');
   function selectOption(e) {
      selectItems.forEach((item) => {
         if (e.target == item) {
            selectHeaderText.innerHTML = item.innerHTML;
            cart[productUid].autoshipPeriodicity = item.innerHTML;
            selectItems.forEach(item => item.classList.remove('cart-autoship__select-item--active'));
            item.classList.add('cart-autoship__select-item--active');
            selectList.classList.add('cart-autoship__select-list--not-show');
            selectArrow.classList.remove('cart-autoship__select-arrow--open-list');
            selectList.removeEventListener('click', selectOption);
         }
      })
   }
   changeSlectListPosition(selectList, cards,);
}

function removeCard() {
   const cardUid = this.dataset.uid;
   delete cart[cardUid];
   submitCart();
   const cardForDel = document.getElementById(cardUid);
   cardForDel.remove();
   calcAmount();
   pressingTime = Date.now();
   runSaveCart();
}

function addFancToQuantityButtons(card) {
   const cartCardMinus = card.querySelector('.cart-card__quantity-choice-minus-block');
   const cartCardPlus = card.querySelector('.cart-card__quantity-choice-plus-block');

   cartCardMinus.addEventListener('click', function () {
      pressingTime = Date.now();
      updateQuantity.call(this, -1, card);
      //saveCart();
      makeDefaultCountBtn.call(this);
      runSaveCart();
   });

   cartCardPlus.addEventListener('click', function () {
      pressingTime = Date.now();
      updateQuantity.call(this, 1, card);
      makeDefaultCountBtn.call(this);
      runSaveCart();
   });

   function makeDefaultCountBtn() {
      cartCardMinus.classList.toggle('cart-card__quantity-choice-minus-block--not-active', +cart[this.dataset.uid].count === 1);
      cartCardPlus.classList.toggle('cart-card__quantity-choice-plus-block--not-active', +cart[this.dataset.uid].count === maxQuantity);
   }
}

function updateQuantity(change, card) {
   cart[this.dataset.uid].count += change;
   const count = card.querySelector('.cart-card__quantity-choice-out-block');

   if (cart[this.dataset.uid].count < 1) {
      cart[this.dataset.uid].count = 1;
   } else if (cart[this.dataset.uid].count > maxQuantity) {
      cart[this.dataset.uid].count = maxQuantity;
   }
   count.innerHTML = cart[this.dataset.uid].count;

   const price = card.querySelector('.cart-card__price');
   price.innerHTML = `$${(products[this.dataset.uid].base.price * +cart[this.dataset.uid].count).toFixed(2)}`;
   const salePrice = card.querySelector('.cart-card__sale-price');
   salePrice.innerHTML = `$${(products[this.dataset.uid].base.sale * products[this.dataset.uid].base.price / 100 * +cart[this.dataset.uid].count).toFixed(2)}`;
   calcAmount();
}

function runSaveCart() {
   clearTimeout(timerId);
   timerId = setTimeout(saveCart, 3000);
}

async function saveCart() {
   if (Date.now() - pressingTime > 2500) {
      console.log('Save');

      if (localCurrentUser) {
         try {
            await updateDoc(doc(db, 'users', localCurrentUser.uid), { cart: cart });
            iconCart.classList.toggle('header__cart-icon--not-empty', Object.keys(cart).length);
         } catch (error) {
            console.log(error);
         }
         return
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      iconCart.classList.toggle('header__cart-icon--not-empty', Object.keys(cart).length);
      submitCart();
   }
}

function createCard(product, productData, productUid) {
   const cardInner = `<div class="cart-card__img-block">
     <div class="cart-card__img-wrapper">
       <div>
         <picture>
            <source srcset="${product.base.webP}" type="image/webp">
            <img  class="cart-card__img" src="${product.base.png}" alt="${product.base.name}">
         </picture>
       </div>
     </div>
   </div>
   <div class="cart-card__content">
     <div class="cart-card__title-block">
       <a href="product.html?id=${productUid}" class="cart-card__title">${product.base.name}</a>
       <div class="cart-card__criss-cross"  data-uid="${productUid}">
       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
         <path d="M1 13L13 0.999998" stroke="#C7C7C7" stroke-width="2" />
         <path d="M13 13L1 0.999999" stroke="#C7C7C7" stroke-width="2" />
       </svg>
       </div>
     </div>
     <div class="cart-card__price-block">
       <div class="cart-card__quantity-choice">
         <div class="cart-card__quantity-choice-minus-block ${+productData.count == 1 ? 'cart-card__quantity-choice-minus-block--not-active' : ''}"  data-uid="${productUid}">
           <img src="img/product-card/minus.svg" alt="Minus" />
         </div>
         <div class="cart-card__quantity-choice-out-block">${productData.count}</div>
         <div class="cart-card__quantity-choice-plus-block  ${+productData.count == maxQuantity ? 'cart-card__quantity-choice-plus-block--not-active' : ''}" data-uid="${productUid}">
           <img src="img/product-card/plus.svg" alt="Plus" />
         </div>
       </div>
       <div class="cart-card__price-box">
       <div class="cart-card__price${product.base.sale != '' ? ' cart-card__price--text--strikethrough' : ''}">$${(product.base.price * productData.count).toFixed(2)}</div>
       <div class="cart-card__sale-price${product.base.sale == '' ? ' cart-card__sale-price--not-show' : ''}">$${(product.base.price * productData.count * product.base.sale / 100).toFixed(2)}</div>
       </div>
     </div>
     <div class="cart-autoship">
     <div class="cart-autoship__checkbox">
       <label for="cart-autoship" class="cart-autoship__checkbox-label">
         <input type="checkbox" name="cart-autoship" id="cart-autoship" class="cart-autoship__checkbox-input"  data-uid="${productUid}"/>
       </label>
     </div>
       <div class="cart-autoship__select-block cart-autoship__select-block--not-active">
         <div class="cart-autoship__start-label">Autoship every</div>
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
     </div>
   </div>`;
   const card = document.createElement('div');
   card.id = productUid;
   card.classList.add('cart__card', 'cart-card');
   card.innerHTML = cardInner;
   return card
}
const btn = document.querySelector('.cart__btn');

function submitCart() {
   if (!Object.keys(cart).length) {
      btn.style.display = 'none';
   } else {
      btn.style.display = 'block';
   }
}

btn.addEventListener('click', () => location.assign('plase-order.html'));
