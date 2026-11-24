// Exibe até três vagas ativas retornadas pela API pública.
(async () => {
 const grid = document.getElementById('publicJobs');
 if (!grid) return;
 function message(text) { const p = document.createElement('p'); p.className = 'jobs-message'; p.textContent = text; grid.replaceChildren(p); }
 function element(tag, cls, text) { const el = document.createElement(tag); if (cls) el.className = cls; if (text) el.textContent = text; return el; }
 function icon(cls) { const i = element('i', cls); i.setAttribute('aria-hidden','true'); return i; }
 function line(cls, text) { const p = element('p'); p.append(icon(cls), document.createTextNode(' ' + text)); return p; }
 try {
  const response = await fetch('/api/vagas', {cache:'no-store'});
  if (!response.ok) throw new Error('Falha ao consultar vagas');
  const jobs = await response.json();
  if (!Array.isArray(jobs)) throw new Error('Resposta inválida');
  if (!jobs.length) { message('Nenhuma vaga disponível no momento. Volte em breve para conferir novas oportunidades.'); return; }
  grid.replaceChildren();
  jobs.slice(0,3).forEach(job => {
   const card = element('article','job');
   const company = element('div','company'); const symbol = element('span','company-symbol'); symbol.append(icon('fa-solid fa-building')); company.append(symbol, document.createTextNode(job.empresa || 'Empresa'));
   const location = [job.cidade, job.uf].filter(Boolean).join(' - ') || 'Local não informado';
   const salary = job.remuneracao == null ? 'SALÁRIO NÃO INFORMADO' : Number(job.remuneracao).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
   const link = element('a','btn btn-job','QUERO ME CANDIDATAR'); link.href = '../login/login.html'; link.append(icon('fa-solid fa-arrow-right'));
   card.append(company, element('h3','',job.titulo || 'Vaga'), line('fa-solid fa-location-dot',location), line('fa-solid fa-circle-dollar-to-slot',salary), link); grid.append(card);
  });
 } catch (error) { message('Não foi possível carregar as vagas. Atualize a página para tentar novamente.'); }
 finally { grid.setAttribute('aria-busy','false'); }
})();
