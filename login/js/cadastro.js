const tabs = document.querySelectorAll('[data-tab]');
const forms = { candidate: document.getElementById('candidate-form'), company: document.getElementById('company-form') };
const feedback = document.getElementById('feedback');

function selectTab(type) {
  tabs.forEach(tab => {
    const active = tab.dataset.tab === type;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  Object.entries(forms).forEach(([key, form]) => { form.hidden = key !== type; });
  feedback.textContent = '';
  feedback.className = 'feedback';
}

tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab.dataset.tab)));

// A validação é somente visual/local. Nenhum dado é enviado ou salvo.
Object.entries(forms).forEach(([type, form]) => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const password = form.elements.password.value;
    const confirmation = form.elements.confirmPassword.value;
    if (password !== confirmation) {
      feedback.textContent = 'As senhas precisam ser iguais.';
      feedback.className = 'feedback error';
      form.elements.confirmPassword.focus();
      return;
    }
    feedback.textContent = 'Formulário validado! O cadastro estará disponível após a integração com o backend.';
    feedback.className = 'feedback success';
  });
});

// Links de termos são marcadores visuais até as páginas legais existirem.
document.querySelectorAll('.terms-link').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  feedback.textContent = 'Esta página ainda será adicionada ao projeto.';
  feedback.className = 'feedback error';
}));
