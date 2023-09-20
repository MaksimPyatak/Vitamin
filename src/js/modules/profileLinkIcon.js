import { returnAuthUser } from "./firebase.js";

const profileLinkIcon = document.querySelector('.header__profile-logo');
let profileLink;

returnAuthUser()
   .then((user) => {
      if (user) {
         profileLink = 'subscriptions.html';
      } else {
         profileLink = 'sign-in.html';
      }
   });

if (profileLinkIcon) {
   profileLinkIcon.addEventListener('click', () => window.location.href = profileLink);
}