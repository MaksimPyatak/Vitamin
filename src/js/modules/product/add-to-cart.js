
const quantityOutBlock = document.querySelector('.quantity-choice__out-block');
const minus = document.querySelector('.quantity-choice__minus-block');
const plus = document.querySelector('.quantity-choice__plus-block');
const maxQuantity = 10;

function updateQuantity(change) {
   let currentQuantity = parseInt(quantityOutBlock.innerHTML);

   currentQuantity += change;

   if (currentQuantity < 1) {
      currentQuantity = 1;
   } else if (currentQuantity > maxQuantity) {
      currentQuantity = maxQuantity;
   }

   quantityOutBlock.innerHTML = currentQuantity;
   minus.classList.toggle('quantity-choice__minus-block--not-active', currentQuantity === 1);
   plus.classList.toggle('quantity-choice__plus-block--not-active', currentQuantity === maxQuantity);
}

minus.addEventListener('click', () => {
   updateQuantity(-1);
});

plus.addEventListener('click', () => {
   updateQuantity(1);
});

const autoshipCheckbox = document.querySelector('#autoship');
const selectBlock = document.querySelector('.autoship__select-block');
const selectHeader = document.querySelector('.autoship__select-header');
const selectList = document.querySelector('.autoship__select-list');
const selectArrow = document.querySelector('.autoship__select-arrow');
const selectItems = document.querySelectorAll('.autoship__select-item');
const selectHeaderText = document.querySelector('.autoship__select-header-text');

autoshipCheckbox.addEventListener('change', () => selectBlock.classList.toggle('autoship__select-block--not-active', !autoshipCheckbox.checked));

selectHeader.addEventListener('click', () => {
   if (!autoshipCheckbox.checked) {
      return
   }
   if (selectList.classList.contains('autoship__select-list--not-show')) {
      selectList.classList.remove('autoship__select-list--not-show');
      selectArrow.classList.add('autoship__select-arrow--open-list');
      selectList.addEventListener('click', selectOption);
   } else {
      selectList.classList.add('autoship__select-list--not-show');
      selectArrow.classList.remove('autoship__select-arrow--open-list');
      selectList.removeEventListener('click', selectOption)
   }
})
function selectOption(e) {
   selectItems.forEach((item) => {
      if (e.target == item) {
         selectHeaderText.innerHTML = item.innerHTML;
         selectItems.forEach(item => item.classList.remove('autoship__select-item--active'));
         item.classList.add('autoship__select-item--active');
         selectList.classList.add('autoship__select-list--not-show');
         selectArrow.classList.remove('autoship__select-arrow--open-list');
         selectList.removeEventListener('click', selectOption)
      }
   })
}