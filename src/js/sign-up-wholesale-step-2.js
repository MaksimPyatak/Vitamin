import { ClassToggler, Validator } from "./utilits/classes.js";
//import { auth, showLoginError, storage, db } from "./modules/firebase.js";

//import { createUserWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
//import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
//import { collection, addDoc } from "firebase/firestore";

import "./modules/sign-up/add-file-name.js";

//const registrationTabs = new ClassToggler("tabs", 'tabs__tab', "add-file");

//const userProfile = {
//   uid: '',
//   email: '',
//   first_name: '',
//   last_name: '',
//   password: '',
//   file: {},
//   wholesale: '',
//};
const form = document.forms.sign_up;
const elForm = form.elements;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.sign-up__submit');
form.elements.file.disabled = false;
regValidator.blurValidation();

//const origMethod = registrationTabs.changeClass.bind(registrationTabs);

//registrationTabs.changeClass = function (e) {
//   origMethod(e);
//   validationForBtn();
//}
//registrationTabs.addListener();

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
      //userProfile.email = elForm.email.value;
      //userProfile.first_name = elForm.first.value;
      //userProfile.last_name = elForm.last.value;
      //userProfile.password = elForm.password.value;
      ////userProfile.file = elForm.file.files[0];
      //userProfile.wholesale = !elForm.file.disabled;

      submitBtn.classList.add('no-active-button');
      submitBtn.disabled = true;
      submitBtn.style.cursor = 'not-allowed';
      //createUserWithEmailAndPassword(auth, userProfile.email, userProfile.password)
      //   .then((userCredential) => {
      //      const user = userCredential.user;
      //      console.log(user);
      //      return user
      //   })
      //   .then((user) => {
      //      userProfile.uid = user.uid;
      //      if (userProfile.wholesale) {
      //         const userFileRef = ref(storage, `/users/permissions/${Date.now()}${elForm.file.files[0].name}`)
      //         return uploadBytes(userFileRef, elForm.file.files[0])
      //      }
      //      return
      //   })
      //   .then((uploadResult) => {
      //      if (uploadResult) {
      //         userProfile.file = {
      //            name: uploadResult.metadata.name,
      //            fullPath: uploadResult.metadata.fullPath
      //         }
      //      }
      //      return
      //   })
      //   .then(() => {
      //      return addDoc(collection(db, "users"), userProfile)
      //   })
      //   .then(() => window.location.replace("subscriptions.html"))
      //   .catch((error) => {
      //      submitBtn.classList.remove('no-active-button')
      //      submitBtn.disabled = false;
      //      submitBtn.style.cursor = 'pointer';
      //      switch (error.code) {
      //         case AuthErrorCodes.EMAIL_EXISTS:
      //            const message = `The entered e-mail is already registered.`;
      //            regValidator.isError(message, email)
      //            break;
      //         //case AuthErrorCodes.EMAIL_EXISTS:

      //         //break;
      //         default:
      //            console.log(error.message);
      //            regValidator.isError(error.message, password)
      //            break;
      //      }
      //   });
      window.location.replace("subscriptions.html")
   }
}

