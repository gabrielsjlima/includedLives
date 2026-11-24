package br.com.includedlives.model;

import java.util.*;

public class Empresa extends Usuario {
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private String ramo;

    // Agregação: Empresa possui uma lista de vagas criadas
    private List<Vaga> vagasCadastradas = new ArrayList<>();

    public Empresa(Long id, String email, String senha, String contato, String cidade, String uf,
                   String razaoSocial, String nomeFantasia, String cnpj, String ramo) {
        super(id, email, senha, contato, cidade, uf);
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.ramo = ramo;
    }

    public void registrarVaga(Vaga vaga) {
        if (vaga != null) {
            this.vagasCadastradas.add(vaga);
        }
    }

    public String getRazaoSocial() { return razaoSocial; }
    public String getNomeFantasia() { return nomeFantasia; }
    public String getCnpj() { return cnpj; }
    public String getRamo() { return ramo; }
    public List<Vaga> getVagasCadastradas() { return Collections.unmodifiableList(vagasCadastradas); }

    @Override
    public String exibirPerfil() {
        return "\n================ PERFIL CORPORATIVO ================\n" +
               "ID: " + getId() + " | Fantasia: " + nomeFantasia + "\n" +
               "Razão Social: " + razaoSocial + " | CNPJ: " + cnpj + "\n" +
               "Ramo: " + ramo + " | E-mail: " + getEmail() + "\n" +
               "Sede: " + getCidade() + "/" + getUf() + "\n" +
               "Total de Vagas Ofertadas: " + vagasCadastradas.size() + "\n" +
               "====================================================\n";
    }
}