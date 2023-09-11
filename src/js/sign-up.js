import { ClassToggler, Validator } from "./utilits/classes.js";

import "./modules/sign-up/add-file-name.js";

const registrationTabs = new ClassToggler("tabs", 'tabs__tab', "add-file");
registrationTabs.addListener();

const user = {};
const form = document.forms.sign_up;
const elForm = form.elements;
let isValidForm;//!!!!!!!!!!!!!!!!
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.sign-up__submit');
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
      user.email = elForm.email.value;
      user.first_name = elForm.first.value;
      user.last_name = elForm.last.value;
      user.password = elForm.password.value;
      user.filePath = elForm.file.path;
      user.wholesale = !elForm.file.disabled;

   }
   submitBtn.disabled = true;
   //async request
   console.log(user);

   submitBtn.disabled = false;
   //form.reset();//Коли очищати 
}