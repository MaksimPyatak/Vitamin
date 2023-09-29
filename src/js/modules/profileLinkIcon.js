import { returnAuthUser } from "./firebase.js";

const profileLinkIcon = document.querySelector('.header__profile-logo');
//let profileLink;

returnAuthUser()
   .then((user) => {
      console.log(user);
      if (user) {
         profileLinkIcon.href = 'subscriptions.html';
         //profileLink = 'subscriptions.html';
      } else {
         profileLinkIcon.href = 'sign-in.html';
         //profileLink = 'sign-in.html';
      }
   });

//if (profileLinkIcon) {
//   profileLinkIcon.addEventListener('click', () => window.location.href = profileLink);
//}