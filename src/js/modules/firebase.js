import { initializeApp } from 'firebase/app';
import { getAuth, AuthErrorCodes, signOut, onAuthStateChanged } from "firebase/auth";
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

export function signOutFunc() {
   signOut(auth)
      .then(() => {
         localStorage.removeItem('currentUser');
         console.log('You signed out');
         window.location.replace('sign-in.html');
      })
      .catch((error) => {
         console.log(error);
      });
}

//export function returnAuthUser() {
//   return new Promise(function (resolve, reject) {
//      auth.onAuthStateChanged((user) => {
//         console.log(user);
//         resolve(user)
//      });
//   })
//}

export async function returnAuthUser() {
   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
   if (currentUser) {
      return currentUser
   }
   return new Promise(async (resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         unsubscribe();

         if (user) {
            const currentUser = {
               uid: user.uid,
            };
            console.log(currentUser);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            resolve(currentUser);
         } else {
            resolve(null);
         }
      });
   });
   //onAuthStateChanged(auth, (user) => {
   //   console.log(user);
   //   if (user) {
   //      const currentUser = {
   //         uid: user.uid,
   //      }
   //      localStorage.setItem('currentUser', JSON.stringify(currentUser));
   //   } else {
   //      currentUser = user;
   //   }
   //   return currentUser
   //});
}

//export let userAuth;
//export let uidUserAuth;
//returnAuthUser()
//   .then((result) => {
//      userAuth = result;
//      return result
//   })
   //.then((result) => {
   //   uidUserAuth = result.uid;
   //   console.log(uidUserAuth);
   //   return result
   //});