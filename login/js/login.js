document.querySelectorAll('form[data-login]').forEach(form=>form.addEventListener('submit',async event=>{
 event.preventDefault();const tipo=form.dataset.login;const button=form.querySelector('button[type="submit"]');if(button)button.disabled=true;
 try{const response=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({tipo,email:form.elements.usuario.value,senha:form.elements.senha.value})});const data=await response.json();if(!response.ok)throw new Error(data.erro||'Credenciais inválidas');location.href=tipo==='empresa'?'/painel_empresa/index.html':'/painel_candidato/index.html';}
 catch(error){alert(error.message)}finally{if(button)button.disabled=false}
}));

// Mostrar/ocultar senha em ambos os formulários de login.
document.querySelectorAll('.toggle-password').forEach(button=>{
 button.addEventListener('click',()=>{
  const field=button.closest('.field');const input=field?.querySelector('input[type="password"], input[type="text"]');if(!input)return;
  const visible=input.type==='password';input.type=visible?'text':'password';
  button.setAttribute('aria-pressed',String(visible));button.setAttribute('aria-label',visible?'Ocultar senha':'Mostrar senha');
  const icon=button.querySelector('i');if(icon)icon.className=visible?'fa-regular fa-eye-slash':'fa-regular fa-eye';
 });
});
