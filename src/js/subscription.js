import { signOutFunc, } from "./modules/firebase.js";

//import "./modules/profileLinkIcon.js";

const signOutLink = document.querySelector('.item__sign-out');
const body = document.querySelector('body');//!!!!!!!


signOutLink.addEventListener('click', signOutFunc);