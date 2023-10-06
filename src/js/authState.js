import { auth, returnAuthUser } from "./modules/firebase.js";
const profilePageUrl = [
   '/account-overview.html',
   '/orders.html',
   '/payment-methods.html',
   '/subscriptions.html',
   '/change-password.html',
]

const currentUser = await returnAuthUser();
if (!currentUser) {
   if (profilePageUrl.includes(window.location.pathname)) {
      window.location.href = 'sign-in.html';
      console.log(window.location.href);
   }
}