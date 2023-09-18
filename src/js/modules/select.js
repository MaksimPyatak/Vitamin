const selectElements = document.querySelectorAll('.select');

selectElements.forEach(function (selectElement) {
   const _this = selectElement;
   const selectOption = _this.querySelectorAll('option');
   const selectOptionLength = selectOption.length;
   //duration = 450;

   _this.style.display = 'none';
   const selectWrapper = document.createElement('div');
   selectWrapper.classList.add('select');
   _this.parentNode.insertBefore(selectWrapper, _this);
   selectWrapper.appendChild(_this);

   const newSelect = document.createElement('div');
   newSelect.classList.add('new-select');
   _this.insertAdjacentElement('afterend', newSelect);

   //const selectHead = _this.nextElementSibling;
   const selectHead = document.createElement('div');
   selectHead.classList.add('new-select__header');
   selectHead.textContent = _this.querySelector('option:disabled').textContent;
   newSelect.setAttribute('tabindex', '0');
   newSelect.appendChild(selectHead);
   const selectList = document.createElement('div');
   selectList.classList.add('new-select__list');
   selectHead.insertAdjacentElement('afterend', selectList);
   selectHead.innerHTML = `
       <span class="new-select__arrow arrow"></span>
       ${selectHead.innerHTML}
   `;

   for (let i = 1; i < selectOptionLength; i++) {
      const newSelectItem = document.createElement('div');
      newSelectItem.classList.add('new-select__item');
      const newSelectSpan = document.createElement('span');
      newSelectSpan.textContent = selectOption[i].textContent;
      newSelectItem.appendChild(newSelectSpan);
      newSelectItem.setAttribute('data-value', selectOption[i].value);
      //newSelectItem.setAttribute('tabindex', '0');
      selectList.appendChild(newSelectItem);
   }

   const selectItem = selectList.querySelectorAll('.new-select__item');
   selectList.style.display = 'none';
   let clicked = false;
   selectHead.addEventListener('click', () => {
      if (!clicked) {
         choiseSelect();
      }
   });
   newSelect.addEventListener('focus', (e) => {
      clicked = !clicked;
      choiseSelect();
      window.setTimeout(() => clicked = false, 100)
   });
   newSelect.addEventListener('blur', () => {
      clicked = false;
      blurSelect();
   });

   const clickOutsideNewSelect = function (event) {
      if (!newSelect.contains(event.target)) {
         selectList.style.display = 'none';
         selectHead.classList.remove('on');
         document.removeEventListener("click", clickOutsideNewSelect);
         //currentElementIndex = undefined;
         removeClass(selectItem, 'new-select__item--active');
      }
   };

   function removeClass(arrayElements, classForRemove) {
      for (let i = 0; i < arrayElements.length; i++) {
         const element = arrayElements[i];
         element.classList.remove(classForRemove)
      }
   }

   function choiseSelect() {
      if (!selectHead.classList.contains('on')) {
         selectHead.classList.add('on');
         selectList.style.display = 'block';
         addNavigationForOptions();

         function actionsAfterSelectingOption(item) {
            let chooseItem = item.getAttribute('data-value');

            _this.value = chooseItem;

            selectHead.innerHTML = ` <span class="new-select__arrow arrow"></span>   ${item.querySelector('span').textContent}`;

            selectList.style.display = 'none';
            selectHead.classList.remove('on');
            document.removeEventListener("click", clickOutsideNewSelect);
         }

         document.addEventListener('keydown', downKeyEnter)
         function downKeyEnter(event) {
            if (event.key === 'Enter' && selectList.style.display === 'block') {
               event.preventDefault();
               for (let i = 0; i < selectItem.length; i++) {
                  const element = selectItem[i];
                  if (element.classList.contains('new-select__item--active')) {
                     actionsAfterSelectingOption(element);
                  }
               }
            }
         }

         document.addEventListener("click", clickOutsideNewSelect);

         selectItem.forEach(function (item) {
            item.addEventListener('click', () => actionsAfterSelectingOption(item));
         });

      } else {
         selectHead.classList.remove('on');
         selectList.style.display = 'none';
      }
   }

   function blurSelect() {
      selectHead.classList.remove('on');
      selectList.style.display = 'none';
   }

   //document.addEventListener('keydown', (event) => {
   //   if (event.key === 'Tab') {
   //      console.log(document.activeElement);
   //   }
   //})

   function addNavigationForOptions() {
      document.removeEventListener('keydown', navigationByOptions);
      document.addEventListener('keydown', navigationByOptions);

   }
   function navigationByOptions(event) {
      if (event.key === 'ArrowDown' && (document.activeElement == (newSelect || selectHead) || document.activeElement.parentElement === selectList)) {
         event.preventDefault()
         focusNextElement();
      } else if (event.key === 'ArrowUp' && (document.activeElement == (newSelect || selectHead) || document.activeElement.parentElement === selectList)) {
         event.preventDefault()
         focusPreviousElement();
      }
   }
   let currentElementIndex;

   function focusNextElement() {
      if (currentElementIndex == undefined) {
         currentElementIndex = 0;
         selectItem[currentElementIndex].classList.add('new-select__item--active');
      } else if (currentElementIndex < selectItem.length - 1) {
         selectItem[currentElementIndex].classList.remove('new-select__item--active');
         currentElementIndex++;
         selectItem[currentElementIndex].classList.add('new-select__item--active');
      } else {
         selectItem[currentElementIndex].classList.remove('new-select__item--active');
         currentElementIndex = 0;
         selectItem[currentElementIndex].classList.add('new-select__item--active');
      }
   }

   function focusPreviousElement() {
      if (currentElementIndex === undefined) {
         currentElementIndex = selectItem.length - 1;
         selectItem[currentElementIndex].classList.add('new-select__item--active');
      } else if (currentElementIndex > 0) {
         selectItem[currentElementIndex].classList.remove('new-select__item--active');
         currentElementIndex--;
         selectItem[currentElementIndex].classList.add('new-select__item--active');
      } else {
         selectItem[currentElementIndex].classList.remove('new-select__item--active');
         currentElementIndex = selectItem.length - 1;
         selectItem[currentElementIndex].classList.add('new-select__item--active');
      }
   }
});