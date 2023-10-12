import "./modules/cart.js";
import { Validator } from "./utilits/classes.js";
import { changeBackgrounHeader } from "./utilits/function.js";

const form = document.forms.sign_in;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.recover__submit');

regValidator.blurValidation();

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
function submitFormHandler(event) {
   event.preventDefault();

   if (regValidator.validation()) {
      try {
         submitBtn.classList.add('no-active-button');
         submitBtn.disabled = true;
         submitBtn.style.cursor = 'not-allowed';

         window.location.replace("subscriptions.html")
      } catch (error) {
         submitBtn.classList.remove('no-active-button')
         submitBtn.disabled = false;
         submitBtn.style.cursor = 'pointer';
         console.log(error);
      }
   }
}

changeBackgrounHeader();