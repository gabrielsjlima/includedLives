const tabs=document.querySelectorAll('[data-tab]');
const forms={candidate:document.getElementById('candidate-form'),company:document.getElementById('company-form')};
const feedback=document.getElementById('feedback');
function selectTab(type){tabs.forEach(tab=>{const active=tab.dataset.tab===type;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});Object.entries(forms).forEach(([key,form])=>form.hidden=key!==type);feedback.textContent='';feedback.className='feedback'}
tabs.forEach(tab=>tab.addEventListener('click',()=>selectTab(tab.dataset.tab)));
const extra=document.createElement('div');extra.className='candidate-extra';extra.innerHTML='<label>CPF (somente números)<input name="cpf" inputmode="numeric" maxlength="14" required></label><label>Data de nascimento<input type="date" name="nascimento" required></label>';
forms.candidate.insertBefore(extra,forms.candidate.querySelector('button[type="submit"]'));
Object.entries(forms).forEach(([type,form])=>form.addEventListener('submit',async event=>{
 event.preventDefault();const v=form.elements;if(v.password.value!==v.confirmPassword.value){feedback.textContent='As senhas precisam ser iguais.';feedback.className='feedback error';return}
 const data={tipo:type==='company'?'empresa':'candidato',nome:type==='company'?v.companyName.value:v.name.value,email:v.email.value,senha:v.password.value,cpf:type==='candidate'?v.cpf.value.replace(/\D/g,''):undefined,nascimento:type==='candidate'?v.nascimento.value:undefined,cnpj:type==='company'?v.cnpj.value.replace(/\D/g,''):undefined,responsavel:type==='company'?v.manager.value:undefined};
 try{const response=await fetch('/api/cadastro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw new Error(result.erro||'Erro no cadastro');if(result.ok!==true)throw new Error('Não foi possível confirmar o cadastro.');form.reset();location.replace('conta-criada.html?tipo='+data.tipo)}catch(error){feedback.textContent=error.message;feedback.className='feedback error'}
}));
document.querySelectorAll('.terms-link').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();feedback.textContent='Esta página ainda será adicionada ao projeto.';feedback.className='feedback error'}));

// Visibilidade independente para os quatro campos de senha.
document.querySelectorAll('.signup-form input[type="password"]').forEach(input => {
 const wrapper = document.createElement('span'); wrapper.className = 'password-wrap';
 input.before(wrapper); wrapper.append(input);
 const button = document.createElement('button'); button.type = 'button'; button.className = 'signup-password-toggle';
 button.setAttribute('aria-label', 'Mostrar ' + (input.name === 'confirmPassword' ? 'confirmação de senha' : 'senha'));
 button.setAttribute('aria-pressed', 'false');
 const icon = document.createElement('i'); icon.className = 'fa-regular fa-eye'; icon.setAttribute('aria-hidden','true'); button.append(icon); wrapper.append(button);
 function setVisible(visible) {
  input.type = visible ? 'text' : 'password'; icon.className = visible ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  button.setAttribute('aria-pressed', String(visible));
  button.setAttribute('aria-label', (visible ? 'Ocultar ' : 'Mostrar ') + (input.name === 'confirmPassword' ? 'confirmação de senha' : 'senha'));
 }
 button.addEventListener('click', () => setVisible(input.type === 'password'));
 input.form.addEventListener('reset', () => setVisible(false));
});
