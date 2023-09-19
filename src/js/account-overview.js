import "./modules/select.js";
import { Validator } from "./utilits/classes.js";
import { validationNumberInput, editPhone } from "./utilits/function.js";

const ZIP_LENGTH = 6;

const userProfile = {
   uid: '',
   email: '',
   first_name: '',
   last_name: '',
   password: '',
   file: {},
   wholesale: '',
};

const form = document.forms.overview;
const elForm = form.elements;
const zipNumberInput = elForm.zip;
const phoneInput = elForm.phone;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.form__submit');
const body = document.querySelector('body');
regValidator.blurValidation();
validationNumberInput(zipNumberInput, ZIP_LENGTH);
editPhone(phoneInput);

for (let i = 0; i < form.elements.length; i++) {
   const element = form.elements[i];
   element.addEventListener('input', validationForBtn);
}
function validationForBtn() {
   if (regValidator.backgroundValdation()) {
      submitBtn.classListNaNpxove('no-active-button');
   } else {
      submitBtn.classList.add('no-active-button');
   }
}
form.addEventListener('submit', submitFormHandler);

function submitFormHandler(event) {
   event.preventDefault();
   if (regValidator.validation()) {
      console.log('valid');
   }
}