const tipo = new URLSearchParams(location.search).get('tipo');
const mensagem = document.querySelector('#account-message');
if(tipo === 'empresa') mensagem.textContent = 'Sua conta empresarial está pronta. Entre com seu e-mail e senha para começar.';
if(tipo === 'candidato') mensagem.textContent = 'Sua conta de candidato(a) está pronta. Entre com seu e-mail e senha para começar.';
