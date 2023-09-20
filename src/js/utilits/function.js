import { signOutFunc } from "../modules/firebase.js";

export function validationNumberInput(numberInput, maxLength,) {
   //input.addEventListener('input', function () {
   //   const inputValue = this.value.toString();
   //   console.log(inputValue);
   //   console.log(inputValue.toLowerCase().search(/^\d{3}\s(?:\D*\d{3}\s*)*$/));
   //   if (inputValue.length > maxLength) {
   //      this.value = inputValue.slice(0, maxLength);
   //   } else if (inputValue.toLowerCase().search(/[^0-9]/g) >= 0 && inputValue.length < 4) {
   //      console.log('reg1');
   //      this.value = this.dataset.previousValue || '';
   //   } else if (inputValue.length == 4 && inputValue[3] != ' ' && inputValue.toLowerCase().search(/[0-9]{3}[0-9]/g) >= 0) {
   //      console.log(' - ');
   //      this.value = inputValue.substring(0, 3) + ' ' + inputValue.substring(3);
   //   } else if (inputValue.toLowerCase().search(/[0-9]{3}\s[^0-9]{1,3}/g) < 0 && inputValue.length > 3) { //&& inputValue.toLowerCase().search(/[^0-9]{3}\s[^0-9]/g) <= 0
   //      console.log('reg2');
   //      this.value = this.dataset.previousValue || '';
   //      //} else if (inputValue.length == 4 && inputValue.toLowerCase().search(/[0-9]{3}[^0-9]/g)) {
   //      //   console.log(' - ');
   //      //   this.value = inputValue.substring(0, 3) + ' ' + inputValue.substring(3);
   //   } else {
   //      this.dataset.previousValue = inputValue;
   //   }
   //})
   //const numberInput = document.getElementById("numberInput");

   numberInput.addEventListener("input", function () {

      const sanitizedValue = this.value.replace(/\D/g, "");
      const firstThreeDigits = sanitizedValue.slice(0, 3);
      const restOfTheDigits = sanitizedValue.slice(3, maxLength);
      const formattedValue = restOfTheDigits.length > 0 ? `${firstThreeDigits} ${restOfTheDigits}` : firstThreeDigits;
      this.value = formattedValue;
   });
}

export function editPhone(numberInput) {
   numberInput.addEventListener("input", function () {

      const sanitizedValue = this.value.replace(/\D/g, "");
      const firstDigit = sanitizedValue.slice(0, 1);
      const secondThreeDigits = sanitizedValue.slice(1, 4);
      const thirdThreeDigits = sanitizedValue.slice(4, 7);
      const fourthTwoDigits = sanitizedValue.slice(7, 9);
      const lastTwoDigits = sanitizedValue.slice(9, 11);
      //const formattedValue = restOfTheDigits.length > 0 ? `${firstThreeDigits} ${restOfTheDigits}` : firstThreeDigits;
      let formattedValue = `${firstDigit}`;
      if (secondThreeDigits.length > 0) {
         formattedValue += ` ${secondThreeDigits}`;
      }
      if (thirdThreeDigits.length > 0) {
         formattedValue += ` ${thirdThreeDigits}`;
      }
      if (fourthTwoDigits.length > 0) {
         formattedValue += ` ${fourthTwoDigits}`;
      }
      if (lastTwoDigits.length > 0) {
         formattedValue += ` ${lastTwoDigits}`;
      }
      this.value = formattedValue;
   });
}

//!!!!Потрібна?
//export async function determineAuthState(link) {
//   try {
//      const user = await signOut(auth);
//      return user
//   } catch (error) {
//      console.log(error);
//   }
//}