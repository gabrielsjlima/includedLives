package br.com.includedlives.model;

import br.com.includedlives.model.enums.TipoHabilidade;
import java.util.Objects;

public class Habilidade {
    private String nome;
    private TipoHabilidade tipo;

    public Habilidade(String nome, TipoHabilidade tipo) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome da habilidade não pode ser vazio.");
        }
        this.nome = nome.trim().toUpperCase();
        this.tipo = tipo != null ? tipo : TipoHabilidade.TECNICA;
    }

    public String getNome() { return nome; }
    public TipoHabilidade getTipo() { return tipo; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Habilidade)) return false;
        Habilidade that = (Habilidade) o;
        return Objects.equals(nome, that.nome);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome);
    }

    @Override
    public String toString() {
        return nome + " (" + tipo + ")";
    }
}