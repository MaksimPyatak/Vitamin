const nameInput = document.querySelector('#name');
const btn = document.querySelector('.quiz__btn');
const inputError = document.querySelector('.quiz__input-error');
btn.addEventListener('click', (event) => {
   event.preventDefault();
   if (validate(nameInput)) {
      window.location.assign('quiz_step_2.html');
   }
});
nameInput.addEventListener('blur', () => validate(nameInput));

nameInput.addEventListener('input', activateBtn);
function activateBtn() {
   if (nameInput.value.length > 2 && nameInput.value.length < 16) {
      btn.classList.add('quiz__btn--active');
   } else {
      btn.classList.remove('quiz__btn--active');
   }
}

function validate(input) {
   if (input.value.length === 0) {
      inputError.innerHTML = "Field can't be blank";
      input.classList.add('error');
      input.addEventListener('input', () => validate(input), { once: true });
      return false
   } else if (input.value.length < 3 || input.value.length > 15) {
      inputError.innerHTML = "Field must be at least 3 and no longer than 15 characters";
      input.classList.add('error');
      input.addEventListener('input', () => validate(input), { once: true });
      return false
   } else {
      input.classList.remove('error');
      inputError.innerHTML = "";
      input.addEventListener('input', () => validate(input), { once: true });
      return true
   }
}