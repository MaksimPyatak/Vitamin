import { getDoc, doc, setDoc } from "firebase/firestore";
import { db, } from "../firebase.js";
import { showDawnloadInfoBlock, checkCart, } from "../../utilits/function.js";
import { whichEmptyCart } from "../cart.js";
//import { updateQuantity } from "./add-to-cart.js";

window.addEventListener('load', checkCart);

const locationSearchObj = new URLSearchParams(window.location.search);
//const productId = locationSearchObj.get('id');

const price = document.querySelector('.add-to-cart__price');
const salePrice = document.querySelector('.add-to-cart__sale-price');
const saleBlock = document.querySelector('.add-to-cart__sale-block');
const quantityOutBlock = document.querySelector('.quantity-choice__out-block');
const autoshipCheckbox = document.querySelector('#autoship');
const selectBlock = document.querySelector('.autoship__select-block');
const selectHeader = document.querySelector('.autoship__select-header');
const selectList = document.querySelector('.autoship__select-list');
const selectArrow = document.querySelector('.autoship__select-arrow');
const selectItems = document.querySelectorAll('.autoship__select-item');
const selectHeaderText = document.querySelector('.autoship__select-header-text');

let cart = await checkCart();
let productsType = {};
let product = {};
let medForm = {};
//let currentUser = {};
const productForCart = {
   id: locationSearchObj.get('id'),
   count: 1,//parseInt(quantityOutBlock.innerHTML)
   autoship: autoshipCheckbox.checked,
   autoshipPeriodicity: +selectHeaderText.innerHTML,
}

try {
   const snapshotProdType = await getDoc(doc(db, 'constData', 'typeProduct'));
   productsType = snapshotProdType.data();

   const snapshotProd = await getDoc(doc(db, 'products', productForCart.id));
   product = snapshotProd.data();

   const snapshotMedForm = await getDoc(doc(db, 'constData', 'med_form'));
   medForm = snapshotMedForm.data();

   const imgBlock = document.querySelector('.base__img-block');
   imgBlock.style.background = productsType[product.base.type].bg_color;

   const basePngImg = document.querySelector('.base__png-img');
   basePngImg.src = product.base.png;
   basePngImg.alt = product.base.name;

   const baseWebpImg = document.querySelector('.base__webp-img');
   baseWebpImg.src = product.base.webP;

   const prodType = document.querySelector('.base__product-type');
   prodType.innerHTML = productsType[product.base.type].name;
   prodType.style.color = productsType[product.base.type].text_color;

   const prodName = document.querySelector('.base__product-title');
   prodName.innerHTML = product.base.name;

   const containerIcon = document.querySelector('.count-block__package-icon');
   containerIcon.src = medForm[product.full.med_form];

   const amountInContainer = document.querySelector('.count-block__amount-in-container');
   amountInContainer.innerHTML = product.full.description_med_form;

   const dosage = document.querySelector('.count-block__dosage');
   dosage.innerHTML = product.full.quantity_in_package;

   price.innerHTML = `$${product.base.price}`;
   product.base.sale != !!'' ? price.classList.add('add-to-cart__price--text--strikethrough') : price.classList.remove('add-to-cart__price--text--strikethrough');

   product.base.sale == !!'' ? saleBlock.classList.add('add-to-cart__sale-block--not-show') : saleBlock.classList.remove('add-to-cart__sale-block--not-show');
   const sale = document.querySelector('.add-to-cart__sale');
   sale.innerHTML = `-${product.base.sale}%`;

   product.base.sale == !!'' ? salePrice.classList.add('add-to-cart__sale-price--not-show') : salePrice.classList.remove('add-to-cart__sale-price--not-show');
   salePrice.innerHTML = `$${(product.base.sale * product.base.price / 100).toFixed(2)}`;

   const descriptionText = document.querySelector('.base__description-text');
   descriptionText.innerHTML = product.full.description_text;

   const descriptionList = document.querySelector('.base__description-list');
   descriptionList.innerHTML = product.full.description_list.reduce((accum, element) => accum + `<li class="base__description-item"><span></span><div>${element}</div></li>`, '');

   const importantInfo = document.querySelector('.base__important-info');
   for (const key in product.full.important) {
      importantInfo.insertAdjacentHTML('beforeend',
         `<div class="important-info__item-block">
        <div class="important-info__item-block-title">${key}</div>
        <div class="important-info__item-block-content">${product.full.important[key]}</div>
      </div>`
      )
   }
} catch (error) {
   console.log(error);
}

const minus = document.querySelector('.quantity-choice__minus-block');
const plus = document.querySelector('.quantity-choice__plus-block');
const maxQuantity = 10;

//const priceToCount = product.base.sale == !!'' ? product.base.price : (product.base.sale * product.base.price / 100).toFixed(2);
//const elementForShowCount = product.base.sale == !!'' ? price : salePrice;

minus.addEventListener('click', () => {
   updateQuantity(-1);
});

plus.addEventListener('click', () => {
   updateQuantity(1);
});

export function updateQuantity(change) {
   productForCart.count += change;

   if (productForCart.count < 1) {
      productForCart.count = 1;
   } else if (productForCart.count > maxQuantity) {
      productForCart.count = maxQuantity;
   }

   quantityOutBlock.innerHTML = productForCart.count;
   price.innerHTML = `$${(product.base.price * +productForCart.count).toFixed(2)}`;
   salePrice.innerHTML = `$${((product.base.sale * product.base.price / 100).toFixed(2) * +productForCart.count).toFixed(2)}`;
   minus.classList.toggle('quantity-choice__minus-block--not-active', productForCart.count === 1);
   plus.classList.toggle('quantity-choice__plus-block--not-active', productForCart.count === maxQuantity);
}

autoshipCheckbox.addEventListener('change', () => {
   selectBlock.classList.toggle('autoship__select-block--not-active', !autoshipCheckbox.checked);
   productForCart.autoship = autoshipCheckbox.checked ? true : false;
});

selectHeader.addEventListener('click', () => {
   if (!autoshipCheckbox.checked) {
      return
   }
   if (selectList.classList.contains('autoship__select-list--not-show')) {
      selectList.classList.remove('autoship__select-list--not-show');
      selectArrow.classList.add('autoship__select-arrow--open-list');
      selectList.addEventListener('click', selectOption);
      document.addEventListener('click', closeSelect);
   } else {
      selectList.classList.add('autoship__select-list--not-show');
      selectArrow.classList.remove('autoship__select-arrow--open-list');
      selectList.removeEventListener('click', selectOption);
      document.removeEventListener('click', closeSelect);
   }
})

function closeSelect(e) {
   if (!selectBlock.contains(e.target) && selectBlock != e.target) {
      selectList.classList.add('autoship__select-list--not-show');
      selectArrow.classList.remove('autoship__select-arrow--open-list');
      selectList.removeEventListener('click', selectOption);
      document.removeEventListener('click', closeSelect);
   }
}

function selectOption(e) {
   selectItems.forEach((item) => {
      if (e.target == item) {
         selectHeaderText.innerHTML = item.innerHTML;
         productForCart.autoshipPeriodicity = item.innerHTML;
         console.log(productForCart);
         selectItems.forEach(item => item.classList.remove('autoship__select-item--active'));
         item.classList.add('autoship__select-item--active');
         selectList.classList.add('autoship__select-list--not-show');
         selectArrow.classList.remove('autoship__select-arrow--open-list');
         selectList.removeEventListener('click', selectOption);
      }
   })
}

const backLink = document.querySelector('.base__back-link');
const btnAddToCart = document.querySelector('.add-to-cart__btn');
btnAddToCart.addEventListener('click', addToCart)

async function addToCart() {
   if (cart[productForCart.id]) {
      cart[productForCart.id].count += productForCart.count;
      cart[productForCart.id].autoship = productForCart.autoship;
      cart[productForCart.id].autoshipPeriodicity = productForCart.autoshipPeriodicity;
   } else {
      cart[productForCart.id] = {};
      cart[productForCart.id].count = productForCart.count;
      cart[productForCart.id].autoship = productForCart.autoship;
      cart[productForCart.id].autoshipPeriodicity = productForCart.autoshipPeriodicity;
   }
   const zIndexValue = 1;
   const localCurrentUser = JSON.parse(localStorage.getItem('currentUser'));

   if (localCurrentUser) {
      try {
         await setDoc(doc(db, 'users', localCurrentUser.uid), { cart: cart }, { merge: true });
         whichEmptyCart();
         showDawnloadInfoBlock('Added to cart');
         backLink.style['z-index'] = 1;
         window.setTimeout(() => backLink.style['z-index'] = 51, 2000);
      } catch (error) {
         console.log(error);
      }
      return
   }
   localStorage.setItem('cart', JSON.stringify(cart));
   showDawnloadInfoBlock('Added to cart');
   backLink.style['z-index'] = zIndexValue;
   window.setTimeout(() => backLink.style['z-index'] = 51, 2000);
}