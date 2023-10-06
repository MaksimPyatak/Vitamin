import { ClassToggler, Validator } from "./utilits/classes.js";
import { auth, showLoginError, storage, db } from "./modules/firebase.js";

import { createUserWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { changeBackgrounHeader } from "./utilits/function.js";

import "./modules/sign-up/add-file-name.js";

const registrationTabs = new ClassToggler("tabs", 'tabs__tab', "add-file");

const userProfile = {
   account_overview: {
      uid: '',
      email: '',
      first: '',
      last: '',
      password: '',
      file: {},
      wholesale: '',
   }
};
const form = document.forms.sign_up;
const elForm = form.elements;
const regValidator = new Validator(form);
const submitBtn = form.querySelector('.sign-up__submit');
const body = document.querySelector('body');
regValidator.blurValidation();

const origMethod = registrationTabs.changeClass.bind(registrationTabs);

registrationTabs.changeClass = function (e) {
   origMethod(e);
   validationForBtn();
}
registrationTabs.addListener();

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
      userProfile.account_overview.email = elForm.email.value;
      userProfile.account_overview.first = elForm.first.value;
      userProfile.account_overview.last = elForm.last.value;
      userProfile.account_overview.password = elForm.password.value;
      userProfile.account_overview.wholesale = !elForm.file.disabled;

      submitBtn.classList.add('no-active-button');
      submitBtn.disabled = true;
      body.style.cursor = 'wait';
      //submitBtn.style.cursor = 'wait';
      //createUserWithEmailAndPassword(auth, userProfile.account_overview.email, userProfile.account_overview.password)
      //   .then((userCredential) => {
      //      const user = userCredential.user;
      //      return user
      //   })
      //   .then((user) => {
      //      userProfile.account_overview.uid = user.uid;
      //      if (userProfile.account_overview.wholesale) {
      //         const userFileRef = ref(storage, `/users/permissions/${Date.now()}${elForm.file.files[0].name}`)
      //         return uploadBytes(userFileRef, elForm.file.files[0])
      //      }
      //      return
      //   })
      //   .then((uploadResult) => {
      //      if (uploadResult) {
      //         userProfile.account_overview.file = {
      //            name: uploadResult.metadata.name,
      //            fullPath: uploadResult.metadata.fullPath
      //         }
      //      }
      //      return
      //   })
      //   .then(() => {
      //      return setDoc(doc(db, "users", userProfile.account_overview.uid), userProfile)
      //   })
      //   .then(() => window.location.replace("subscriptions.html"))
      //   .catch((error) => {
      //      submitBtn.classList.remove('no-active-button')
      //      submitBtn.disabled = false;
      //      submitBtn.style.cursor = 'pointer';
      //      body.style.cursor = 'pointer';
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
      async function createUserAndUploadFile(auth, userProfile, elForm) {
         try {
            const userCredential = await createUserWithEmailAndPassword(auth, userProfile.account_overview.email, userProfile.account_overview.password);
            const user = userCredential.user;
            const currentUser = {
               uid: user.uid,
            }
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            //userProfile.account_overview.uid = user.uid;

            if (userProfile.account_overview.wholesale) {
               const userFileRef = ref(storage, `/users/permissions/${Date.now()}${elForm.file.files[0].name}`);
               const uploadResult = await uploadBytes(userFileRef, elForm.file.files[0]);

               userProfile.account_overview.file = {
                  name: uploadResult.metadata.name,
                  fullPath: uploadResult.metadata.fullPath
               };
            }

            await setDoc(doc(db, "users", user.uid), userProfile);

            window.location.replace("index.html");
         } catch (error) {
            submitBtn.classList.remove('no-active-button');
            submitBtn.disabled = false;
            submitBtn.style.cursor = 'pointer';
            body.style.cursor = 'pointer';

            switch (error.code) {
               case AuthErrorCodes.EMAIL_EXISTS:
                  const message = `The entered e-mail is already registered.`;
                  regValidator.isError(message, email);
                  break;
               default:
                  console.error(error.message);
                  regValidator.isError(error.message, password);
                  break;
            }
         }
      }

      // Виклик функції createUserAndUploadFile
      createUserAndUploadFile(auth, userProfile, elForm);

   }
}

changeBackgrounHeader();