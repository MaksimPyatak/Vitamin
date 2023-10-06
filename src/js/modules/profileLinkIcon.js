import { returnAuthUser } from "./firebase.js";

const profileLinkIcon = document.querySelector('.header__profile-logo');

const user = await returnAuthUser();

if (user) {
   profileLinkIcon.href = 'subscriptions.html';
} else {
   profileLinkIcon.href = 'sign-in.html';
}
