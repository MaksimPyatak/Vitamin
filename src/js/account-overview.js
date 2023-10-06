import "./modules/select.js";
import "./modules/sign-up/add-file-name.js";

import { Validator } from "./utilits/classes.js";
import { validationNumberInput, editPhone } from "./utilits/function.js";
import { db, signOutFunc, returnAuthUser, } from "./modules/firebase.js";
import { doc, getDoc, setDoc, } from "firebase/firestore";
import { changeBackgrounHeader } from "./utilits/function.js";

const inputFile = document.querySelector('#file');
const fileWrapper = document.querySelector('#file-wrapper');
const fileInfo = document.querySelector('.add-file__info');
const downloadInfoBlock = document.querySelector('.header__download-info-block');
const signOutLink = document.querySelector('.item__sign-out');
const form = document.forms.overview;
const elForm = form.elements;
const zipNumberInput = elForm.zip;
const phoneInput = elForm.phone;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.form__submit');
const body = document.querySelector('body');

const ZIP_LENGTH = 6;

const user = await returnAuthUser()
const userId = user.uid;
const userProfile = {};

try {
   const docSnapshot = await getDoc(doc(db, 'users', userId));
   if (docSnapshot.exists()) {
      userProfile.account_overview = docSnapshot.data().account_overview;
   } else {
      console.log('Документ не існує');
   }
} catch (error) {
   console.log(error);
}
for (let i = 0; i < elForm.length; i++) {
   const element = elForm[i];
   if (userProfile.account_overview[element.name] && !element.disabled && element.name != 'file') {
      element.value = userProfile.account_overview[element.name];
   }
   if (userProfile.account_overview.wholesale) {
      fileWrapper.style.display = 'block';
      inputFile.setAttribute('data-isFile', true);
      inputFile.disabled = false;
      fileInfo.innerHTML = userProfile.account_overview.file.name;
   }
   if (element.name == 'state') {
      element.dispatchEvent(new Event('dowload', { bubbles: true }));
   }
}

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
//         if (userProfile.account_overview[element.name] && !element.disabled && element.name != 'file') {
//            element.value = userProfile.account_overview[element.name];
//         }
//         if (userProfile.account_overview.wholesale) {
//            fileWrapper.style.display = 'block';
//            inputFile.setAttribute('data-isFile', true);
//            inputFile.disabled = false;
//            fileInfo.innerHTML = userProfile.account_overview.file.name;
//         }
//         if (element.name == 'state') {
//            element.dispatchEvent(new Event('dowload', { bubbles: true }));
//         }
//      }
//   })
//   .catch((error) => console.log(error))

regValidator.blurValidation();
validationNumberInput(zipNumberInput, ZIP_LENGTH);
editPhone(phoneInput);

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

   userProfile.account_overview.email = elForm.email.value;
   userProfile.account_overview.first = elForm.first.value;
   userProfile.account_overview.last = elForm.last.value;
   userProfile.account_overview.first_address = elForm.first_address.value;
   userProfile.account_overview.second_address = elForm.second_address.value;
   userProfile.account_overview.city = elForm.city.value;
   userProfile.account_overview.state = elForm.state.value;
   userProfile.account_overview.zip = elForm.zip.value;
   userProfile.account_overview.phone = elForm.phone.value;
   submitBtn.classList.add('no-active-button');
   submitBtn.disabled = true;
   body.style.cursor = 'wait';
   submitBtn.style.cursor = 'wait';
   try {
      if (elForm.file.files.length) {
         const userFileRef = ref(storage, `/users/permissions/${Date.now()}${elForm.file.files[0].name}`);
         const uploadResult = await uploadBytes(userFileRef, elForm.file.files[0]);
         userProfile.account_overview.file = {
            name: uploadResult.metadata.name,
            fullPath: uploadResult.metadata.fullPath
         }
         inputFile.setAttribute('data-isFile', false);
      }
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

signOutLink.addEventListener('click', signOutFunc);

changeBackgrounHeader();