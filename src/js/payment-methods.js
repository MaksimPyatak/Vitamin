import "./modules/cart.js";
import "./modules/burger-menu.js";
import { editNumberCard, editExpiration, editCvc } from "./utilits/function.js";
import { Validator } from "./utilits/classes.js";
import { db, signOutFunc, returnAuthUser, } from "./modules/firebase.js";
import { doc, getDoc, setDoc, } from "firebase/firestore";
import { changeBackgrounHeader } from "./utilits/function.js";

const cardNumber = document.querySelector('#card_number');
editNumberCard(cardNumber);
const cardExpiration = document.querySelector('#card_expiration');
editExpiration(cardExpiration);
const cardCvc = document.querySelector('#card_cvc')
editCvc(cardCvc);
const form = document.forms.payment_form;
const elForm = form.elements;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.form__submit');
const body = document.querySelector('body');
const downloadInfoBlock = document.querySelector('.header__download-info-block');
const signOutLink = document.querySelectorAll('.item__sign-out');

let userId;
let userProfile = {
   payment: {
      card_number: '',
      card_expiration: '',
      card_cvc: '',
   }
};

returnAuthUser()
   .then((result) => userId = result.uid)
   .then(async () => {
      const docRef = doc(db, 'users', userId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
         if (docSnapshot.data().payment) {
            userProfile.payment = docSnapshot.data().payment;
         }
      } else {
         console.log('Документ не існує');
      }
   })
   .then(() => {
      for (let i = 0; i < elForm.length; i++) {
         const element = elForm[i];
         if (userProfile.payment) {
            if (userProfile.payment[element.name]) {
               element.value = userProfile.payment[element.name];
            }
         }
      }
   })
//.catch((error) => console.log(error))

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
   if (!regValidator.validation()) {
      return
   }
   userProfile.payment.card_number = elForm.card_number.value;
   userProfile.payment.card_expiration = elForm.card_expiration.value;
   userProfile.payment.card_cvc = elForm.card_cvc.value;
   submitBtn.classList.add('no-active-button');
   submitBtn.disabled = true;
   body.style.cursor = 'wait';
   submitBtn.style.cursor = 'wait';
   try {
      await setDoc(doc(db, "users", userId), userProfile, { merge: true });
      submitBtn.classList.remove('no-active-button')
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
      body.style.cursor = 'auto';
      showDawnloadInfoBlock();
   } catch (error) {
      submitBtn.classList.remove('no-active-button')
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
      body.style.cursor = 'auto';
      console.log(error.message);
      //regValidator.isError(error.message)
   }
}

function showDawnloadInfoBlock() {
   downloadInfoBlock.classList.remove('download-info-block--display--none');
   window.setTimeout(() => downloadInfoBlock.classList.add('download-info-block--display--none'), 2000);
}

signOutLink.forEach((item) => item.addEventListener('click', signOutFunc));

changeBackgrounHeader();