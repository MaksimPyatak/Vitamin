import "./modules/select.js";
import { checkCart } from "./utilits/function.js";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, } from "./modules/firebase.js";

let cart;
const products = {};
let typeProduct;
const localCurrentUser = JSON.parse(localStorage.getItem('currentUser'));

try {

} catch (error) {
   console.log(error);
}