import { returnAuthUser } from "./modules/firebase.js";
const profilePageUrl = [
   '/account-overview.html',
   '/orders.html',
   '/payment-methods.html',
   '/subscriptions.html',
   '/change-password.html',
]


if (profilePageUrl.includes(window.location.pathname)) {
   const currentUser = await returnAuthUser();
   if (!currentUser) {
      window.location.href = 'sign-in.html';
      console.log(window.location.href);
   }
}