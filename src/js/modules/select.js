import { adjustOptionsListPosition } from "../utilits/function.js";
//Додати ще, щоб при фокусуванні не відкривався список опцій, а просто був елемент в фокусі, а вже при натисканні ентр або стрілки в низ можна буловідкрити список. Після вибору опції залишати  елемент в фокусі для можливості здійснення повторного відкриття списку за допомогою ентр або стрілки вниз
const selectElements = document.querySelectorAll('.select');
selectElements.forEach(function (selectElement) {
   const upwardsClassSelectList = 'new-select__list--upwards';
   const selectOption = selectElement.querySelectorAll('option');
   const selectWrapper = document.createElement('div');
   selectElement.style.display = 'none';
   selectWrapper.classList.add('select');
   selectElement.parentNode.insertBefore(selectWrapper, selectElement);
   selectWrapper.appendChild(selectElement);
   const newSelect = document.createElement('div');
   newSelect.classList.add('new-select');
   selectElement.insertAdjacentElement('afterend', newSelect);
   const selectHead = document.createElement('div');
   selectHead.classList.add('new-select__header');
   selectHead.textContent = selectElement.querySelector('option:disabled').textContent;
   newSelect.setAttribute('tabindex', '0');
   newSelect.appendChild(selectHead);
   const selectList = document.createElement('div');
   selectList.classList.add('new-select__list');
   selectHead.insertAdjacentElement('afterend', selectList);
   selectHead.innerHTML = `
       <span class="new-select__arrow arrow"></span>
       ${selectHead.innerHTML}
   `;

   for (let i = 1; i < selectOption.length; i++) {
      const newSelectItem = document.createElement('div');
      newSelectItem.classList.add('new-select__item');
      const newSelectSpan = document.createElement('span');
      newSelectSpan.textContent = selectOption[i].textContent;
      newSelectItem.appendChild(newSelectSpan);
      newSelectItem.setAttribute('data-value', selectOption[i].value);
      selectList.appendChild(newSelectItem);
   }
   selectElement.addEventListener('dowload', () => {
      selectHead.innerHTML = ` <span class="new-select__arrow arrow"></span>   ${selectElement.value}`;
   }, { once: true });
   const selectItem = selectList.querySelectorAll('.new-select__item');
   //selectList.style.display = 'none';
   selectList.classList.remove('on');
   let clicked = false;
   newSelect.addEventListener('click', (event) => {
      if (!clicked) {
         choiseSelect();
      }
   });
   newSelect.addEventListener('focus', (e) => {
      clicked = !clicked;
      choiseSelect();
      window.setTimeout(() => clicked = false, 200)
   });
   newSelect.addEventListener('blur', () => {
      clicked = false;
      blurSelect();
      selectElements[0].dispatchEvent(new Event('blur', { bubbles: true }));
      removeClass(selectItem, 'new-select__item--active');
      adjustOptionsListPosition(selectList, upwardsClassSelectList);
   });

   const clickOutsideNewSelect = function (event) {
      if (!newSelect.contains(event.target)) {
         //selectList.style.display = 'none';
         selectList.classList.remove('on');
         selectHead.classList.remove('on');
         document.removeEventListener("click", clickOutsideNewSelect);
         currentElementIndex = undefined;
      }
   };

   function removeClass(arrayElements, classForRemove) {
      currentElementIndex = undefined;
      arrayElements.forEach((element) => {
         element.classList.remove(classForRemove);
      });
   }

   function choiseSelect() {
      const isOpen = selectHead.classList.contains('on');
      isOpen ? closeSelect() : openSelect();
   }

   function openSelect() {
      selectHead.classList.add('on');
      //selectList.style.display = 'block';
      selectList.classList.add('on');
      addNavigationForOptions();
      adjustOptionsListPosition(selectList, upwardsClassSelectList);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', clickOutsideNewSelect);
      selectItem.forEach(item => {
         item.addEventListener('click', handleSelectItemClick);
      });
   }

   function closeSelect() {
      selectHead.classList.remove('on');
      //selectList.style.display = 'none';
      selectList.classList.remove('on');
      removeUpwardsClass(selectList, upwardsClassSelectList);
      removeClass(selectItem, 'new-select__item--active');
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', clickOutsideNewSelect);
      selectItem.forEach(item => {
         item.removeEventListener('click', handleSelectItemClick);
      });
   }

   function handleKeyDown(event) {
      if (event.key === 'Enter' && selectList.style.display === 'block') {
         event.preventDefault();
         const activeItem = selectItem.find(item => item.classList.contains('new-select__item--active'));
         if (activeItem) {
            actionsAfterSelectingOption(activeItem);
         }
      }
   }

   function handleSelectItemClick(event) {
      actionsAfterSelectingOption(event.currentTarget);
   }

   function actionsAfterSelectingOption(item) {
      const chooseItem = item.getAttribute('data-value');
      selectElement.value = chooseItem;
      const changeEvent = new Event('change', { bubbles: true });
      selectElement.dispatchEvent(changeEvent);
      selectHead.innerHTML = ` <span class="new-select__arrow arrow"></span>   ${item.querySelector('span').textContent}`;
      //selectList.style.display = 'none';
      selectList.classList.remove('on');
      selectHead.classList.remove('on');
      removeClass(selectItem, 'new-select__item--active');
      removeUpwardsClass(selectList, upwardsClassSelectList);
      document.removeEventListener("click", clickOutsideNewSelect);
      clicked = true;
      window.setTimeout(() => clicked = false, 200);
   }

   function blurSelect() {
      selectHead.classList.remove('on');
      //selectList.style.display = 'none';
      selectList.classList.remove('on');
   }

   function addNavigationForOptions() {
      document.removeEventListener('keydown', navigationByOptions);
      document.addEventListener('keydown', navigationByOptions);
   }
   function navigationByOptions(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
         if (document.activeElement === newSelect || document.activeElement.parentElement === selectList) {
            event.preventDefault();
            const isNext = event.key === 'ArrowDown';
            focusElement(isNext);
         }
      }
   }
   let currentElementIndex;

   function focusElement(isNext) {
      if (currentElementIndex === undefined) {
         currentElementIndex = isNext ? 0 : selectItem.length - 1;
      } else if (isNext && currentElementIndex < selectItem.length - 1) {
         currentElementIndex++;
      } else if (!isNext && currentElementIndex > 0) {
         currentElementIndex--;
      } else {
         currentElementIndex = isNext ? 0 : selectItem.length - 1;
      }
      selectItem.forEach((item, index) => {
         if (index === currentElementIndex) {
            item.classList.add('new-select__item--active');
         } else {
            item.classList.remove('new-select__item--active');
         }
      });
   }
});
function removeUpwardsClass(optionsList, upwardsClass) {
   optionsList.classList.remove(upwardsClass);
}