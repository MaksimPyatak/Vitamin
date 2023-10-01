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
   },
   full: {
      //med_form,
      //description_med_form
      //quantity_in_package,
      //number,
      //description_text,
      //description_list: [],
      //important:{
      //   safety,
      //   indications,
      //   ingredients,
      //   directions,
      //   disclaimer,
      //}

      //може зробити щоб додавалося два поля в одному (text) ключ(назва характиристики) в іншому(textarea) значення(опис характеристики)
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
      prodact.full.med_form = elements.med_form.value;
      prodact.full.description_med_form = elements.description_med_form.value;
      prodact.full.quantity_in_package = elements.quantity_in_package.value;
      prodact.full.number = elements.quantity_in_package.value;
      prodact.full.description_text = elements.description_text.value;

      prodact.full.description_list = [];
      const descriptionList = document.querySelectorAll('.description-list');
      descriptionList.forEach((item) => {
         prodact.full.description_list.push(item.value)
      })

      prodact.full.important = {};
      const importantBox = document.querySelectorAll('.important-box');
      importantBox.forEach((item) => {
         const iKey = item.getElementsByTagName('input');
         const iValue = item.getElementsByTagName('textarea');
         prodact.full.important[iKey.item(0).value] = iValue.item(0).value;
      })

      const refPng = ref(storage, `products/${Date.now()}_${elements.png.files[0].name}`);
      const refWebp = ref(storage, `products/${Date.now()}_${elements.webP.files[0].name}`);
      prodact.full.medicinal_form

      const uploadPng = await uploadBytes(refPng, elements.png.files[0]);
      prodact.base.png = await getDownloadURL(refPng);
      const uploadWebP = await uploadBytes(refWebp, elements.png.files[0]);
      prodact.base.webP = await getDownloadURL(refWebp);
      const refProduct = ref(db,)
      console.log(prodact);
      const added = await addDoc(collection(db, 'products'), prodact);
      console.log(added)
      if (added) {
         form.reset();
      }
   } catch (error) {
      console.log(error);
   }
}

const descriptionBlock = document.querySelector('.description-block');
const addDescriptionItem = document.querySelector('#add-description-item');


addDescriptionItem.addEventListener('click', () => {
   const descriptionList = document.createElement('textarea');
   descriptionList.name = 'description_list';
   descriptionList.className = 'description-list';
   descriptionList.placeholder = 'Description list';
   descriptionBlock.appendChild(descriptionList);
});

const importantBlock = document.querySelector('.important-block');
const buttonImportant = document.querySelector('#important-item');
buttonImportant.addEventListener('click', () => {
   const importantBox = document.createElement('div');
   importantBox.classList.add('important-box');
   const input = document.createElement('input');
   input.type = 'text';
   input.name = 'key';
   input.placeholder = 'Key';
   const textarea = document.createElement('textarea');
   textarea.name = 'value';
   textarea.placeholder = 'Value';
   importantBlock.appendChild(importantBox);
   importantBox.appendChild(input);
   importantBox.appendChild(textarea);
})