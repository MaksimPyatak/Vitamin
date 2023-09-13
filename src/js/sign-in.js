import { signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { Validator } from "./utilits/classes.js";
import { auth, showLoginError } from "./modules/firebase.js";

const form = document.forms.sign_in;
const elForm = form.elements;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.sign-in__submit');

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
async function submitFormHandler(event) {
   event.preventDefault();

   if (regValidator.validation()) {
      try {
         submitBtn.classList.add('no-active-button');
         submitBtn.disabled = true;
         submitBtn.style.cursor = 'not-allowed';
         const userCredential = await signInWithEmailAndPassword(auth, elForm.email.value, elForm.password.value);
         console.log(userCredential.user);
         window.location.replace("subscriptions.html")
      } catch (error) {
         submitBtn.classList.remove('no-active-button')
         submitBtn.disabled = false;
         submitBtn.style.cursor = 'pointer';
         console.log(error);
         //showLoginError(error);
         if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
            const message = `Wrong password. Try again.`;
            regValidator.isError(message, password)
         }
         else if (error.code == AuthErrorCodes.USER_DELETED) {
            const message = `Email not found. Try again.`;
            regValidator.isError(message, password)

         } else {
            console.log(error.message);
            regValidator.isError(error.message, password)
         }
      }
   }
}