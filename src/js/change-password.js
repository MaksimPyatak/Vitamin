import { Validator } from "./utilits/classes.js";
import { db, signOutFunc, auth, returnAuthUser, userAuth } from "./modules/firebase.js";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, } from "firebase/firestore";
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

//returnAuthUser()
//   .then((result) => userId = result.uid)
//   .then(async () => {
//      const docRef = doc(db, 'users', userId);
//      const docSnapshot = await getDoc(docRef);
//      if (docSnapshot.exists()) {
//         userProfile.account_overview = docSnapshot.data().account_overview;
//      } else {
//         console.log('Документ не існує');
//      }
//   })
//   .then(() => {
//      for (let i = 0; i < elForm.length; i++) {
//         const element = elForm[i];
//         if (userProfile.payment[element.name] && !element.disabled && element.name != 'file') {
//            element.value = userProfile.payment[element.name];
//         }
//      }
//   })
//   .catch((error) => console.log(error))

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
   //userProfile.payment.card_number = elForm.card_number.value;
   //userProfile.payment.card_expiration = elForm.card_expiration.value;
   //userProfile.payment.card_cvc = elForm.card_cvc.value;
   //submitBtn.classList.add('form__submit--active--false');
   //submitBtn.disabled = true;
   //body.style.cursor = 'wait';
   //submitBtn.style.cursor = 'wait';
   //try {
   //   await setDoc(doc(db, "users", userId), userProfile, { merge: true });
   //   submitBtn.classList.remove('form__submit--active--false')
   //   submitBtn.disabled = false;
   //   submitBtn.style.cursor = 'pointer';
   //   body.style.cursor = 'auto';
   //   showDawnloadInfoBlock();
   //} catch (error) {
   //   submitBtn.classList.remove('form__submit--active--false')
   //   submitBtn.disabled = false;
   //   submitBtn.style.cursor = 'pointer';
   //   body.style.cursor = 'auto';
   //   console.log(error.message);
   //   //regValidator.isError(error.message)
   //}
}

function showDawnloadInfoBlock() {
   downloadInfoBlock.classList.remove('download-info-block--display--none');
   window.setTimeout(() => downloadInfoBlock.classList.add('download-info-block--display--none'), 2000);
}

signOutLink.addEventListener('click', signOutFunc);

changeBackgrounHeader();