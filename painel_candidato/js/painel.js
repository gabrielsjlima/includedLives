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

const recursoDialog = document.getElementById("recursoDialog");
const recursoForm = document.getElementById("recursoForm");
const recursoErro = document.getElementById("recursoErro");

// Abre a janela e recupera as opções salvas neste navegador.
document.getElementById("recursoBtn").onclick = () => {
  const salvos = (localStorage.getItem("ilives_recurso") ?? "").split("; ");

  recursoForm.querySelectorAll('input[name="recurso"]').forEach((caixa) => {
    caixa.checked = salvos.includes(caixa.value);
  });

  recursoErro.textContent = "";
  recursoDialog.showModal();
};

// Fecha sem salvar alterações.
document.getElementById("cancelarRecurso").onclick = () => {
  recursoDialog.close();
};

recursoForm.addEventListener("submit", (event) => {
  // Evita recarregar a página e pega todas as opções marcadas.
  event.preventDefault();
  const recursos = new FormData(recursoForm).getAll("recurso");

  if (recursos.length === 0) {
    recursoErro.textContent = "Marque pelo menos um recurso para salvar.";
    return;
  }

  // Nesta versão, a seleção fica salva só neste navegador.
  localStorage.setItem("ilives_recurso", recursos.join("; "));
  recursoDialog.close();
  notify("Seleção salva neste navegador. Ela ainda não foi enviada à empresa.");
});

const resume = document.getElementById("resumeForm");

try {
  const data = JSON.parse(localStorage.getItem("ilives_curriculo") || "null");
  if (data)
    Object.entries(data).forEach(([k, v]) => {
      if (resume.elements.namedItem(k)) resume.elements.namedItem(k).value = v;
    });
} catch {}
resume.addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem(
    "ilives_curriculo",
    JSON.stringify(Object.fromEntries(new FormData(resume))),
  );
  notify("Currículo salvo neste navegador!");
});
[
  ["largeText", "large-text"],
  ["contrast", "high-contrast"],
  ["reduceMotion", "reduce-motion"],
]

.forEach(([id, cls]) => {
  const el = document.getElementById(id);
  el.checked = localStorage.getItem("ilives_" + id) === "true";
  document.body.classList.toggle(cls, el.checked);
  
  el.onchange = () => {
    document.body.classList.toggle(cls, el.checked);
    localStorage.setItem("ilives_" + id, String(el.checked));
  };
});

const written = document.getElementById("written");

written.checked = localStorage.getItem("ilives_written") === "true";

written.onchange = () =>
  localStorage.setItem("ilives_written", String(written.checked));
const search = document.getElementById("jobSearch"),
  results = document.getElementById("jobResults");

function renderJobs() {
  const state = ILives.getState();

  const q = search.value.toLocaleLowerCase("pt-BR");

  const jobs = (state?.jobs || []).filter(
    (j) =>
      j.status === "Publicada" &&
      [j.title, j.city, state.company?.name]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(q),
  );

  results.replaceChildren();
  if (!state) {
    results.textContent =
      "Abra o painel da empresa uma vez para inicializar as vagas demonstrativas.";
    return;
  }
  if (!jobs.length) {
    results.textContent = "Nenhuma vaga publicada encontrada.";
    return;
  }
  jobs.forEach((j) => {
    const d = document.createElement("div");
    d.className = "job";
    const h = document.createElement("h3");
    h.textContent = j.title;
    const info = document.createElement("p");
    info.textContent = [state.company?.name, j.city, j.model]
      .filter(Boolean)
      .join(" • ");
    const desc = document.createElement("p");
    desc.textContent = j.description || "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "primary";
    btn.textContent = "Candidatar-se";
    btn.addEventListener("click", () => {
      const r = ILives.apply(j.id);
      notify(r.message);
      renderApplications();
    });
    d.append(h, info, desc, btn);
    results.append(d);
  });
}

function renderApplications() {
  const section = document.getElementById("candidaturas");

  if (!section) return;

  let target = document.getElementById("integratedApplications");

  if (!target) {
    target = document.createElement("div");
    target.id = "integratedApplications";
    target.className = "card listcard";
    section.append(target);
  }
  
  const state = ILives.getState();
  target.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "Minhas candidaturas demonstrativas";
  target.append(title);
  const apps = ILives.getApplications();
  if (!apps.length) {
    const p = document.createElement("p");
    p.textContent = "Você ainda não se candidatou pelo protótipo.";
    target.append(p);
  }

  apps.forEach((a) => {
    const item = document.createElement("p");
    const job = state?.jobs?.find((j) => j.id === a.jobId);

    const companyCandidate = state?.candidates?.find(
      (c) => c.demoApplicationId === a.id,
    );
    item.textContent = `${job?.title || "Vaga removida"} — ${companyCandidate?.stage || a.stage} (${a.date})`;
    target.append(item);
  });
}

search.addEventListener("input", renderJobs);

window.addEventListener("storage", () => {
  renderJobs();
  renderApplications();
});

renderJobs();
renderApplications();

// Ao abrir o painel, mostra o início da página e o cabeçalho.
window.addEventListener('load', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
});

// O mesmo botão do usuário terá funções diferentes:
// mobile: abre a navegação completa;
// desktop: abre as opções da conta.
const accountBtn = document.getElementById("accountBtn");
const accountMenu = document.getElementById("accountMenu");
const candidateMenu = document.getElementById("candidateMenu");

// Usa o mesmo limite de largura definido no CSS.
const mobileMenu = window.matchMedia("(max-width: 850px)");

// Mostra ou esconde a navegação completa no celular.
function setCandidateMenuOpen(open) {
  candidateMenu.classList.toggle("is-open", open);

  // Informa aos leitores de tela se o menu está aberto.
  accountBtn.setAttribute("aria-expanded", String(open));
  accountBtn.setAttribute(
    "aria-label",
    open ? "Fechar menu do candidato" : "Abrir menu do candidato"
  );
}

// Clique no ícone do usuário.
accountBtn.onclick = () => {
  if (mobileMenu.matches) {
    // No celular, fecha o menu pequeno e alterna o menu completo.
    accountMenu.hidden = true;

    setCandidateMenuOpen(
      !candidateMenu.classList.contains("is-open")
    );
  } else {
    // No desktop, mantém as opções atuais da conta.
    accountMenu.hidden = !accountMenu.hidden;

    accountBtn.setAttribute(
      "aria-expanded",
      String(!accountMenu.hidden)
    );
  }
};

// Fecha a navegação depois de escolher uma seção.
candidateMenu.querySelectorAll(".side-link").forEach((button) => {
  button.addEventListener("click", () => {
    if (mobileMenu.matches) {
      setCandidateMenuOpen(false);
    }
  });
});

// Atualiza o botão quando a tela muda entre mobile e desktop.
function updateAccountButton() {
  candidateMenu.classList.remove("is-open");
  accountMenu.hidden = true;

  accountBtn.setAttribute("aria-expanded", "false");
  accountBtn.setAttribute(
    "aria-controls",
    mobileMenu.matches ? "candidateMenu" : "accountMenu"
  );
  accountBtn.setAttribute(
    "aria-label",
    mobileMenu.matches
      ? "Abrir menu do candidato"
      : "Abrir opções da conta"
  );
}

// Configura ao carregar e ao redimensionar a tela.
updateAccountButton();
mobileMenu.addEventListener("change", updateAccountButton);

  // Cada toque alterna entre abrir e fechar.
  menuToggle.addEventListener("click", () => {
    setMenuOpen(!candidateMenu.classList.contains("is-open"));
  });

  // Fecha o menu após selecionar uma seção.
  candidateMenu.querySelectorAll(".side-link").forEach((button) => {
    button.addEventListener("click", () => setMenuOpen(false));
  });
