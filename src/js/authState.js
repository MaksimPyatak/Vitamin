import { auth } from "./modules/firebase.js";

const profilePageUrl = [
   '/account-overview.html',
   '/orders.html',
   '/payment-methods.html',
   '/subscriptions.html',
   '/change-password.html',
]
auth.onAuthStateChanged((user) => {
   if (!user) {
      if (profilePageUrl.includes(window.location.pathname)) {
         window.location.href = 'sign-in.html';
      }
   }
});