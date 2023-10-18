import "./modules/cart.js";
import "./modules/burger-menu.js";
import { Validator } from "./utilits/classes.js";
import { signOutFunc, auth, } from "./modules/firebase.js";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { changeBackgrounHeader } from "./utilits/function.js";

const form = document.forms.change_password;
const elForm = form.elements;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.form__submit');
const body = document.querySelector('body');
const downloadInfoBlock = document.querySelector('.header__download-info-block');
const signOutLink = document.querySelector('.item__sign-out');

let userId;
let userProfile = {
   account_overview: {}
};

regValidator.blurValidation();

for (let i = 0; i < form.elements.length; i++) {
   const element = form.elements[i];
   element.addEventListener('input', validationForBtn);
}
function validationForBtn() {
   if (regValidator.backgroundValdation()) {
      submitBtn.classList.remove('form__submit--active--false');
   } else {
      submitBtn.classList.add('form__submit--active--false');
   }
}
form.addEventListener('submit', submitFormHandler);

async function submitFormHandler(event) {
   event.preventDefault();
   if (!regValidator.validation()) {
      return
   }

   submitBtn.classList.add('form__submit--active--false');
   submitBtn.disabled = true;
   body.style.cursor = 'wait';
   submitBtn.style.cursor = 'wait';
   try {
      const userCredential = await signInWithEmailAndPassword(auth, auth.currentUser.email, elForm.current_password.value);
      console.log(userCredential);
      await updatePassword(userCredential.user, elForm.new_password.value);

      submitBtn.classList.remove('form__submit--active--false')
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
      body.style.cursor = 'auto';
      showDawnloadInfoBlock();
   } catch (error) {
      submitBtn.classList.remove('form__submit--active--false')
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
      body.style.cursor = 'auto';
      console.log(error);
   }
}

function showDawnloadInfoBlock() {
   downloadInfoBlock.classList.remove('download-info-block--display--none');
   window.setTimeout(() => downloadInfoBlock.classList.add('download-info-block--display--none'), 2000);
}

signOutLink.addEventListener('click', signOutFunc);

changeBackgrounHeader();