const emailInput = document.querySelector('#email');
const btn = document.querySelector('.quiz__btn');
const inputError = document.querySelector('.quiz__input-error');
const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
btn.addEventListener('click', (event) => {
   event.preventDefault();
   if (validate(emailInput)) {
      window.location.assign('person-pack.html');
   }
});
emailInput.addEventListener('blur', () => validate(emailInput));

function validate(input) {
   if (input.value.length === 0) {
      inputError.innerHTML = "Field can't be blank";
      input.classList.add('error');
      input.addEventListener('input', () => validate(input), { once: true });
      return false
   } else if (!emailRegExp.test(emailInput.value)) {
      inputError.innerHTML = "Field must be at least 3 and no longer than 15 characters";
      input.classList.add('error');
      input.addEventListener('input', () => validate(input), { once: true });
      return false
   } else {
      input.classList.remove('input-error');
      inputError.innerHTML = "";
      input.addEventListener('input', () => validate(input), { once: true });
      return true
   }
}

emailInput.addEventListener('input', activateBtn);
function activateBtn() {
   if (emailRegExp.test(emailInput.value)) {
      btn.classList.add('quiz__btn--active');
   } else {
      btn.classList.remove('quiz__btn--active');
   }
}