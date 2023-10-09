import { renderCard } from "../../utilits/function.js";
import { collection, doc, getDocs, getDoc, query, limit, } from "firebase/firestore";
import { db, } from "../firebase.js";


let productsType = {};
let products = {};

const cardsBlock = document.querySelector('.you-may-like__cards');

try {
   productsType = await getDoc(doc(db, 'constData', 'typeProduct'));
   const q = query(collection(db, 'products'), limit(4));
   products = await getDocs(q);
} catch (error) {
   console.log(error);
}

renderCards(products, productsType);

function renderCards(products, productsType) {
   products.forEach((doc) => {
      const data = doc.data().base;
      const card = renderCard(data, productsType, doc.id)
      cardsBlock.appendChild(card);
   })
}