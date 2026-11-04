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
// A autenticação real deve ser implementada no servidor antes de produção.
document.querySelectorAll('form[data-login]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const role = form.dataset.login;
    if (confirm('Este é um protótipo sem autenticação. Deseja abrir o painel de demonstração?')) location.href = role === 'empresa' ? '../painel_empresa/index.html' : '../painel_candidato/index.html';
  });
});
