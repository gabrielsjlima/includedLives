document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', () => {
    const input = button.closest('.field').querySelector('input');
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(visible));
    button.setAttribute('aria-label', visible ? 'Ocultar senha' : 'Mostrar senha');
    button.querySelector('i').className = visible ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  });
});
// Conecte os formulários ao seu backend quando a autenticação estiver pronta.
document.querySelectorAll('form[data-login]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    alert('Interface pronta! Configure o backend para autenticar o acesso de ' + form.dataset.login + '.');
  });
});
document.querySelectorAll('[data-placeholder-link]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    alert('Esta página ainda precisa ser implementada.');
  });
});
