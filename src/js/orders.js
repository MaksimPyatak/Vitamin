import "./modules/cart.js";
import "./modules/burger-menu.js";
import { db, signOutFunc, returnAuthUser, } from "./modules/firebase.js";
import { changeBackgrounHeader, checkCart, showDawnloadInfoBlock, } from "./utilits/function.js";
import { doc, getDoc, setDoc, } from "firebase/firestore";
import { Accordion } from "./utilits/classes.js";
import { whichEmptyCart } from "./modules/cart.js";


const signOutLink = document.querySelector('.item__sign-out');

signOutLink.addEventListener('click', signOutFunc);

changeBackgrounHeader();

const user = await returnAuthUser();
const userId = user.uid;
let orders = {};
let cart = {};
const localCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
document.addEventListener('DOMContentLoaded', async () => {
   cart = await checkCart();
});


try {
   const docSnapshot = await getDoc(doc(db, 'users', userId));
   if (docSnapshot.exists()) {
      orders = docSnapshot.data().orders;
   } else {
      console.log('Документ не існує');
   }
} catch (error) {
   console.log(error);
}

const ordersBlock = document.querySelector('.content__orders');

for (const orderId in orders) {
   if (Object.hasOwnProperty.call(orders, orderId)) {
      const order = orders[orderId];
      const orderCard = createOrderCard(order, orderId);
      ordersBlock.appendChild(orderCard);
      orderCard.addEventListener('load', new Accordion(orderCard));
      const productBlock = orderCard.querySelector('.order__products-card');//!!!
      createProductsCards(order);
      const btn = orderCard.querySelector('.order__btn');
      btn.addEventListener('click', (e) => addToCart(e, order))
   }
}
async function addToCart(e, order) {
   try {
      Object.keys(order.products).forEach((elem) => {
         if (cart[elem]) {
            cart[elem].count += 1;
         } else {
            cart[elem] = {
               autoship: false,
               autoshipPeriodicity: 30,
               count: 1,
            }
         }
      })
      await setDoc(doc(db, 'users', localCurrentUser.uid), { cart: cart }, { merge: true });
      await whichEmptyCart();
      showDawnloadInfoBlock('Added to cart');
   } catch (error) {
      console.log(error);
   }
}

function createOrderCard(order, orderId) {
   const date = getCastomFormatDate(orderId);
   const orderNumber = orderId.slice(-9, -4) + '-' + orderId.slice(-4);
   const cardInner = `
   <div class="order__header accordion__header">
      <div class="order__header-content">
         <div class="order__date-block">
            <div class="order__date">${date}</div>
            <div class="order__shipping">
               Shipping
            </div>
         </div>
         <div class="order__order-number">No ${orderNumber}</div>
      </div>
      <div class="order__arrow accordion__arrow">
         <svg xmlns="http://www.w3.org/2000/svg" width="15" height="9" viewBox="0 0 15 9" fill="none">
            <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.01714e-05 7.53624L1.44501 9L7.43948 2.92751L13.434 9L14.8789 7.53624L7.43948 8.87142e-08L6.01714e-05 7.53624Z" fill="black"/>
          </svg>
      </div>
   </div>
  <div class="order__content accordion__content">
      <div class="order__products-block">
      ${createProductsCards(order)}
      </div>
      <div class="order__footer">
         <div class="order__amount-block">
            <div class="order__amount-title">
            Order amount:
            </div>
            <div class="order__amount">$${(order.total).toFixed(2)}</div>
         </div>
         <button class="order__btn">Add to cart</button>
      </div>
  </div>`;
   const orderCard = document.createElement('div');
   orderCard.classList.add('content__order', 'order');
   orderCard.id = orderId;
   orderCard.innerHTML = cardInner;
   return orderCard
}

function createProductsCards(order) {
   let products = '';
   for (const productId in order.products) {
      if (Object.hasOwnProperty.call(order.products, productId)) {
         const product = order.products[productId];
         const productCard = createProductCart(product);
         products += productCard;
      }
   }
   return products
}

function createProductCart(product) {
   const cardInner = `<div class="order__product-card product-card">
   <div class="product-card__img-block" style="background: ${product.bg_color};">
      <picture>
         <source srcset="${product.webP}" type="image/webp" />
         <img src="${product.png}" alt="${product.name}" class="product-card__img" />
       </picture>
   </div>
      <div class="product-card__content">
         <div class="product-card__title-block">
            <div class="product-card__type" style="color: ${product.text_color};">${product.nameType}</div>
            <div class="product-card__title">${product.name}</div>
         </div>
         <div class="product-card__price">$${(+product.amount).toFixed(2)}</div>
      </div>
   </div>`;

   return cardInner
}

function getCastomFormatDate(timestamp) {
   const date = new Date(+timestamp);
   const options = { month: 'short', year: 'numeric' };
   const pathFormattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
   const formattedDate = `${date.getDate()} ${pathFormattedDate}`;
   return formattedDate
}