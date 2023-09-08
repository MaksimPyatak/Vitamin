let tabs = document.querySelector('.tabs');
const tabBtnClass = ".tabs__tab";



class ClassToggler {
   constructor(tabsClass, tabClass, objectClass) {
      this.tabsClass = tabsClass;
      this.tabClass = tabClass;
      this.objectClass = objectClass;
   }
   #tabs = null;
   //test() {
   //   console.log(`.${this.tabsClass}`);
   //   this.#tabs = document.querySelector(`.${this.tabsClass}`);
   //}
   #tab = null;
   //this.#tabs.getElementsByClassName(this.tabClass);
   //() => {
   //   if (this.#tabs) {
   //      return this.#tabs.getElementsByClassName(this.tabClass)
   //   } else {
   //      console.log(`Element containing class ${this.tabsClass} not found.`);
   //      return null
   //   }
   //};
   #manipulationObject = null;
   //document.querySelector(`.${this.objectClass}`);
   #classForTab = null;
   //this.#tabs.dataset.classForTab;
   //() => {
   //   if (this.#tabs) {
   //      return this.#tabs.dataset.classForTab
   //   } else {
   //      console.log(`Element containing class ${this.tabsClass} not found.`);
   //      return null
   //   }
   //};
   #classForObj = null;
   //this.#tab.dataset.classForObj;
   //() => {
   //   if (this.#tabs) {
   //      return this.#tab.dataset.classForObj;
   //   } else {
   //      console.log(`Element containing class ${this.tabsClass} not found.`);
   //      return null
   //   }
   //};

   #getOllObject() {
      console.log(this.tabsClass);
      this.#tabs = document.querySelector(`.${this.tabsClass}`);
      console.log(this.#tabs);
      if (this.#tabs) {
         this.#tab = this.#tabs.getElementsByClassName(this.tabClass);
         console.log(this.#tab);
         this.#classForTab = this.#tabs.dataset.classForTab;
         console.log(this.#classForObj);
         this.#classForObj = this.#tabs.dataset.classForObj;
         console.log(this.#classForObj);
      } else {
         console.log(`Element containing class ${this.tabsClass} not found.`);
      }
      console.log(this.objectClass);
      this.#manipulationObject = document.querySelector(`.${this.objectClass}`);
      console.log(this.#classForObj);
      //} catch (error) {
      //   console.log(err.stack);
      //}
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

         //this.#tab.forEach(element => {
         //   element.classList.remove(this.#classForTab)
         //});
      } else {
         console.log(`There are no data-${this.#classForTab} in the ${this.#tabs}`);
      }
      tab.classList.add(this.#classForTab)
   }
}

const registrationTabs = new ClassToggler("tabs", 'tabs__tab', "add-file");
registrationTabs.addListener();


//   iOS 14.5 підтримується на наступних пристроях Apple:
//      - iPhone 6s і новіші моделі.
//      - iPad Air 2 і новіші моделі.
//      - iPad mini 4 і новіші моделі.
//      - iPad (5-го покоління) і новіші моделі.
//      - Всі моделі iPad Pro.
//      - iPod touch (7-го покоління).