import { Validator } from "./utilits/classes.js";
import { changeBackgrounHeader } from "./utilits/function.js";

import "./modules/sign-up/add-file-name.js";
const form = document.forms.sign_up;
const elForm = form.elements;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.sign-up__submit');
form.elements.file.disabled = false;
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
      submitBtn.classList.add('no-active-button');
      submitBtn.disabled = true;
      submitBtn.style.cursor = 'not-allowed';
      window.location.replace("subscriptions.html")
   }
}

changeBackgrounHeader();