/**
         * Додає клас до елементу @param objectClass
         * @param tabsClass клас об'єкта, де розміщені кнопки управління
         * В об'єкті з класом @param tabsClass мають бути дата атрибут data-class-for-tab з назвою класу для підсвічування активної кнопки та дата атрибут data-class-for-obj, з назвою класу, що додається до @param objectClass
         * @param tabClass клас кнопок, що керують @param objectClass
         */
export class ClassToggler {
   constructor(tabsClass, tabClass, objectClass) {
      this.tabsClass = tabsClass;
      this.tabClass = tabClass;
      this.objectClass = objectClass;
   }
   #tabs = null;
   #tab = null;
   #manipulationObject = null;
   #classForTab = null;
   #classForObj = null;

   #getOllObject() {
      this.#tabs = document.querySelector(`.${this.tabsClass}`);
      if (this.#tabs) {
         this.#tab = this.#tabs.getElementsByClassName(this.tabClass);
         this.#classForTab = this.#tabs.dataset.classForTab;
         this.#classForObj = this.#tabs.dataset.classForObj;
      } else {
         console.log(`Element containing class ${this.tabsClass} not found.`);
      }
      this.#manipulationObject = document.querySelector(`.${this.objectClass}`);
   }

   addListener() {
      this.#getOllObject();
      this.#tabs.addEventListener('click', (e) => this.changeClass(e))
   }

   changeClass(e) {
      let btn = e.target.closest(`.${this.tabClass}`);
      if (!btn) {
         return
      }
      if (!this.#tabs.contains(btn)) {
         return
      }
      this.#toggleClassOfElement();
      this.#addClassToTab(btn);
   }

   #toggleClassOfElement() {
      if (this.#manipulationObject) {
         if (this.#classForObj) {
            this.#manipulationObject.classList.toggle(this.#classForObj);
            this.#searchInput(this.#manipulationObject);
         } else {
            console.log(`There are no data-${this.#classForObj} in the ${this.#tabs}`);
         }
      } else {
         console.log(`Element containing class ${this.objectClass} not found.`);
      }
   }


   #addClassToTab(tab) {
      if (this.#classForTab) {
         for (const element of this.#tab) {
            element.classList.remove(this.#classForTab)
         }
      } else {
         console.log(`There are no data-${this.#classForTab} in the ${this.#tabs}`);
      }
      tab.classList.add(this.#classForTab)
   }

   #searchInput(obj) {
      let inputs = obj.querySelectorAll('input', 'select', 'textarea');
      if (inputs.length) {
         for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i];
            let isDisabled = element.disabled;
            element.disabled = !isDisabled;
         }
      }
   }
}

//    #addClassToTab -- приватний клас
//   iOS 14.5 підтримується на наступних пристроях Apple:
//      - iPhone 6s і новіші моделі.
//      - iPad Air 2 і новіші моделі.
//      - iPad mini 4 і новіші моделі.
//      - iPad (5-го покоління) і новіші моделі.
//      - Всі моделі iPad Pro.
//      - iPod touch (7-го покоління).

export class Validator {
   constructor(form) {
      this.form = form;
   }
   errorFilds = document.querySelectorAll('.error');
   emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
   ///^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;

   validation(form = this.form) {
      let isValid = true;
      let n = null;
      for (let i = 0; i < form.elements.length; i++) {
         const element = form.elements[i];
         let methodName = element.name + 'Test';
         if (element.disabled) {
            n++
         } else if (typeof this[methodName] === "function") {
            n += this[methodName](element);
         } else {
            n++
         }
      }
      if (n !== form.elements.length) {
         return false
      } else {
         console.log('Succses!');
         return true
      }
   }
   blurValidation(form = this.form) {
      for (let i = 0; i < form.elements.length; i++) {
         const element = form.elements[i];
         if (element.name == 'file') {
            break
         }
         element.addEventListener('blur', (e) => {
            if (typeof this[element.name + 'Test'] == 'function') {
               this[element.name + 'Test'](e.target)
            }
         });
      }
   }

   backgroundValdation(form = this.form) {
      let isValid = false;
      let n = 0;
      for (let i = 0; i < form.elements.length; i++) {
         const element = form.elements[i];
         if (element.disabled) {
            n++
         } else if (typeof this[element.name + 'ValidationForBtn'] == 'function') {
            n += this[element.name + 'ValidationForBtn'](element) ? 1 : 0;
         } else {
            n++
         }
      }
      return n == form.elements.length ? true : false
   }

   emailTest(input) {
      if (input.value.length === 0) {
         const message = "Email can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else if (!this.emailRegExp.test(input.value)) {
         const message = "Email is invalid"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   emailValidationForBtn(input) {
      if (this.emailRegExp.test(input.value)) {
         return true
      } else {
         return false
      }
   }
   firstTest(input) {
      if (input.value.length === 0) {
         const message = "Fild can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else if (input.value.length < 3 || input.value.length > 15) {
         const message = "Fild must be at least 3 and no longer than 15 characters"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }

   firstValidationForBtn(input) {
      if (input.value.length >= 3 && input.value.length <= 15) {
         return true
      } else {
         return false
      }
   }

   lastTest(input) {
      return this.firstTest(input)
   }

   lastValidationForBtn(input) {
      return this.firstValidationForBtn(input)
   }

   passwordTest(input) {
      if (input.value.length === 0) {
         const message = "Password can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else if (input.value.length < 6 || input.value.length > 15) {
         const message = "Password must be at least 6 and no longer than 15 characters"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }

   passwordValidationForBtn(input) {
      if (input.value.length >= 6 && input.value.length <= 15) {
         return true
      } else {
         return false
      }
   }

   fileTest(input, form = this.form) {
      let inputWrapper = input.closest('.input-file-wrapper');

      if (!form.contains(inputWrapper)) {
         inputWrapper = input;
      }
      let fileExtension
      if (input.files.length) {
         fileExtension = input.files[0].name.split('.').pop().toLowerCase();
      }
      if (input.files.length == 0) {
         const message = "File must be attached"
         this.isError(message, input);
         inputWrapper.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else if (!['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf'].includes(fileExtension)) {
         const message = "File must be image or PDF"
         this.isError(message, input);
         inputWrapper.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input));
         return null
      } else {
         inputWrapper.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }

   fileValidationForBtn(input) {
      let fileExtension
      if (input.files.length) {
         fileExtension = input.files[0].name.split('.').pop().toLowerCase();
      }
      if (input.value.length !== 0 && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf'].includes(fileExtension)) {
         return true
      } else {
         return false
      }
   }

   isError(message, input) {
      this.errorFilds.forEach((el) => {
         if (el.id == "error-" + input.name) {
            let label = el.innerHTML
            el.innerHTML = message;
            return label
         }
      })
   }

   removeError(input) {
      this.errorFilds.forEach((el) => {
         if (el.id == "error-" + input.name) {
            el.innerHTML = '';
         }
      })
   }
}