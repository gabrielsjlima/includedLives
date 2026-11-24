package br.com.includedlives.model;

public class Formacao {
    private String curso;
    private String instituicao;
    private int anoConclusao;

    public Formacao(String curso, String instituicao, int anoConclusao) {
        this.curso = curso;
        this.instituicao = instituicao;
        this.anoConclusao = anoConclusao;
    }

    public String getCurso() { return curso; }
    public String getInstituicao() { return instituicao; }
    public int getAnoConclusao() { return anoConclusao; }

    @Override
    public String toString() {
        return curso + " - " + instituicao + " (" + anoConclusao + ")";
    }
}