import "./modules/select.js";
//import "./profileLinkIcon.js";

import { Validator } from "./utilits/classes.js";
import { validationNumberInput, editPhone } from "./utilits/function.js";
import { db, signOutFunc, auth, returnAuthUser, userAuth } from "./modules/firebase.js";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";



const ZIP_LENGTH = 6;
let userId;

let userProfile = {
   uid: '',
   email: '',
   first_name: '',
   last_name: '',
   password: '',
   file: {},
   wholesale: '',
};

const arr = [];

returnAuthUser()
   .then((result) => userId = result.uid)
   .then(async () => {
      const docRef = doc(db, 'users', userId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
         userProfile = docSnapshot.data().account_overview;
      } else {
         console.log('Документ не існує');
      }
      //const userData = await getDocs(collection(db, 'users'))
      //console.log(userData);
      //userData.forEach((doc) => {
      //   arr.push({
      //      account_overview: doc.data().account_overview
      //   })
      //})
      //const q = query(collection(db, 'users'), where('account_overview.uid', '==', userId));
      //const userData = await getDocs(q);
      //userData.forEach((doc) => {
      //   console.log(doc.data());
      //   if (doc.data().account_overview.uid == userId) {
      //      userProfile = doc.data().account_overview;
      //      console.log(doc.data());
      //   }
      //})
   })
   .then(() => {

   })
   .catch((error) => console.log(error))


const signOutLink = document.querySelector('.item__sign-out');
const form = document.forms.overview;
const elForm = form.elements;
const zipNumberInput = elForm.zip;
const phoneInput = elForm.phone;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.form__submit');
const body = document.querySelector('body');//!!!!!!!
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

function submitFormHandler(event) {
   event.preventDefault();
   console.log(userProfile);
   if (regValidator.validation()) {
      console.log('valid');
   }
}

signOutLink.addEventListener('click', signOutFunc);