const tabs=document.querySelectorAll('[data-tab]');
const forms={candidate:document.getElementById('candidate-form'),company:document.getElementById('company-form')};
const feedback=document.getElementById('feedback');
function selectTab(type){tabs.forEach(tab=>{const active=tab.dataset.tab===type;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});Object.entries(forms).forEach(([key,form])=>form.hidden=key!==type);feedback.textContent='';feedback.className='feedback'}
tabs.forEach(tab=>tab.addEventListener('click',()=>selectTab(tab.dataset.tab)));
const extra=document.createElement('div');extra.innerHTML='<label>CPF (somente números)<input name="cpf" inputmode="numeric" maxlength="14" required></label><label>Data de nascimento<input type="date" name="nascimento" required></label>';
forms.candidate.insertBefore(extra,forms.candidate.querySelector('button[type="submit"]'));
Object.entries(forms).forEach(([type,form])=>form.addEventListener('submit',async event=>{
 event.preventDefault();const v=form.elements;if(v.password.value!==v.confirmPassword.value){feedback.textContent='As senhas precisam ser iguais.';feedback.className='feedback error';return}
 const data={tipo:type==='company'?'empresa':'candidato',nome:type==='company'?v.companyName.value:v.name.value,email:v.email.value,senha:v.password.value,cpf:type==='candidate'?v.cpf.value.replace(/\D/g,''):undefined,nascimento:type==='candidate'?v.nascimento.value:undefined,cnpj:type==='company'?v.cnpj.value.replace(/\D/g,''):undefined,responsavel:type==='company'?v.manager.value:undefined};
 try{const response=await fetch('/api/cadastro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw new Error(result.erro||'Erro no cadastro');feedback.textContent='Cadastro realizado! Você já pode fazer login.';feedback.className='feedback success';form.reset()}catch(error){feedback.textContent=error.message;feedback.className='feedback error'}
}));
document.querySelectorAll('.terms-link').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();feedback.textContent='Esta página ainda será adicionada ao projeto.';feedback.className='feedback error'}));
