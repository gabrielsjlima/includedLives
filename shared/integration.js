/* Integração local do protótipo. Não é autenticação nem banco de dados. */
window.ILives = {
  key: 'ilives-empresa-demo-v2',
  getState() { try { return JSON.parse(localStorage.getItem(this.key) || 'null'); } catch { return null; } },
  saveState(state) { localStorage.setItem(this.key, JSON.stringify(state)); window.dispatchEvent(new Event('ilives:update')); },
  getApplications() { try { return JSON.parse(localStorage.getItem('ilives_applications') || '[]'); } catch { return []; } },
  apply(jobId) {
    const id = Number(jobId), state = this.getState();
    if (!state?.jobs?.some(j => j.id === id && j.status === 'Publicada')) return { ok: false, message: 'Vaga indisponível. Atualize a página.' };
    const apps = this.getApplications();
    if (apps.some(a => a.jobId === id)) return { ok: false, message: 'Você já se candidatou a esta vaga neste navegador.' };
    const resume = JSON.parse(localStorage.getItem('ilives_curriculo') || '{}');
    const name = String(resume.nome || 'Candidato de demonstração').trim().slice(0, 100);
    const app = { id: Date.now(), jobId: id, name, stage: 'Inscrição recebida', date: new Date().toLocaleDateString('pt-BR') };
    apps.push(app); localStorage.setItem('ilives_applications', JSON.stringify(apps));
    state.candidates.push({ id: Math.max(0, ...state.candidates.map(c => c.id)) + 1, name, initials: name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(), job: id, stage: app.stage, skills: String(resume.habilidades || ''), access: 'A combinar', updated: 'Hoje', notes: 'Candidatura demonstrativa', demoApplicationId: app.id });
    state.jobs.find(j => j.id === id).applications += 1;
    this.saveState(state); return { ok: true, message: 'Candidatura registrada neste navegador (demonstração).' };
  }
};
