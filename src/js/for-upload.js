import { auth, showLoginError, storage, db } from "./modules/firebase.js";

import { createUserWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, setDoc, doc, } from "firebase/firestore";

const form = document.forms.upload;
const elements = form.elements;
const prodact = {
   base: {
      name: elements.name.value,
      type: elements.type.value,
      sale: elements.sale.value,
      price: elements.price.value,
      sale_price: elements.sale_price.value,
      png: '',
      webP: '',
   }
}

form.addEventListener('submit', addProduct);

async function addProduct(event) {
   event.preventDefault();

   try {
      prodact.base.name = elements.name.value;
      prodact.base.type = elements.type.value;
      prodact.base.sale = elements.sale.value;
      prodact.base.price = elements.price.value;
      prodact.base.sale_price = elements.sale_price.value;
      const refPng = ref(storage, `products/${Date.now()}_${elements.png.files[0].name}`);
      const refWebp = ref(storage, `products/${Date.now()}_${elements.webP.files[0].name}`);
      const uploadPng = await uploadBytes(refPng, elements.png.files[0]);
      prodact.base.png = await getDownloadURL(refPng);
      const uploadWebP = await uploadBytes(refWebp, elements.png.files[0]);
      prodact.base.webP = await getDownloadURL(refWebp);
      const refProduct = ref(db,)
      console.log(prodact);
      await addDoc(collection(db, 'products'), prodact)
      console.log('Успіх');
   } catch (error) {
      console.log(error);
   }
}

//const