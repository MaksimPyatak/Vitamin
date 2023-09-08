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
      this.#tabs.addEventListener('click', (e) => this.#changeClass(e))
   }

   #changeClass(e) {
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
}

//   iOS 14.5 підтримується на наступних пристроях Apple:
//      - iPhone 6s і новіші моделі.
//      - iPad Air 2 і новіші моделі.
//      - iPad mini 4 і новіші моделі.
//      - iPad (5-го покоління) і новіші моделі.
//      - Всі моделі iPad Pro.
//      - iPod touch (7-го покоління).