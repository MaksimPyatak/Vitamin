import { getDoc, doc } from "firebase/firestore";
import { db, } from "../modules/firebase.js";


export function validationNumberInput(numberInput, maxLength,) {
   numberInput.addEventListener("input", function () {
      const sanitizedValue = this.value.replace(/\D/g, "");
      const firstThreeDigits = sanitizedValue.slice(0, 3);
      const restOfTheDigits = sanitizedValue.slice(3, maxLength);
      const formattedValue = restOfTheDigits.length > 0 ? `${firstThreeDigits} ${restOfTheDigits}` : firstThreeDigits;
      this.value = formattedValue;
   });
}

export function editPhone(numberInput) {
   numberInput.addEventListener("input", function () {
      const sanitizedValue = this.value.replace(/\D/g, "");
      const firstDigit = sanitizedValue.slice(0, 1);
      const secondThreeDigits = sanitizedValue.slice(1, 4);
      const thirdThreeDigits = sanitizedValue.slice(4, 7);
      const fourthTwoDigits = sanitizedValue.slice(7, 9);
      const lastTwoDigits = sanitizedValue.slice(9, 11);
      let formattedValue = `${firstDigit}`;
      if (secondThreeDigits.length > 0) {
         formattedValue += ` ${secondThreeDigits}`;
      }
      if (thirdThreeDigits.length > 0) {
         formattedValue += ` ${thirdThreeDigits}`;
      }
      if (fourthTwoDigits.length > 0) {
         formattedValue += ` ${fourthTwoDigits}`;
      }
      if (lastTwoDigits.length > 0) {
         formattedValue += ` ${lastTwoDigits}`;
      }
      this.value = formattedValue;
   });
}

export function editNumberCard(numberCardInput) {
   numberCardInput.addEventListener("input", function () {
      const sanitizedValue = this.value.replace(/\D/g, "");
      const firstDigit = sanitizedValue.slice(0, 4);
      const secondThreeDigits = sanitizedValue.slice(4, 8);
      const thirdThreeDigits = sanitizedValue.slice(8, 12);
      const lastTwoDigits = sanitizedValue.slice(12, 16);
      let formattedValue = `${firstDigit}`;
      if (secondThreeDigits.length > 0) {
         formattedValue += ` ${secondThreeDigits}`;
      }
      if (thirdThreeDigits.length > 0) {
         formattedValue += ` ${thirdThreeDigits}`;
      }
      if (lastTwoDigits.length > 0) {
         formattedValue += ` ${lastTwoDigits}`;
      }
      this.value = formattedValue;
   });
}
export function editExpiration(expirationInput) {
   expirationInput.addEventListener("input", function () {
      const sanitizedValue = this.value.replace(/\D/g, "");
      const firstDigit = sanitizedValue.slice(0, 2);
      const lastTwoDigits = sanitizedValue.slice(2, 4);
      let formattedValue = `${firstDigit}`;
      if (lastTwoDigits.length > 0) {
         formattedValue += `/${lastTwoDigits}`;
      }
      this.value = formattedValue;
   });
}
export function editCvc(cvcInput) {
   cvcInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 3);
   });
}
export function adjustOptionsListPosition(optionsList, upwardsClass) {
   const windowHeight = window.innerHeight;
   const optionsListHeight = optionsList.clientHeight;
   const optionsListOffsetTop = optionsList.getBoundingClientRect().top;
   if (windowHeight - optionsListOffsetTop < optionsListHeight) {
      optionsList.classList.add(upwardsClass);
   } else {
      optionsList.classList.remove(upwardsClass);
   }
}

export function showDawnloadInfoBlock(mesadge) {
   const downloadInfoBlock = document.querySelector('.header__download-info-block');
   if (mesadge) {
      downloadInfoBlock.innerHTML = mesadge;
   }
   downloadInfoBlock.classList.remove('download-info-block--display--none');
   window.setTimeout(() => downloadInfoBlock.classList.add('download-info-block--display--none'), 2000);
}

//??????!!!!
export function selectItem(target, itemClass, activeItemClass) {
   if (target.classList.contains(itemClass) && target.classList.contains(activeItemClass)) {
      return
   } else {
      return true
   }
}

export function renderFilteredCards(products, parentElement, productsType) {
   products.forEach((data) => {
      const card = renderCard(data, productsType, data.id);
      parentElement.appendChild(card);
   })
}
export function productsFilter(products, keyParam, valueParam) {
   const filterProducts = [];
   products.forEach((doc) => {
      const data = doc.data().base;
      if (data[keyParam] == valueParam) {
         data.id = doc.id;
         filterProducts.push(data);
      }
   })
   return filterProducts
}
export function renderCard(data, productsType, id) {
   const card = document.createElement('a');
   card.href = `product.html?id=${id}`
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
       <div class="product-card__prise ${data.sale != '' ? 'product-card__prise--text--strikethrough' : ''}">$${data.price}</div>
       <div class="product-card__sale-prise ${data.sale == '' ? 'product-card__sale-prise--display--none' : ''}">$${(data.sale * data.price / 100).toFixed(2)}</div>
     </div>
   </div>`;
   return card
}
export function changeBackgrounHeader(changedLogo) {
   window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
         header.classList.add('header--active');
         if (changedLogo) {
            changeLogoOfHeader(true);
         }
      } else {
         header.classList.remove('header--active');
         if (changedLogo) {
            changeLogoOfHeader(false);
         }
      }
   })
}

export function changeLogoOfHeader(remove) {
   const logo = document.querySelector('.header__logo');
   if (remove) {
      logo.classList.remove('header__logo--color--white');
   } else {
      logo.classList.add('header__logo--color--white');
   }
}

export async function checkCart() {
   let cart = {};
   const localCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
   try {
      if (localCurrentUser) {
         const snapshotCurrentUser = await getDoc(doc(db, 'users', localCurrentUser.uid));
         const currentUserData = snapshotCurrentUser.data();
         if (currentUserData && currentUserData.cart) {
            cart = currentUserData.cart;
         }
      } else {
         const cartData = localStorage.getItem('cart');
         if (cartData) {
            cart = JSON.parse(cartData);
         }
      }
   } catch (error) {
      console.log(error);
   }
   return cart;
}

export function getScrollbarWidth() {
   // Creating invisible container
   const outer = document.createElement('div')
   outer.style.visibility = 'hidden'
   outer.style.overflow = 'scroll' // forcing scrollbar to appear
   outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
   document.body.appendChild(outer)

   // Creating inner element and placing it in the container
   const inner = document.createElement('div')
   outer.appendChild(inner)

   // Calculating difference between container's full width and the child width
   const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
   // Removing temporary elements from the DOM
   outer.parentNode.removeChild(outer)

   return scrollbarWidth
}