//import { container } from "webpack";

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
      inputs.forEach((element) => {
         element.disabled = !element.disabled;
      });
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

   addressRegExp = /^[а-я\s.]+?\d+/i;            //???!!!!!
   expirationRegExp = /^(0[1-9]|1[0-2])\/\d{2}$/;

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
         return true
      }
   }
   blurValidation(form = this.form) {
      for (let i = 0; i < form.elements.length; i++) form: {
         const element = form.elements[i];
         if (element.name == 'file') {
            break form
         }
         element.addEventListener('blur', (e) => {
            if (typeof this[element.name + 'Test'] == 'function') {
               this[element.name + 'Test'](e.target);
            }
         });
      }
   }

   backgroundValdation(form = this.form) {
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
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (!this.emailRegExp.test(input.value)) {
         const message = "Email is invalid"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
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
         const message = "Field can't be blank";
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 3 || input.value.length > 15) {
         const message = "Field must be at least 3 and no longer than 15 characters";
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
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
      return this.firstTest(input);
   }

   lastValidationForBtn(input) {
      return this.firstValidationForBtn(input);
   }

   passwordTest(input) {
      if (input.value.length === 0) {
         const message = "Password can't be blank";
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 6 || input.value.length > 15) {
         const message = "Password must be at least 6 and no longer than 15 characters";
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
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

   current_passwordTest(input) {
      return this.passwordTest(input);
   }
   current_passwordValidationForBtn(input) {
      return this.passwordValidationForBtn(input);
   }

   new_passwordTest(input) {
      return this.passwordTest(input);
   }
   new_passwordValidationForBtn(input) {
      return this.passwordValidationForBtn(input);
   }

   confirm_new_passwordTest(input) {
      if (input.value.length === 0) {
         const message = "Password can't be blank";
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value != this.form.elements.new_password.value) {
         const message = "Passwords must match";
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   confirm_new_passwordValidationForBtn(input) {
      if (input.value == this.form.elements.new_password.value) {
         return true
      } else {
         return false
      }
   }

   first_addressTest(input) {
      if (input.value.length === 0) {
         const message = "Field can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 2) {
         const message = "Field must be at least 2 characters"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      }
      else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   first_addressValidationForBtn(input) {
      if (input.value.length >= 2) {
         return true
      } else {
         return false
      }
   }

   cityTest(input) {
      if (input.value.length === 0) {
         const message = "Field can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 2 || input.value.length > 15) {
         const message = "Field must be at least 2 and no longer than 15 characters"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      }
      else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   cityValidationForBtn(input) {
      if (input.value.length >= 2 && input.value.length <= 15) {
         return true
      } else {
         return false
      }
   }

   stateTest(input) {
      const castomSelect = this.#findCastomSelect(input, 'new-select__header');
      if (input.value === "") {
         const message = "Select from the list";
         this.isError(message, input);
         if (castomSelect) {
            castomSelect.classList.add('input-error');
         }
         input.addEventListener('change', (e) => this[input.name + 'Test'](input));
         return null
      } else {
         if (castomSelect) {
            castomSelect.classList.remove('input-error');
         }
         this.removeError(input);
         return 1
      }
   }
   stateValidationForBtn(input) {
      if (!(input.value === null)) {
         return true
      } else {
         return false
      }
   }

   zipTest(input) {
      if (input.value.length === 0) {
         const message = "Field can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 7) {
         const message = "The field must contain 6 digits"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      }
      else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   zipValidationForBtn(input) {
      if (input.value.length === 7) {
         return true
      } else {
         return false
      }
   }

   phoneTest(input) {
      if (input.value.length === 0) {
         const message = "Field can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 15) {
         const message = "The field must contain 11 digits"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      }
      else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   phoneValidationForBtn(input) {
      if (input.value.length === 15) {
         return true
      } else {
         return false
      }
   }

   card_numberTest(input) {
      if (input.value.length === 0) {
         const message = "Field can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 19) {
         const message = "The field must contain 16 digits"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      }
      else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   card_numberValidationForBtn(input) {
      if (input.value.length === 19) {
         return true
      } else {
         return false
      }
   }

   card_expirationTest(input) {
      if (input.value.length === 0) {
         const message = "Field can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (!this.expirationRegExp.test(input.value)) {
         const message = "Field is invalid"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   card_expirationValidationForBtn(input) {
      if (this.expirationRegExp.test(input.value)) {
         return true
      } else {
         return false
      }
   }
   card_cvcTest(input) {
      if (input.value.length === 0) {
         const message = "Field can't be blank"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (input.value.length < 3) {
         const message = "The field must contain 3 digits"
         this.isError(message, input);
         input.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      }
      else {
         input.classList.remove('input-error');
         this.removeError(input);
         return 1
      }
   }
   card_cvcValidationForBtn(input) {
      if (input.value.length === 3) {
         return true
      } else {
         return false
      }
   }

   fileTest(input, form = this.form) {
      const inputWrapper = input.closest('.input-file-wrapper');

      if (!form.contains(inputWrapper)) {
         inputWrapper = input;
      }
      let fileExtension;
      if (input.files.length) {
         fileExtension = input.files[0].name.split('.').pop().toLowerCase();
      }
      if (input.dataset.isfile == 'true') {
         return 1
      }
      if (input.files.length == 0) {
         const message = "File must be attached";
         this.isError(message, input);
         inputWrapper.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
         return null
      } else if (!['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf'].includes(fileExtension)) {
         const message = "File must be image or PDF"
         this.isError(message, input);
         inputWrapper.classList.add('input-error');
         input.addEventListener('input', (e) => this[input.name + 'Test'](input), { once: true });
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
      if (input.dataset.isfile == 'true') {
         return true
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

   #findCastomSelect(element, className) {
      let parent = element.parentElement;
      let child = parent.getElementsByClassName(className);
      if (child) {
         return child[0]
      } else {
         return
      }
   }
}

export class Accordion {
   constructor(accordion) {
      this.accordion = accordion;
      this.header = accordion.querySelector('.accordion__header');
      this.content = accordion.querySelector('.accordion__content');
      this.arrow = accordion.querySelector('.accordion__arrow');
      this.#activateAccordeon();
      this.#removeAccordion();
   }

   #activateAccordeon() {
      this.header.addEventListener('click', () => this.#playAccordion());
   }

   #playAccordion() {
      this.arrow.classList.toggle('accordion__arrow--active');
      if (this.content.style.maxHeight) {
         this.content.style.maxHeight = null;
      } else {
         this.content.style.maxHeight = this.content.scrollHeight + "px";
      }
   }

   #removeAccordion() {
      window.addEventListener('resize', () => {
         if (window.innerWidth < 769) {
            this.content.style.maxHeight = null;
         }
         if (window.innerWidth > 768) {
            this.content.style.maxHeight = 'unset';
         }
      })
   }
}