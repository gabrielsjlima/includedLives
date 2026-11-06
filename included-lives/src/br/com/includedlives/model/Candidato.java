package br.com.includedlives.model;

import java.util.*;

public class Candidato extends Usuario {
    private String nome;
    private String cpf;
    private String cid;
    private String tipoDeficiencia;
    private String recursoNecessario;
    private boolean disponivelBanco;

    // Composição e Coleções: List e Set
    private List<Formacao> formacoes = new ArrayList<>();
    private Set<Habilidade> habilidades = new HashSet<>();

    public Candidato(Long id, String email, String senha, String contato, String cidade, String uf,
                     String nome, String cpf, String cid, String tipoDeficiencia, String recursoNecessario) {
        super(id, email, senha, contato, cidade, uf);
        this.nome = nome;
        this.cpf = cpf;
        this.cid = cid;
        this.tipoDeficiencia = tipoDeficiencia;
        this.recursoNecessario = recursoNecessario;
        this.disponivelBanco = true;
    }

    public void adicionarFormacao(Formacao formacao) {
        if (formacao != null) {
            this.formacoes.add(formacao);
        }
    }

    public void adicionarHabilidade(Habilidade habilidade) {
        if (habilidade != null) {
            this.habilidades.add(habilidade);
        }
    }

    public String getNome() { return nome; }
    public String getCpf() { return cpf; }
    public String getCid() { return cid; }
    public String getTipoDeficiencia() { return tipoDeficiencia; }
    public String getRecursoNecessario() { return recursoNecessario; }
    public boolean isDisponivelBanco() { return disponivelBanco; }
    public void setDisponivelBanco(boolean disponivelBanco) { this.disponivelBanco = disponivelBanco; }

    public List<Formacao> getFormacoes() { return Collections.unmodifiableList(formacoes); }
    public Set<Habilidade> getHabilidades() { return Collections.unmodifiableSet(habilidades); }

    @Override
    public String exibirPerfil() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n================ PERFIL CANDIDATO (PCD) ================\n");
        sb.append("ID: ").append(getId()).append(" | Nome: ").append(nome).append("\n");
        sb.append("CPF: ").append(cpf).append(" | E-mail: ").append(getEmail()).append("\n");
        sb.append("Localização: ").append(getCidade()).append("/").append(getUf()).append("\n");
        sb.append("CID: ").append(cid).append(" | Deficiência: ").append(tipoDeficiencia).append("\n");
        sb.append("Apoio/Acessibilidade: ").append(recursoNecessario).append("\n");
        sb.append("Disponível no Banco de Talentos: ").append(disponivelBanco ? "SIM" : "NÃO").append("\n");
        sb.append("--- Habilidades (Set) ---\n");
        for (Habilidade h : habilidades) {
            sb.append(" * ").append(h).append("\n");
        }
        sb.append("--- Formação Acadêmica (List) ---\n");
        for (Formacao f : formacoes) {
            sb.append(" * ").append(f).append("\n");
        }
        sb.append("========================================================\n");
        return sb.toString();
    }
}