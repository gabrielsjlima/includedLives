package br.com.includedlives.model;

import br.com.includedlives.interfaces.Identificavel;
import br.com.includedlives.model.enums.StatusCandidatura;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Candidatura implements Identificavel<String> {
    private Candidato candidato;
    private Vaga vaga;
    private LocalDateTime dataCandidatura;
    private StatusCandidatura status;

    public Candidatura(Candidato candidato, Vaga vaga) {
        this.candidato = candidato;
        this.vaga = vaga;
        this.dataCandidatura = LocalDateTime.now();
        this.status = StatusCandidatura.INSCRITO;
    }

    @Override
    public String getId() {
        return candidato.getId() + "_" + vaga.getId();
    }

    public Candidato getCandidato() { return candidato; }
    public Vaga getVaga() { return vaga; }
    public LocalDateTime getDataCandidatura() { return dataCandidatura; }
    public StatusCandidatura getStatus() { return status; }

    public void avancarEtapa() {
        if (this.status == StatusCandidatura.INSCRITO) {
            this.status = StatusCandidatura.EM_ANALISE;
        } else if (this.status == StatusCandidatura.EM_ANALISE) {
            this.status = StatusCandidatura.ENTREVISTA;
        } else if (this.status == StatusCandidatura.ENTREVISTA) {
            this.status = StatusCandidatura.FINALIZADO;
        }
    }

    @Override
    public String toString() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return String.format("Inscrição [%s]: Candidato '%s' na Vaga '%s' (Empresa: %s) | Etapa: %s",
                dataCandidatura.format(dtf), candidato.getNome(), vaga.getNomeVaga(),
                vaga.getEmpresa().getNomeFantasia(), status);
    }
}