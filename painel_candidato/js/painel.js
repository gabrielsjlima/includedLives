const views = [...document.querySelectorAll(".view")],
  nav = [...document.querySelectorAll("[data-view]")];

function go(id) {
  if (!document.getElementById(id)?.classList.contains("view")) return;
  views.forEach((v) => v.classList.toggle("active", v.id === id));
  document
    .querySelectorAll(".side-link")
    .forEach((b) => b.classList.toggle("active", b.dataset.view === id));
  document.getElementById("accountMenu").hidden = true;
  history.replaceState(null, "", "#" + id);
  document.getElementById("main").scrollTop = 0;
  if(id==='mensagens' && window.ILives?.csrf) renderMessages().catch(e=>notify(e.message));
}

nav.forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    go(el.dataset.view);
  }),
);

window.addEventListener("hashchange", () =>
  go(location.hash.slice(1) || "painel"),
);

go(location.hash.slice(1) || "painel");

const dialog = document.getElementById("dialog");

function showDialog(title, body) {
  document.getElementById("dialogTitle").textContent = title;
  document.getElementById("dialogBody").textContent = body;
  dialog.showModal();
}

const toast = document.getElementById("toast");

function notify(message) {
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => (toast.style.display = "none"), 3200);
}

document.getElementById("orientacoesBtn").onclick = () =>
  showDialog(
    "Orientações da entrevista",
    "Confirme com a empresa a data, o horário e o formato da entrevista. Se for online, use o link enviado pela empresa."
  );

const recursoDialog = document.getElementById('recursoDialog'), recursoForm = document.getElementById('recursoForm'), recursoErro = document.getElementById('recursoErro');
const api = (path, method, body) => ILives.request(path, method, body);
const resume = document.getElementById('resumeForm');
const search = document.getElementById('jobSearch'), results = document.getElementById('jobResults');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let allJobs = [];
const fieldNames=['nome','email','resumo','contato','cep','logradouro','numero','bairro','cidade','uf','complemento'];
function fillResume(p) { const values={nome:p.NOME,email:p.EMAIL,resumo:p.SOBRE_MIM,contato:p.CONTATO,cep:p.CEP,logradouro:p.LOGRADOURO,numero:p.NUMERO,bairro:p.BAIRRO,cidade:p.CIDADE,uf:p.UF,complemento:p.COMPLEMENTO};fieldNames.forEach(k=>{if(resume.elements[k])resume.elements[k].value=values[k]||''});if(p.FOTO_PERFIL){const img=document.getElementById('candidatePhoto');img.src='/api/candidato/foto';img.hidden=false;} }
function makeButton(label,fn,cls='outline'){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=label;b.onclick=fn;return b}
function jobCard(j,saved=false){const d=document.createElement('article');d.className='candidate-job';const top=document.createElement('div');top.className='candidate-job-top';const heading=document.createElement('div');const h=document.createElement('h3');h.textContent=j.titulo;const employer=document.createElement('p');employer.className='job-company';employer.textContent=j.empresa||'Empresa';heading.append(h,employer);const chip=document.createElement('span');chip.className='job-chip';chip.textContent=[j.cidade,j.uf].filter(Boolean).join(' - ')||'Local não informado';top.append(heading,chip);d.append(top);const meta=document.createElement('p');meta.className='job-meta';meta.textContent=[j.modelo,j.contrato].filter(Boolean).join(' • ');if(meta.textContent)d.append(meta);if(j.descricao){const desc=document.createElement('p');desc.className='job-desc';desc.textContent=j.descricao;d.append(desc)}const actions=document.createElement('div');actions.className='candidate-actions';if(saved){actions.append(makeButton('Remover dos salvos',async()=>{try{await api('/vagas/'+j.id+'/salvar','DELETE');notify('Vaga removida dos salvos');await renderSaved()}catch(e){notify(e.message)}}));actions.append(makeButton('Ver oportunidades',()=>go('vagas'),'primary'))}else{actions.append(makeButton('Candidatar-se',async()=>{try{await api('/vagas/'+j.id+'/candidatar','POST');notify('Candidatura enviada!');await renderApplications()}catch(e){notify(e.message)}},'primary'));actions.append(makeButton('Salvar vaga',async()=>{try{await api('/vagas/'+j.id+'/salvar','POST');notify('Vaga salva!');await renderSaved()}catch(e){notify(e.message)}}))}d.append(actions);return d}
async function renderJobs(){const q=search.value.toLocaleLowerCase('pt-BR');results.replaceChildren();const jobs=allJobs.filter(j=>(j.titulo+' '+j.empresa+' '+j.cidade).toLocaleLowerCase('pt-BR').includes(q));if(!jobs.length){results.innerHTML='<div class="candidate-empty">Nenhuma vaga disponível com esses filtros.</div>';return}jobs.forEach(j=>results.append(jobCard(j)))}
const statusNames={INSCRITO:'Inscrito',EM_ANALISE:'Em análise',ENTREVISTA:'Entrevista',APROVADO:'Aprovado',FINALIZADO:'Finalizado'};
async function renderApplications(){const target=document.getElementById('integratedApplications');if(!target)return;try{const apps=(await api('/minhas-candidaturas')).filter(a=>a.status!=='REPROVADO');target.replaceChildren();if(!apps.length){target.innerHTML='<div class="candidate-empty">Você ainda não possui candidaturas em andamento. <button class="primary" type="button" data-view="vagas">Buscar vagas</button></div>';return}apps.forEach(a=>{const d=document.createElement('article');d.className='candidate-application';const h=document.createElement('h3');h.textContent=a.titulo;const company=document.createElement('p');company.className='job-company';company.textContent=a.empresa;const badge=document.createElement('span');badge.className='stage-badge stage-'+a.status.toLowerCase();badge.textContent=statusNames[a.status]||a.status;const top=document.createElement('div');top.className='candidate-job-top';const left=document.createElement('div');left.append(h,company);top.append(left,badge);d.append(top);const steps=document.createElement('div');steps.className='application-steps';const stages=['INSCRITO','EM_ANALISE','ENTREVISTA','APROVADO'];stages.forEach((stage,i)=>{const x=document.createElement('span');x.textContent=statusNames[stage];x.className=stages.indexOf(a.status)>=i?'step done':'step';steps.append(x)});d.append(steps);d.append(makeButton('Conversar com a empresa',async()=>{try{const cv=await api('/conversas','POST',{vagaId:a.vagaId});go('mensagens');await renderMessages(cv.id)}catch(e){notify(e.message)}},'primary'));target.append(d)})}catch(e){target.textContent=e.message}}
async function renderSaved(){const target=document.getElementById('savedLive');if(!target)return;target.replaceChildren();try{const saved=await api('/vagas-salvas');if(!saved.length){const empty=document.createElement('div');empty.className='candidate-empty';empty.textContent='Você ainda não salvou nenhuma vaga.';empty.append(makeButton('Buscar vagas',()=>go('vagas'),'primary'));target.append(empty);return}saved.forEach(j=>target.append(jobCard(j,true)))}catch(e){target.textContent=e.message}}
resume.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(resume));try{await api('/curriculo','PUT',d);notify('Currículo atualizado!')}catch(err){notify(err.message)}};
const photoUpload=document.getElementById('photoUpload');photoUpload.onchange=async()=>{const f=photoUpload.files?.[0];if(!f)return;if(f.size>2*1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type)){notify('Escolha JPG, PNG ou WebP de até 2 MB.');photoUpload.value='';return}try{const form=new FormData();form.append('foto',f);const response=await fetch('/api/candidato/foto',{method:'POST',body:form,credentials:'same-origin',headers:{'X-CSRF-Token':ILives.csrf}});if(!response.ok)throw Error('Não foi possível enviar a foto');const img=document.getElementById('candidatePhoto');img.src='/api/candidato/foto?t='+Date.now();img.hidden=false;notify('Foto atualizada!')}catch(e){notify(e.message)}};
const resourceButton = document.getElementById('recursoBtn'); resourceButton.onclick = () => recursoDialog.showModal(); document.getElementById('cancelarRecurso').onclick = () => recursoDialog.close(); recursoForm.onsubmit = e => { e.preventDefault(); recursoDialog.close(); notify('Para solicitar recursos à empresa, entre em contato pelos canais informados na vaga. Este formulário ainda não envia solicitações.') };
document.getElementById('accountBtn').onclick = () => { const m = document.getElementById('accountMenu'); m.hidden = !m.hidden };
const logout = document.createElement('button'); logout.textContent = 'Sair da conta'; logout.onclick = () => ILives.logout(); document.getElementById('accountMenu').append(logout);
search.addEventListener('input', renderJobs);
for (const id of ['largeText', 'contrast', 'reduceMotion', 'written']) { const el = document.getElementById(id); if (el) el.onchange = () => { document.body.classList.toggle('preference-' + id, el.checked) } }
document.getElementById('candidateAccountForm').onsubmit=async e=>{e.preventDefault();try{await api('/candidato/conta','PUT',Object.fromEntries(new FormData(e.target)));e.target.elements.atual.value='';e.target.elements.nova.value='';notify('Dados de acesso atualizados!')}catch(err){notify(err.message)}};
ILives.auth('candidato').then(async () => { const [p, jobs, formacoes, habs] = await Promise.all([api('/perfil'), api('/vagas'), api('/formacoes'), api('/habilidades')]); fillResume(p); document.getElementById('candidateAccountForm').elements.email.value=p.EMAIL||''; const nomeUsuario = p.NOME || 'Usuário'; document.querySelector('#accountBtn span:nth-child(2)').textContent = nomeUsuario; document.querySelector('#painel h1').textContent = 'Olá, ' + (p.NOME || '') + '!'; document.querySelector('#painel .hero-grid .next').hidden = true; document.querySelector('#painel .applications').hidden = true; document.querySelector('#painel .update').hidden = true; allJobs = jobs; resume.elements.formacao.value = formacoes.map(f => f.curso).filter(Boolean).join(', '); resume.elements.habilidades.value = habs.map(h => h.nome).join(', '); renderJobs(); renderApplications(); renderSaved(); }).catch(() => location.replace('/login/login.html'));

let candidateChat=null;
async function renderMessages(openId){
 const target=document.getElementById('candidateMessages');if(!target)return;
 const convs=await api('/conversas');
 target.innerHTML=`<div class="chat-layout"><div class="chat-list"><h3>Conversas</h3>${convs.length?convs.map(c=>`<button type="button" data-chat="${c.id}"><strong>${esc(c.empresa)}</strong><small>${esc(c.vaga)}</small>${Number(c.naoLidas)?`<span class="unread-count">${Number(c.naoLidas)}</span>`:''}</button>`).join(''):'<p>Você ainda não possui conversas. Após se candidatar a uma vaga, poderá conversar com a empresa.</p>'}</div><div class="chat-content" id="candidateChat"><p>Selecione uma conversa.</p></div></div>`;
 target.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>openCandidateChat(Number(b.dataset.chat)));
 const selected=openId||candidateChat;
 if(selected&&convs.some(c=>Number(c.id)===Number(selected)))await openCandidateChat(Number(selected));
}
async function openCandidateChat(id){
 candidateChat=id;const convs=await api('/conversas');const item=convs.find(c=>Number(c.id)===id);if(!item)return;
 const msgs=await api('/conversas/'+id+'/mensagens');const el=document.getElementById('candidateChat');if(!el)return;
 el.innerHTML=`<div class="chat-heading"><div><h3>${esc(item.empresa)}</h3><p>${esc(item.vaga)}</p></div><button type="button" class="outline" id="candidateDeleteConversation">Excluir conversa</button></div><div class="chat-history" role="log" aria-label="Histórico de mensagens">${msgs.length?msgs.map(m=>`<div class="chat-bubble ${m.remetente==='candidato'?'mine':'theirs'}">${esc(m.texto)}</div>`).join(''):'<p>Nenhuma mensagem ainda.</p>'}</div><form id="candidateChatForm"><label for="candidateChatText">Mensagem</label><textarea id="candidateChatText" maxlength="2000" rows="2" required placeholder="Digite sua mensagem..."></textarea><button class="primary">Enviar</button></form>`;
 el.querySelector('#candidateDeleteConversation').onclick=async()=>{if(!confirm('Ocultar esta conversa da sua lista? O histórico continuará disponível para a empresa.'))return;try{await api('/conversas/'+id,'DELETE');candidateChat=null;await renderMessages();notify('Conversa removida da sua lista.')}catch(e){notify(e.message)}};const history=el.querySelector('.chat-history');history.scrollTop=history.scrollHeight;
 await api('/conversas/'+id+'/lidas','PUT');
 el.querySelector('form').onsubmit=async e=>{e.preventDefault();try{await api('/conversas/'+id+'/mensagens','POST',{texto:el.querySelector('textarea').value});await renderMessages(id)}catch(err){notify(err.message)}};
}
