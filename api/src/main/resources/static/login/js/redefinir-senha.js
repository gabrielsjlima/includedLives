const form=document.querySelector('#reset-form'), feedback=document.querySelector('#feedback');
const token=new URLSearchParams(location.hash.slice(1)).get('token');
history.replaceState(null,'',location.pathname);
const senha=document.querySelector('#senha'), confirmar=document.querySelector('#confirmar'), button=form.querySelector('button');
document.querySelector('#mostrar').addEventListener('change',e=>{senha.type=confirmar.type=e.target.checked?'text':'password';});
if(!token||! /^[A-Za-z0-9_-]{43}$/.test(token)){button.disabled=true;feedback.textContent='Link inválido. Solicite outro na página de recuperação.';}
form.addEventListener('submit',async e=>{
 e.preventDefault();feedback.classList.add('error');
 if(senha.value!==confirmar.value){feedback.textContent='As senhas não coincidem.';return;}
 if(senha.value!==senha.value.trim()||new TextEncoder().encode(senha.value).length>72){feedback.textContent='Use até 72 bytes e não deixe espaços nas extremidades.';return;}
 button.disabled=true;
 try{const res=await fetch('/api/redefinir-senha',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,senha:senha.value})});if(!res.ok)throw new Error(res.status===400?'Link inválido, expirado ou já utilizado. Solicite outro.':'Não foi possível redefinir. Tente novamente.');const result=await res.json();if(result.ok!==true)throw new Error('Não foi possível confirmar a redefinição.');form.reset();form.hidden=true;const success=document.querySelector('#reset-success');success.hidden=false;success.querySelector('h2').focus();setTimeout(()=>location.replace('login.html?status=senha-redefinida'),2500);return;}catch(e){feedback.textContent=e.message;button.disabled=false;}
});
