const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
const faqItems=[...document.querySelectorAll('.faq-item')];faqItems.forEach(item=>{const button=item.querySelector('.faq-trigger');const answer=item.querySelector('.faq-answer');button.addEventListener('click',()=>{const opening=button.getAttribute('aria-expanded')!=='true';faqItems.forEach(other=>{other.classList.remove('is-open');other.querySelector('.faq-trigger').setAttribute('aria-expanded','false');other.querySelector('.faq-answer').hidden=true});item.classList.toggle('is-open',opening);button.setAttribute('aria-expanded',String(opening));answer.hidden=!opening})});const search=document.querySelector('#searchInput');search?.addEventListener('input',()=>{const q=search.value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');let shown=0;faqItems.forEach(item=>{const text=(item.textContent+' '+(item.dataset.search||'')).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');item.hidden=!text.includes(q);if(!item.hidden)shown++});document.querySelector('#noResults').hidden=shown>0});


// Compacta o cabeçalho ao sair do topo e restaura ao voltar.
// O CSS usa a mesma variável para calcular o espaço das seções.
(() => {
  let compact = false;
  let scheduled = false;
  function updateHeader() {
    const y = window.scrollY;
    const next = compact ? y > 24 : y > 90;
    if (next !== compact) {
      compact = next;
      document.body.classList.toggle('header-compact', compact);
    }
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateHeader);
    }
  }, { passive:true });
  updateHeader();
})();
