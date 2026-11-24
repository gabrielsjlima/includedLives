const form = document.querySelector('#recovery-form');
const tipo = document.querySelector('#tipo');
const feedback = document.querySelector('#feedback');
if(new URLSearchParams(location.search).get('tipo') === 'empresa') tipo.value='empresa';
form.addEventListener('submit', async event => {
 event.preventDefault(); if(!form.reportValidity()) return;
 const button=form.querySelector('button'); button.disabled=true; feedback.classList.remove('error'); feedback.textContent='Enviando...';
 try {
  const res=await fetch('/api/recuperar-senha',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tipo:tipo.value,email:form.email.value.trim()})});
  if(!res.ok) throw new Error(res.status===429?'Aguarde antes de tentar novamente.':'Serviço indisponível. Tente mais tarde.');
  feedback.textContent='Se existir uma conta com esses dados, você receberá um link. Confira também o spam.';
 } catch(e){feedback.classList.add('error');feedback.textContent=e.message;} finally {button.disabled=false;}
});
