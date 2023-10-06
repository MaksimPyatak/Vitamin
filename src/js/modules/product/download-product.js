import { getDoc, doc } from "firebase/firestore";
import { db, } from "../firebase.js";
import { updateQuantity } from "./add-to-cart.js";

const locationSearchObj = new URLSearchParams(window.location.search);
const productId = locationSearchObj.get('id');

const price = document.querySelector('.add-to-cart__price');
const salePrice = document.querySelector('.add-to-cart__sale-price');
const saleBlock = document.querySelector('.add-to-cart__sale-block');

let productsType = {};
let product = {};
let medForm = {}

try {
   const snapshotProdType = await getDoc(doc(db, 'constData', 'typeProduct'));
   productsType = snapshotProdType.data();

   const snapshotProd = await getDoc(doc(db, 'products', productId));
   product = snapshotProd.data();

   const snapshotMedForm = await getDoc(doc(db, 'constData', 'med_form'));
   medForm = snapshotMedForm.data();

   console.log(product);
   console.log(productsType);

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

   const containerIcon = document.querySelector('.count-block__container-icon');
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

const priceToCount = product.base.sale == !!'' ? product.base.price : (product.base.sale * product.base.price / 100).toFixed(2);
const elementForShowCount = product.base.sale == !!'' ? price : salePrice;

minus.addEventListener('click', () => {
   updateQuantity(-1, minus, plus, maxQuantity, priceToCount, elementForShowCount);
});

plus.addEventListener('click', () => {
   updateQuantity(1, minus, plus, maxQuantity, priceToCount, elementForShowCount);
});