//import { signOutFunc } from "../modules/firebase.js";

export function validationNumberInput(numberInput, maxLength,) {
   //input.addEventListener('input', function () {
   //   const inputValue = this.value.toString();
   //   console.log(inputValue);
   //   console.log(inputValue.toLowerCase().search(/^\d{3}\s(?:\D*\d{3}\s*)*$/));
   //   if (inputValue.length > maxLength) {
   //      this.value = inputValue.slice(0, maxLength);
   //   } else if (inputValue.toLowerCase().search(/[^0-9]/g) >= 0 && inputValue.length < 4) {
   //      console.log('reg1');
   //      this.value = this.dataset.previousValue || '';
   //   } else if (inputValue.length == 4 && inputValue[3] != ' ' && inputValue.toLowerCase().search(/[0-9]{3}[0-9]/g) >= 0) {
   //      console.log(' - ');
   //      this.value = inputValue.substring(0, 3) + ' ' + inputValue.substring(3);
   //   } else if (inputValue.toLowerCase().search(/[0-9]{3}\s[^0-9]{1,3}/g) < 0 && inputValue.length > 3) { //&& inputValue.toLowerCase().search(/[^0-9]{3}\s[^0-9]/g) <= 0
   //      console.log('reg2');
   //      this.value = this.dataset.previousValue || '';
   //      //} else if (inputValue.length == 4 && inputValue.toLowerCase().search(/[0-9]{3}[^0-9]/g)) {
   //      //   console.log(' - ');
   //      //   this.value = inputValue.substring(0, 3) + ' ' + inputValue.substring(3);
   //   } else {
   //      this.dataset.previousValue = inputValue;
   //   }
   //})
   //const numberInput = document.getElementById("numberInput");

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
   card.href = `product.html#${id}`
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
   return card
}

//!!!!Потрібна?
//export async function determineAuthState(link) {
//   try {
//      const user = await signOut(auth);
//      return user
//   } catch (error) {
//      console.log(error);
//   }
//}