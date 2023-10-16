import "./modules/select.js";

import { Validator, Accordion } from "./utilits/classes.js";
import { validationNumberInput, editPhone, changeBackgrounHeader, editNumberCard, editExpiration, editCvc } from "./utilits/function.js";
import { db, returnAuthUser, } from "./modules/firebase.js";
import { doc, getDoc, setDoc, } from "firebase/firestore";


//const downloadInfoBlock = document.querySelector('.header__download-info-block');
const accordionBlock = document.querySelector('.products-block');
const formWrapper = document.querySelector('.place-order__form');
const calcBlock = document.querySelector('.products-block__calc-box');
const form = document.forms['place-order-form'];
const elForm = form.elements;
const zipNumberInput = elForm.zip;
const phoneInput = elForm.phone;
const regValidator = new Validator(form);
const submitBtn = document.querySelector('.products-block__form-btn');
const productsBlock = document.querySelector('.products-block__products-box');
const body = document.querySelector('body');
const subtotalBox = document.querySelector('.products-block__costs--type--subtotal');
const discountBox = document.querySelector('.products-block__costs--type--discount');
const shippingBox = document.querySelector('.products-block__costs--type--shipping');
const totalCostsBox = document.querySelector('.products-block__total-costs');
const totalCostsTitleBox = document.querySelector('.products-block__drop-down-title-costs');

const cardNumber = document.querySelector('#card_number');
editNumberCard(cardNumber);
const cardExpiration = document.querySelector('#card_expiration');
editExpiration(cardExpiration);
const cardCvc = document.querySelector('#card_cvc')
editCvc(cardCvc);

const ZIP_LENGTH = 6;
const orderDate = Date.now();
const user = await returnAuthUser()
const userId = user.uid;
const userProfile = {};
const userProfileForUploud = {
   account_overview: {},
   payment: {},
   cart: {},
   orders: {
      [orderDate]: {
         products: {},
      },
   },
   subscriptions: {},
};
let typeProduct;
let subtotal = null;
let discount = null;
let shipping = 9.20;
let totalCosts = null;//!!!!

try {
   const docSnapshot = await getDoc(doc(db, 'users', userId));
   if (docSnapshot.exists()) {
      userProfile.personalData = docSnapshot.data().account_overview;
      Object.assign(userProfile.personalData, docSnapshot.data().payment);
      userProfileForUploud.cart = docSnapshot.data().cart;
      const typeProductSnapshot = await getDoc(doc(db, 'constData', 'typeProduct'));
      typeProduct = typeProductSnapshot.data();
      await renderCartCards(userProfileForUploud.cart);
      subtotalBox.innerHTML = `$${subtotal.toFixed(2)}`;
      discountBox.innerHTML = `-$${discount.toFixed(2)}`;
      shippingBox.innerHTML = `$${shipping}`;
      totalCostsBox.innerHTML = `$${(subtotal + shipping).toFixed(2)}`;
      totalCostsTitleBox.innerHTML = `$${(subtotal + shipping).toFixed(2)}`;
      userProfileForUploud.orders[orderDate].total = subtotal;
      //userProfileForUploud.orders.date = new Date();
      console.log(userProfileForUploud);
   } else {
      console.log('Документ не існує');
   }
} catch (error) {
   console.log(error);
}

async function renderCartCards(cart) {
   for (const productUid in cart) {
      if (Object.hasOwnProperty.call(cart, productUid)) {
         const productData = cart[productUid];

         const productSnapshot = await getDoc(doc(db, 'products', productUid));
         const product = productSnapshot.data();

         const card = createCard(product, productData, productUid);
         productsBlock.appendChild(card);

         const imgBlock = card.querySelector('.products-block__img-block');
         if (imgBlock) {
            imgBlock.style.background = typeProduct[product.base.type].bg_color;
         }
         let price = product.base.sale ? product.base.price * product.base.sale / 100 : product.base.price;
         subtotal += price * productData.count;
         discount += (product.base.price - price) * productData.count;
         saveProductDataForOrders(productUid, product, productData, price, typeProduct)
      }
   }
}

function saveProductDataForOrders(productUid, product, productData, price, typeProduct) {
   //userProfileForUploud.orders.products = {};
   userProfileForUploud.orders[orderDate].products[productUid] = {};
   userProfileForUploud.orders[orderDate].products[productUid].name = product.base.name;
   userProfileForUploud.orders[orderDate].products[productUid].count = productData.count;
   userProfileForUploud.orders[orderDate].products[productUid].amount = price;
   userProfileForUploud.orders[orderDate].products[productUid].text_color = typeProduct[product.base.type].text_color;
   userProfileForUploud.orders[orderDate].products[productUid].nameType = typeProduct[product.base.type].name;
   userProfileForUploud.orders[orderDate].products[productUid].bg_color = typeProduct[product.base.type].bg_color;
   userProfileForUploud.orders[orderDate].products[productUid].webP = product.base.webP;
   userProfileForUploud.orders[orderDate].products[productUid].png = product.base.png;
   if (productData.autoship) {
      userProfileForUploud.subscriptions[productUid] = {};
      userProfileForUploud.subscriptions[productUid].autoshipPeriodicity = productData.autoshipPeriodicity;
      userProfileForUploud.subscriptions[productUid].date = orderDate;
      userProfileForUploud.subscriptions[productUid].name = product.base.name;
      userProfileForUploud.subscriptions[productUid].count = productData.count;
      userProfileForUploud.subscriptions[productUid].amount = price;
      userProfileForUploud.subscriptions[productUid].text_color = typeProduct[product.base.type].text_color;
      userProfileForUploud.subscriptions[productUid].nameType = typeProduct[product.base.type].name;
      userProfileForUploud.subscriptions[productUid].bg_color = typeProduct[product.base.type].bg_color;
      userProfileForUploud.subscriptions[productUid].webP = product.base.webP;
      userProfileForUploud.subscriptions[productUid].png = product.base.png;
   }
}

function createCard(product, productData, productUid) {
   const price = (product.base.price * productData.count).toFixed(2);
   const salePrice = (product.base.price * productData.count * product.base.sale / 100).toFixed(2);
   const cardInner = `   <div class="products-block__img-block">
       <picture>
       <source srcset="${product.base.webP}" type="image/webp">
       <img  class="products-block__img" src="${product.base.png}" alt="${product.base.name}">      
       </picture>
   </div>
   <a href="product.html?id=${productUid}" class="products-block__title">
${productData.count} x ${product.base.name}
   </a>
   <div class="products-block__price-block">
      <div class="products-block__price${product.base.sale != '' ? ' products-block__price--text--strikethrough' : ''}">$${price}</div>
      <div class="products-block__sale-price${product.base.sale == '' ? ' products-block__sale-price--not-show' : ''}">$${salePrice}</div>
   </div> `
   const card = document.createElement('div');
   card.classList.add('products-block__product');
   card.innerHTML = cardInner;
   return card
}

for (let i = 0; i < elForm.length; i++) {
   const element = elForm[i];
   if (userProfile.personalData) {
      if (userProfile.personalData[element.name] && !element.disabled && element.name != 'file') {
         element.value = userProfile.personalData[element.name];
      }
      if (element.name == 'state') {
         element.dispatchEvent(new Event('dowload', { bubbles: true }));
      }
   }
}

new Accordion(accordionBlock);

window.addEventListener('load', moveBtn);
window.addEventListener('resize', moveBtn);

function moveBtn() {
   if (window.innerWidth < 769) {
      formWrapper.appendChild(submitBtn);
   } else {
      calcBlock.appendChild(submitBtn);
   }
}

regValidator.blurValidation(form);
validationForBtn();
validationNumberInput(zipNumberInput, ZIP_LENGTH);
editPhone(phoneInput);

for (let i = 0; i < form.elements.length; i++) {
   const element = form.elements[i];
   element.addEventListener('input', validationForBtn);
}
function validationForBtn() {
   if (regValidator.backgroundValdation()) {
      submitBtn.classList.remove('no-active-button');
   } else {
      submitBtn.classList.add('no-active-button');
   }
}
form.addEventListener('submit', submitFormHandler);

async function submitFormHandler(event) {
   event.preventDefault();
   if (!regValidator.validation()) {
      return
   }

   if (!userProfileForUploud.account_overview) {
      userProfileForUploud.account_overview = {};
   }
   if (!userProfileForUploud.payment) {
      userProfileForUploud.payment = {};
   }

   userProfileForUploud.account_overview.email = elForm.email.value;
   userProfileForUploud.account_overview.first = elForm.first.value;
   userProfileForUploud.account_overview.last = elForm.last.value;
   userProfileForUploud.account_overview.first_address = elForm.first_address.value;
   userProfileForUploud.account_overview.second_address = elForm.second_address.value;
   userProfileForUploud.account_overview.city = elForm.city.value;
   userProfileForUploud.account_overview.state = elForm.state.value;
   userProfileForUploud.account_overview.zip = elForm.zip.value;
   userProfileForUploud.account_overview.phone = elForm.phone.value;

   userProfileForUploud.payment.card_number = elForm.card_number.value;
   userProfileForUploud.payment.card_expiration = elForm.card_expiration.value;
   userProfileForUploud.payment.card_cvc = elForm.card_cvc.value;

   console.log(userProfileForUploud);

   userProfileForUploud.cart = {};

   submitBtn.classList.add('no-active-button');
   submitBtn.disabled = true;
   body.style.cursor = 'wait';
   submitBtn.style.cursor = 'wait';
   try {
      console.log(userProfileForUploud);
      await setDoc(doc(db, "users", userId), userProfileForUploud, { merge: true });
      submitBtn.classList.remove('no-active-button')
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
      body.style.cursor = 'auto';
      window.location.assign('order-placed.html')
   } catch (error) {
      submitBtn.classList.remove('no-active-button')
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
      body.style.cursor = 'auto';
      console.log(error);
      //regValidator.isError(error.message)
   }
}
function changePageState(disabled) {

}

changeBackgrounHeader();