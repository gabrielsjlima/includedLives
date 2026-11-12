package br.com.includedlives.model;

import br.com.includedlives.interfaces.Autenticavel;
import br.com.includedlives.interfaces.Identificavel;

public abstract class Usuario implements Identificavel<Long>, Autenticavel {
    private Long id;
    private String email;
    private String senha;
    private String contato;
    private String cidade;
    private String uf;

    public Usuario(Long id, String email, String senha, String contato, String cidade, String uf) {
        this.id = id;
        this.email = email;
        this.senha = senha;
        this.contato = contato;
        this.cidade = cidade;
        this.uf = uf;
    }

    @Override
    public Long getId() { return id; }

    public String getEmail() { return email; }
    public String getContato() { return contato; }
    public String getCidade() { return cidade; }
    public String getUf() { return uf; }

    @Override
    public boolean autenticar(String email, String senha) {
        if (email == null || senha == null) return false;
        return this.email.equalsIgnoreCase(email.trim()) && this.senha.equals(senha);
    }

    // Polimorfismo obrigatório: cada subclasse implementa sua visualização de perfil
    public abstract String exibirPerfil();
}