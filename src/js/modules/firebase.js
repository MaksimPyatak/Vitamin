import { initializeApp } from 'firebase/app';
import { getAuth, AuthErrorCodes } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyAVdqGuVs3Tq-kdDz6DfM0I1gjr9N1humw",
   authDomain: "vitamin-92f4f.firebaseapp.com",
   projectId: "vitamin-92f4f",
   storageBucket: "vitamin-92f4f.appspot.com",
   messagingSenderId: "385771697022",
   appId: "1:385771697022:web:5db8c1dcb899352474392f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


export const showLoginError = (error) => {
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
export const showSignupError = (error) => {
   switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
         const message = `The entered e-mail is already registered.`;
         regValidator.isError(message, email)
         break;
      //case AuthErrorCodes.EMAIL_EXISTS:

      //break;
      default:
         console.log(error.message);
         regValidator.isError(error.message, password)
         break;
   }
}