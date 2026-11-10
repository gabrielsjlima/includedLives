const overview = document.getElementById("overview"),
  workspace = document.getElementById("workspace"),
  accountButton = document.getElementById("accountButton"),
  accountMenu = document.getElementById("accountMenu");
const initial = {
  jobs: [
    {
      id: 1,
      title: "Assistente administrativo",
      city: "Porto Ferreira, SP",
      model: "Presencial",
      type: "CLT",
      salary: "A combinar",
      status: "Publicada",
      description: "Apoiar rotinas administrativas, documentos e atendimento.",
      access: "Comunicação por escrito, acesso sem degraus",
      applications: 15,
    },
    {
      id: 2,
      title: "Auxiliar de expedição",
      city: "Porto Ferreira, SP",
      model: "Presencial",
      type: "CLT",
      salary: "A combinar",
      status: "Publicada",
      description: "Separação de mercadorias e organização do estoque.",
      access: "Acesso sem degraus",
      applications: 8,
    },
    {
      id: 3,
      title: "Assistente de logística",
      city: "Porto Ferreira, SP",
      model: "Híbrido",
      type: "CLT",
      salary: "A combinar",
      status: "Rascunho",
      description: "Controle de pedidos e apoio logístico.",
      access: "A confirmar",
      applications: 0,
    },
  ],
  candidates: [
    {
      id: 1,
      name: "Ana Souza",
      initials: "AS",
      job: 1,
      stage: "Entrevista",
      skills: "Organização, Excel, atendimento",
      access: "Comunicação por escrito",
      updated: "Hoje",
      notes: "",
    },
    {
      id: 2,
      name: "Carlos Lima",
      initials: "CL",
      job: 1,
      stage: "Em análise",
      skills: "Pacote Office, comunicação",
      access: "Legendas",
      updated: "Há 2 dias",
      notes: "",
    },
    {
      id: 3,
      name: "Juliana Alves",
      initials: "JA",
      job: 1,
      stage: "Inscrição recebida",
      skills: "Administração, atendimento",
      access: "Acesso sem degraus",
      updated: "Hoje",
      notes: "",
    },
    {
      id: 4,
      name: "Rafael Santos",
      initials: "RS",
      job: 2,
      stage: "Em análise",
      skills: "Logística, estoque",
      access: "Comunicação por escrito",
      updated: "Há 3 dias",
      notes: "",
    },
  ],
  talents: [
    {
      id: 1,
      name: "Mariana Oliveira",
      city: "Porto Ferreira",
      skills: "Atendimento, Excel",
      area: "Administrativo",
    },
    {
      id: 2,
      name: "Lucas Pereira",
      city: "São Carlos",
      skills: "Logística, estoque",
      area: "Logística",
    },
    {
      id: 3,
      name: "Beatriz Costa",
      city: "Pirassununga",
      skills: "Comunicação, suporte",
      area: "Atendimento",
    },
  ],
  company: {
    name: "Transportadora Porto Ferreira",
    email: "contato@exemplo.com",
    city: "Porto Ferreira, SP",
    description: "Empresa comprometida com oportunidades inclusivas.",
    website: "",
    contact: "Equipe de recrutamento",
  },
  messages: [
    {
      id: 1,
      from: "Ana Souza",
      text: "Gostaria de confirmar os recursos de acessibilidade para a entrevista.",
      reply: "",
    },
  ],
};
const KEY = "ilives-empresa-demo-v2";
let state;
try {
  state = JSON.parse(localStorage.getItem(KEY)) || structuredClone(initial);
} catch {
  state = structuredClone(initial);
}
const persist = () => ILives.saveState(state);
let current = "visao-geral",
  jobId = 1,
  personId = 1,
  tab = "candidaturas";
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const byId = (id) => state.jobs.find((j) => j.id === +id);
const cname = (id) => byId(id)?.title || "Vaga não encontrada";
const badge = (s) =>
  `<span class="ws-pill ${["Publicada", "Entrevista", "Entrevista agendada"].includes(s) ? "ok" : ["Em análise", "Rascunho"].includes(s) ? "warn" : ""}">${esc(s)}</span>`;
function notify(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("visible");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => t.classList.remove("visible"), 3500);
}
const head = (title, sub = "", action = "") =>
  `<div class="ws-head"><div><h1>${title}</h1><p class="ws-sub">${sub}</p></div>${action}</div>`;
const button = (label, action, primary = false) =>
  `<button class="ws-btn ${primary ? "primary" : ""}" data-action="${action}">${label}</button>`;
function overviewSync() {
  const stats = overview.querySelectorAll(".stat-card strong");
  if (stats.length) {
    stats[0].textContent = state.jobs.filter(
      (j) => j.status === "Publicada",
    ).length;
    stats[1].textContent = state.candidates.filter((c) =>
      ["Inscrição recebida", "Em análise"].includes(c.stage),
    ).length;
    stats[2].textContent = state.candidates.filter(
      (c) => c.stage === "Entrevista",
    ).length;
  }
  const tbody = overview.querySelector(".jobs tbody");
  tbody.innerHTML = state.jobs
    .slice(0, 4)
    .map(
      (j) =>
        `<tr><td>${esc(j.title)}</td><td>${badge(j.status)}</td><td>${j.applications}</td><td><button class="btn btn-outline" data-action="manage:${j.id}">Gerenciar</button></td><td></td></tr>`,
    )
    .join("");
}
function jobs() {
  return (
    head(
      "Minhas vagas",
      "Gerencie suas oportunidades e acompanhe candidaturas.",
      button('<i class="fa-solid fa-plus"></i> Publicar vaga', "new-job", true),
    ) +
    `<div class="ws-card"><div class="ws-tools"><input id="jobSearch" placeholder="Buscar por cargo ou cidade" aria-label="Buscar vagas"><select id="jobStatus"><option value="">Todas as situações</option><option>Publicada</option><option>Rascunho</option><option>Pausada</option></select></div><div class="ws-table-wrap"><table class="ws-table"><thead><tr><th>Vaga</th><th>Situação</th><th>Candidaturas</th><th>Ações</th></tr></thead><tbody id="jobRows"></tbody></table></div></div>`
  );
}
function drawJobs() {
  const q = (document.getElementById("jobSearch")?.value || "").toLowerCase(),
    status = document.getElementById("jobStatus")?.value || "";
  document.getElementById("jobRows").innerHTML =
    state.jobs
      .filter(
        (j) =>
          (j.title + " " + j.city).toLowerCase().includes(q) &&
          (!status || j.status === status),
      )
      .map(
        (j) =>
          `<tr><td><b>${esc(j.title)}</b><div class="ws-muted">${esc(j.city)} · ${esc(j.model)}</div></td><td>${badge(j.status)}</td><td>${j.applications}</td><td><div class="ws-actions">${button("Gerenciar", "manage:" + j.id)}${button("Editar", "edit:" + j.id)}</div></td></tr>`,
      )
      .join("") || '<tr><td colspan="4">Nenhuma vaga encontrada.</td></tr>';
}

// Guardamos esta opção em uma constante porque ela também será
// usada na validação: “Não oferece” precisa ser marcado sozinho.
const SEM_RECURSOS = "Não oferece recursos específicos no momento";

// Cada item desta lista vai virar uma caixinha no formulário.
// Para acrescentar uma opção no futuro, basta incluir outro texto aqui.
const RECURSOS_DA_VAGA = [
  "Acessibilidade física (rampas, elevadores e banheiros adaptados)",
  "Intérprete de Libras",
  "Legendas e comunicação visual",
  "Leitor de tela e softwares acessíveis",
  "Materiais em Braille ou fonte ampliada",
  "Mobiliário e equipamentos adaptados",
  "Ambiente com controle de estímulos sensoriais",
  "Instruções e treinamentos adaptados",
  "Acompanhamento por profissional ou equipe de apoio",
  "Horário flexível",
  "Trabalho remoto ou híbrido",
  "Pausas adaptadas",
  SEM_RECURSOS,
];

// Recebe a vaga que está sendo criada ou editada
// e devolve o HTML do checklist.
function renderAccessChecklist(vaga) {
  // Na edição, recupera as opções salvas. Se não houver lista,
  // usa um array vazio e todas as caixinhas começam desmarcadas.
  const marcados = vaga.accessOptions ?? [];

  // map() cria um trecho de HTML para cada recurso.
  // includes() verifica se aquele recurso já estava marcado.
  // join("") reúne os trechos em um só texto, sem vírgulas entre eles.
  const opcoes = RECURSOS_DA_VAGA.map((recurso) => {
    const checked = marcados.includes(recurso) ? "checked" : "";

    // esc() protege o HTML ao inserir textos dentro da página.
    // O label permite marcar a caixinha clicando também no texto.
    return `
      <label class="ws-check">
        <input type="checkbox" name="accessOptions"
          value="${esc(recurso)}" ${checked}>
        <span>${esc(recurso)}</span>
      </label>
    `;
  }).join("");

  // fieldset reúne as opções em um grupo; legend dá nome ao grupo.
  // ${opcoes} insere aqui todas as caixinhas montadas acima.
  return `
    <fieldset class="ws-fieldset job-access-checklist">
      <legend>Recursos de acessibilidade disponíveis</legend>
      <p class="ws-muted">Marque os recursos disponíveis para esta vaga.</p>

      <div class="ws-grid two">
        ${opcoes}
      </div>

    </fieldset>
  `;
}

function editJob(id) {
  const j = id
    ? byId(id)
    : {
        title: "",
        city: "Porto Ferreira, SP",
        model: "Presencial",
        type: "CLT",
        salary: "A combinar",
        status: "Rascunho",
        description: "",
        access: "",
        applications: 0,
      };

  //Insere o checklist de acessibilidade da vaga logo após a descrição.
  return (
    head(
      id ? "Editar vaga" : "Publicar nova vaga",
      "Preencha as informações e salve a oportunidade.",
      button("Voltar às vagas", "go:vagas"),
    ) +
    `<form id="jobForm" class="ws-card" data-id="${id || ""}"><div class="ws-grid two"><label>Título da vaga<input name="title" required maxlength="100" value="${esc(j.title)}"></label><label>Cidade<input name="city" required value="${esc(j.city)}"></label><label>Modelo de trabalho<select name="model">${["Presencial", "Híbrido", "Remoto"].map((x) => `<option ${j.model === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><label>Tipo de contratação<select name="type">${["CLT", "PJ", "Estágio", "Temporário"].map((x) => `<option ${j.type === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><label>Salário<input name="salary" value="${esc(j.salary)}"></label><label>Situação<select name="status">${["Rascunho", "Publicada", "Pausada"].map((x) => `<option ${j.status === x ? "selected" : ""}>${x}</option>`).join("")}</select></label></div><div class="ws-list" style="margin-top:16px"><label>Descrição da oportunidade<textarea name="description" required>${esc(j.description)}</textarea></label>${renderAccessChecklist(j)}</div><div class="ws-actions" style="margin-top:18px"><button class="ws-btn primary" type="submit">Salvar vaga</button>${button("Cancelar", "go:vagas")}</div></form>`
  );
}
function candidates() {
  return (
    head(
      "Candidaturas",
      "Acompanhe pessoas candidatas e atualize as etapas dos processos.",
    ) +
    `<div class="ws-card"><div class="ws-tools"><input id="candidateSearch" placeholder="Buscar por nome ou habilidade"><select id="candidateStage"><option value="">Todas as etapas</option>${["Inscrição recebida", "Em análise", "Entrevista", "Entrevista agendada", "Aprovada", "Não selecionada"].map((s) => `<option>${s}</option>`).join("")}</select></div><div class="ws-table-wrap"><table class="ws-table candidate-table"><thead><tr><th>Pessoa candidata</th><th>Vaga</th><th>Etapa</th><th>Atualização</th><th>Ação</th></tr></thead><tbody id="candidateRows"></tbody></table></div></div>`
  );
}
function drawCandidates(jobFilter) {
  const q = (
      document.getElementById("candidateSearch")?.value || ""
    ).toLowerCase(),
    stage = document.getElementById("candidateStage")?.value || "";
  document.getElementById("candidateRows").innerHTML =
    state.candidates
      .filter(
        (c) =>
          (c.name + " " + c.skills).toLowerCase().includes(q) &&
          (!stage || c.stage === stage) &&
          (!jobFilter || c.job === jobFilter),
      )
      .map(
        (c) =>
          `<tr><td><b>${esc(c.name)}</b><div class="ws-muted">${esc(c.skills)}</div></td><td>${esc(cname(c.job))}</td><td>${badge(c.stage)}</td><td>${esc(c.updated)}</td><td>${button("Ver candidatura", "person:" + c.id)}</td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="5">Nenhuma candidatura encontrada.</td></tr>';
}
function person(id) {
  const c = state.candidates.find((x) => x.id === +id);
  if (!c) return "<p>Candidatura não encontrada.</p>";
  return (
    head(
      esc(c.name),
      "Candidatura para " + esc(cname(c.job)),
      button("Voltar às candidaturas", "go:candidaturas"),
    ) +
    `<div class="ws-split"><div class="ws-card"><h2>Perfil da pessoa candidata</h2><p><b>Habilidades:</b> ${esc(c.skills)}</p><p><b>Recursos solicitados:</b> ${esc(c.access)}</p><p><b>Última atualização:</b> ${esc(c.updated)}</p><div class="ws-notice">Dados de demonstração. Informações reais devem vir de um cadastro autorizado.</div></div><form id="personForm" class="ws-card" data-id="${c.id}"><h2>Atualizar processo</h2><div class="ws-list"><label>Etapa<select name="stage">${["Inscrição recebida", "Em análise", "Entrevista", "Entrevista agendada", "Aprovada", "Não selecionada"].map((s) => `<option ${c.stage === s ? "selected" : ""}>${s}</option>`).join("")}</select></label><label>Observações internas<textarea name="notes">${esc(c.notes)}</textarea></label><button class="ws-btn primary" type="submit">Salvar atualização</button></div></form></div>`
  );
}
function manage(id) {
  const j = byId(id);
  if (!j) return "Vaga não encontrada";
  return (
    `<p class="ws-muted">Minhas vagas / ${esc(j.title)}</p>` +
    head(
      esc(j.title),
      esc(j.city) + " · " + esc(j.model) + " · " + esc(j.type),
      button("Editar vaga", "edit:" + id),
    ) +
    `<div class="ws-tabs">${["candidaturas", "sobre", "acessibilidade", "historico"].map((t) => `<button class="ws-tab ${tab === t ? "active" : ""}" data-action="tab:${t}">${{ candidaturas: "Candidaturas", sobre: "Sobre a vaga", acessibilidade: "Acessibilidade", historico: "Histórico" }[t]}</button>`).join("")}</div><div id="manageTab"></div>`
  );
}
function drawManageTab() {
  const j = byId(jobId),
    el = document.getElementById("manageTab");
  if (!el) return;
  if (tab === "candidaturas") {
    el.innerHTML =
      `<div class="ws-grid two"><div class="ws-card ws-stat"><i class="fa-solid fa-users"></i><div><strong>${state.candidates.filter((c) => c.job === jobId).length}</strong><p>Candidaturas demonstrativas</p></div></div><div class="ws-card ws-stat"><i class="fa-regular fa-calendar"></i><div><strong>${state.candidates.filter((c) => c.job === jobId && c.stage.includes("Entrevista")).length}</strong><p>Entrevistas</p></div></div></div>` +
      candidates().replace(
        head(
          "Candidaturas",
          "Acompanhe pessoas candidatas e atualize as etapas dos processos.",
        ),
        "",
      );
    drawCandidates(jobId);
  } else if (tab === "sobre") {
    el.innerHTML = `<div class="ws-card"><h2>Sobre a vaga</h2><p>${esc(j.description)}</p><p><b>Modelo:</b> ${esc(j.model)} · <b>Contrato:</b> ${esc(j.type)} · <b>Salário:</b> ${esc(j.salary)}</p>${badge(j.status)}</div>`;
  } else if (tab === "acessibilidade") {
    el.innerHTML = `<div class="ws-card"><h2>Recursos de acessibilidade</h2><p>${esc(j.access || "Ainda não informado")}</p>${button("Editar recursos", "edit:" + j.id)}</div>`;
  } else {
    el.innerHTML = `<div class="ws-card"><h2>Histórico da vaga</h2><p>Esta demonstração registra alterações localmente no navegador.</p>${
      (state.history || [])
        .filter((h) => h.job === j.id)
        .map((h) => `<p>• ${esc(h.text)} — ${esc(h.date)}</p>`)
        .join("") || "<p>Nenhuma alteração registrada nesta sessão.</p>"
    }</div>`;
  }
}
function talents() {
  return (
    head(
      "Banco de talentos",
      "Explore perfis demonstrativos por área e habilidade.",
    ) +
    `<div class="ws-card"><div class="ws-tools"><input id="talentSearch" placeholder="Buscar por nome, área ou habilidade"></div><div id="talentRows" class="ws-grid"></div></div>`
  );
}
function drawTalents() {
  const q = (
    document.getElementById("talentSearch")?.value || ""
  ).toLowerCase();
  document.getElementById("talentRows").innerHTML =
    state.talents
      .filter((t) =>
        (t.name + " " + t.area + " " + t.skills).toLowerCase().includes(q),
      )
      .map(
        (t) =>
          `<article class="ws-card"><h2>${esc(t.name)}</h2><p>${esc(t.city)} · ${esc(t.area)}</p><p class="ws-muted">${esc(t.skills)}</p>${button("Convidar para vaga", "invite:" + t.id)}</article>`,
      )
      .join("") || "<p>Nenhum talento encontrado.</p>";
}
function profile() {
  const c = state.company;
  return (
    head(
      "Perfil da empresa",
      "Atualize as informações exibidas sobre sua organização.",
    ) +
    `<form id="companyForm" class="ws-card"><div class="ws-grid two">${[
      ["name", "Nome da empresa"],
      ["email", "E-mail de contato"],
      ["city", "Cidade"],
      ["website", "Site"],
      ["contact", "Responsável pelo recrutamento"],
    ]
      .map(
        ([k, l]) =>
          `<label>${l}<input name="${k}" value="${esc(c[k])}" ${k === "name" ? "required" : ""}></label>`,
      )
      .join(
        "",
      )}</div><label style="margin-top:16px">Sobre a empresa<textarea name="description">${esc(c.description)}</textarea></label><button class="ws-btn primary" style="margin-top:16px" type="submit">Salvar perfil</button></form>`
  );
}
function guidance() {
  return (
    head(
      "Orientações e boas práticas",
      "Recursos para processos seletivos inclusivos e acessíveis.",
    ) +
    `<div class="ws-grid two">${[
      [
        "fa-universal-access",
        "Descreva a acessibilidade",
        "Informe recursos existentes na vaga e permita solicitações individuais.",
      ],
      [
        "fa-comments",
        "Comunicação clara",
        "Explique etapas, prazos e formatos de entrevista em linguagem simples.",
      ],
      [
        "fa-user-check",
        "Seleção justa",
        "Avalie habilidades relevantes para o cargo e evite critérios discriminatórios.",
      ],
      [
        "fa-calendar-check",
        "Entrevistas acessíveis",
        "Confirme antecipadamente o formato e os recursos solicitados.",
      ],
    ]
      .map(
        ([i, t, p]) =>
          `<article class="ws-card ws-guide"><i class="fa-solid ${i}"></i><div><h2>${t}</h2><p>${p}</p></div></article>`,
      )
      .join(
        "",
      )}</div><div class="ws-card"><h2>Checklist antes de publicar</h2><div class="ws-list">${["Descrição objetiva da função", "Requisitos realmente necessários", "Modelo de trabalho e local informados", "Recursos de acessibilidade descritos", "Canal de contato para dúvidas"].map((s, i) => `<label class="ws-check"><input type="checkbox" data-check="${i}" ${state.checks?.includes(i) ? "checked" : ""}> ${s}</label>`).join("")}</div></div>`
  );
}
function messages() {
  return (
    head(
      "Mensagens",
      "Central demonstrativa de conversas com pessoas candidatas.",
    ) +
    `<div class="ws-card ws-list">${state.messages.map((m) => `<div class="ws-card"><h2>${esc(m.from)}</h2><p>${esc(m.text)}</p>${m.reply ? `<div class="ws-notice">Sua resposta: ${esc(m.reply)}</div>` : ""}<form class="messageForm" data-id="${m.id}"><label>Responder<textarea name="reply" required placeholder="Escreva uma resposta..."></textarea></label><button class="ws-btn primary" type="submit">Salvar resposta local</button></form></div>`).join("")}</div>`
  );
}
function help() {
  return (
    head("Ajuda", "Encontre orientações para usar o painel.") +
    `<div class="ws-card"><h2>Perguntas frequentes</h2><details><summary>Como publicar uma vaga?</summary><p>Abra Minhas vagas, selecione Publicar vaga, preencha os campos e escolha Publicada.</p></details><hr><details><summary>Como acompanhar candidaturas?</summary><p>Use a seção Candidaturas para pesquisar pessoas e atualizar as etapas.</p></details><hr><details><summary>As informações são enviadas automaticamente?</summary><p>Não. Este protótipo armazena dados apenas no navegador; não envia e-mails ou mensagens reais.</p></details></div>`
  );
}
function render() {
  const home = current === "visao-geral";
  overview.hidden = !home;
  workspace.hidden = home;
  if (home) {
    overviewSync();
  } else {
    workspace.innerHTML =
      current === "vagas"
        ? jobs()
        : current === "editar"
          ? editJob(jobId || null)
          : current === "novo"
            ? editJob(null)
            : current === "candidaturas"
              ? candidates()
              : current === "pessoa"
                ? person(personId)
                : current === "gerenciar"
                  ? manage(jobId)
                  : current === "talentos"
                    ? talents()
                    : current === "perfil"
                      ? profile()
                      : current === "orientacoes"
                        ? guidance()
                        : current === "mensagens"
                          ? messages()
                          : help();
    if (current === "vagas") drawJobs();
    if (current === "candidaturas") drawCandidates();
    if (current === "gerenciar") drawManageTab();
    if (current === "talentos") drawTalents();
  }
  document.querySelectorAll(".nav-link").forEach((b) => {
    const p = ["editar", "novo", "gerenciar"].includes(current)
      ? "vagas"
      : current === "pessoa"
        ? "candidaturas"
        : current;
    b.classList.toggle("active", b.dataset.page === p);
  });
  accountMenu.hidden = true;
  accountButton.setAttribute("aria-expanded", "false");
}
function navigate(page) {
  current = page;
  render();
  history.replaceState(null, "", "#" + page);
  document.querySelector(".main").scrollTop = 0;
  window.scrollTo(0, 0);
}
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action],[data-page]");
  if (target) {
    const a = target.dataset.action;
    if (a) {
      const [verb, id] = a.split(":");
      if (verb === "go") navigate(id);
      else if (verb === "manage") {
        jobId = +id;
        tab = "candidaturas";
        navigate("gerenciar");
      } else if (verb === "edit") {
        jobId = +id;
        navigate("editar");
      } else if (verb === "new-job") {
        jobId = 0;
        navigate("novo");
      } else if (verb === "person") {
        personId = +id;
        navigate("pessoa");
      } else if (verb === "tab") {
        tab = id;
        render();
      } else if (verb === "invite")
        notify("Convite demonstrativo: integração com backend pendente.");
    } else {
      navigate(target.dataset.page);
    }
    return;
  }
  if (!e.target.closest(".account")) {
    accountMenu.hidden = true;
    accountButton.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("input", (e) => {
  if (["jobSearch", "jobStatus"].includes(e.target.id)) drawJobs();
  if (["candidateSearch", "candidateStage"].includes(e.target.id))
    drawCandidates(current === "gerenciar" ? jobId : undefined);
  if (e.target.id === "talentSearch") drawTalents();
});
document.addEventListener("change", (e) => {
  if (e.target.dataset.check !== undefined) {
    const n = +e.target.dataset.check;
    state.checks = state.checks || [];
    state.checks = e.target.checked
      ? [...new Set([...state.checks, n])]
      : state.checks.filter((x) => x !== n);
    persist();
  }
  if (["jobStatus", "candidateStage"].includes(e.target.id))
    e.target.dispatchEvent(new Event("input", { bubbles: true }));
});
document.addEventListener("submit", (e) => {
  const f = e.target;
  if (
    !["jobForm", "personForm", "companyForm"].includes(f.id) &&
    !f.classList.contains("messageForm")
  )
    return;
  e.preventDefault();
  // Guarda o formulário para poder ler todas as caixinhas marcadas.
  const formData = new FormData(f);
  const data = Object.fromEntries(formData);
  if (f.id === "jobForm") {
    const id = +f.dataset.id;
    const j = id
      ? byId(id)
      : {
          id: Math.max(0, ...state.jobs.map((x) => x.id)) + 1,
          applications: 0,
        };
// getAll() pega todas as caixinhas marcadas, mesmo com o mesmo nome.
const marcados = formData.getAll("accessOptions");
const semRecursos = marcados.includes(SEM_RECURSOS);

// “Não oferece recursos” não pode ser salvo junto com outros recursos.
if (semRecursos && marcados.length > 1) {
  notify("Marque “Não oferece recursos” sozinho ou desmarque essa opção.");
  return;
}

// Preserva o texto que já existia nas vagas antigas.
const textoAnterior =
  j.accessOther ?? (Array.isArray(j.accessOptions) ? "" : j.access ?? "");

    // A lista serve para remarcar as caixinhas ao abrir a vaga em Editar.
    data.accessOptions = marcados;
    data.accessOther = textoAnterior;

    // A aba Acessibilidade continua recebendo um resumo em texto.
    // Se a empresa marcou “Não oferece recursos”, exibe só essa opção.
    data.access = semRecursos
    ? SEM_RECURSOS
    : [...marcados, textoAnterior].filter(Boolean).join("; ");

    // Aplica os dados do formulário à vaga atual.
    Object.assign(j, data);
    if (!id) state.jobs.push(j);
    state.history = state.history || [];
    state.history.push({
      job: j.id,
      text: id ? "Vaga editada" : "Vaga criada",
      date: new Date().toLocaleDateString("pt-BR"),
    });
    persist();
    notify("Vaga salva neste navegador.");
    navigate("vagas");
  } else if (f.id === "personForm") {
    const c = state.candidates.find((x) => x.id === +f.dataset.id);
    Object.assign(c, data, { updated: "Hoje" });
    persist();
    notify("Etapa atualizada localmente.");
    render();
  } else if (f.id === "companyForm") {
    Object.assign(state.company, data);
    persist();
    notify("Perfil salvo localmente.");
  } else {
    const m = state.messages.find((x) => x.id === +f.dataset.id);
    m.reply = data.reply;
    persist();
    notify("Resposta salva localmente, sem envio.");
    render();
  }
});
accountButton.addEventListener("click", () => {
  accountMenu.hidden = !accountMenu.hidden;
  accountButton.setAttribute("aria-expanded", String(!accountMenu.hidden));
});
window.addEventListener("hashchange", () => {
  const page = location.hash.slice(1);
  if (
    [
      "visao-geral",
      "vagas",
      "candidaturas",
      "talentos",
      "perfil",
      "orientacoes",
      "mensagens",
      "ajuda",
    ].includes(page)
  )
    navigate(page);
});
navigate(
  [
    "visao-geral",
    "vagas",
    "candidaturas",
    "talentos",
    "perfil",
    "orientacoes",
    "mensagens",
    "ajuda",
  ].includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : "visao-geral",
);

window.addEventListener("storage", (e) => {
  if (e.key === KEY) {
    state = ILives.getState() || state;
    render();
  }
});

// Identifica o botão e o menu da empresa no HTML.
const companyMenuToggle = document.getElementById("companyMenuToggle");
const companyMenu = document.getElementById("companyMenu");

if (companyMenuToggle && companyMenu) {
  function setCompanyMenuOpen(open) {
    // A classe definida no CSS mostra ou esconde o menu mobile.
    companyMenu.classList.toggle("is-open", open);

    // Atualiza o estado e a descrição do botão.
    companyMenuToggle.setAttribute("aria-expanded", String(open));
    companyMenuToggle.setAttribute(
      "aria-label",
      open ? "Fechar menu" : "Abrir menu"
    );
  }

  // Cada toque alterna entre abrir e fechar.
  companyMenuToggle.addEventListener("click", () => {
    setCompanyMenuOpen(!companyMenu.classList.contains("is-open"));
  });

  // Fecha o menu após escolher uma das seções.
  companyMenu.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => setCompanyMenuOpen(false));
  });
}