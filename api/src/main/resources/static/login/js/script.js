const form = document.querySelector('#recovery-form');
const emailInput = document.querySelector('#email');
const feedback = document.querySelector('#feedback');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  feedback.classList.remove('error');
  if (!emailInput.validity.valid) {
    feedback.textContent = 'Informe um endereço de e-mail válido.';
    feedback.classList.add('error');
    emailInput.focus();
    return;
  }
  feedback.textContent = 'E-mail validado. Para enviar o link de recuperação, conecte este formulário ao seu backend.';
});
