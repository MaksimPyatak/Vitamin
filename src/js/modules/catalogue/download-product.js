import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db, } from "../firebase.js";

const productsBloc = document.querySelector('.products__products-block');
try {
   const productsType = await getDoc(doc(db, 'constData', 'typeProduct'));
   const products = await getDocs(collection(db, 'products'));
   products.forEach((doc) => {
      const data = doc.data().base;
      const card = document.createElement('a');
      card.href = `product.html#${doc.id}`
      card.classList.add('product-card');
      card.innerHTML = `
      <div class="product-card__sale-box ${data.sale == '' ? 'product-card__sale-box--dispaly--none' : ''}">
        <div>-${data.sale}%</div>
      </div>
      <div class="product-card__img-block">
        <div class="product-card__wrapper-img">
        <picture>
        <source srcset="${data.webP}" type="image/webp">
        <img src="${data.png}" alt="${data.name}">
        </picture>
        </div>
      </div>
      <div class="product-card__content">
        <div class="product-card__info-block">
          <div class="product-card__type product-card__type--color--@@type" style="color:${productsType.data()[data.type].text_color}">${productsType.data()[data.type].name}</div>
          <div class="product-card__title">${data.name}</div>
        </div>
        <div class="product-card__prise-block">
          <div class="product-card__prise ${data.sale != '' ? 'product-card__prise--text--strikethrough' : ''}">${data.price}</div>
          <div class="product-card__sale-prise ${data.sale == '' ? 'product-card__sale-prise--dispaly--none' : ''}">${data.sale_price}</div>
        </div>
      </div>`;
      productsBloc.appendChild(card);
   })
} catch (error) {
   console.log(error);
}