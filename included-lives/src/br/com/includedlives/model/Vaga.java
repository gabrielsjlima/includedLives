package br.com.includedlives.model;

import br.com.includedlives.interfaces.Identificavel;
import br.com.includedlives.model.enums.StatusVaga;
import java.math.BigDecimal;

public class Vaga implements Identificavel<Long> {
    private Long codVaga;
    private Empresa empresa;
    private String nomeVaga;
    private StatusVaga status;
    private String cidade;
    private String uf;
    private int quantVaga;
    private BigDecimal salario;
    private String acessibilidadeOferecida;

    public Vaga(Long codVaga, Empresa empresa, String nomeVaga, int quantVaga, 
                String cidade, String uf, BigDecimal salario, String acessibilidadeOferecida) {
        if (quantVaga <= 0) {
            throw new IllegalArgumentException("A quantidade de vagas ofertadas deve ser maior que zero.");
        }
        this.codVaga = codVaga;
        this.empresa = empresa;
        this.nomeVaga = nomeVaga;
        this.quantVaga = quantVaga;
        this.cidade = cidade;
        this.uf = uf;
        this.salario = salario;
        this.acessibilidadeOferecida = acessibilidadeOferecida;
        this.status = StatusVaga.ATIVA;
    }

    @Override
    public Long getId() { return codVaga; }

    public Empresa getEmpresa() { return empresa; }
    public String getNomeVaga() { return nomeVaga; }
    public StatusVaga getStatus() { return status; }
    public int getQuantVaga() { return quantVaga; }
    public String getCidade() { return cidade; }
    public String getUf() { return uf; }
    public BigDecimal getSalario() { return salario; }
    public String getAcessibilidadeOferecida() { return acessibilidadeOferecida; }

    public void encerrar() {
        this.status = StatusVaga.ENCERRADA;
    }

    public void pausar() {
        this.status = StatusVaga.PAUSADA;
    }

    public void ativar() {
        this.status = StatusVaga.ATIVA;
    }

    @Override
    public String toString() {
        return String.format("[%d] %s (%s/%s) | Status: %s | Vagas: %d | Acessibilidade: %s",
                codVaga, nomeVaga, cidade, uf, status, quantVaga, acessibilidadeOferecida);
    }
}