package br.com.includedlives.service;

import br.com.includedlives.exception.CandidaturaDuplicadaException;
import br.com.includedlives.exception.RegraNegocioException;
import br.com.includedlives.exception.VagaInativaException;
import br.com.includedlives.model.Candidato;
import br.com.includedlives.model.Candidatura;
import br.com.includedlives.model.Vaga;
import br.com.includedlives.model.enums.StatusVaga;
import br.com.includedlives.repository.IRepositorio;

import java.util.List;
import java.util.stream.Collectors;

public class CandidaturaService {
    private final IRepositorio<Candidatura, String> candidaturaRepo;

    public CandidaturaService(IRepositorio<Candidatura, String> candidaturaRepo) {
        this.candidaturaRepo = candidaturaRepo;
    }

    public Candidatura realizarInscricao(Candidato candidato, Vaga vaga) {
        if (candidato == null || vaga == null) {
            throw new IllegalArgumentException("Candidato e vaga são obrigatórios para a inscrição.");
        }

        if (vaga.getStatus() != StatusVaga.ATIVA) {
            throw new VagaInativaException("RN01: Candidatura recusada! A vaga '" + vaga.getNomeVaga() 
                    + "' está " + vaga.getStatus() + " e não recebe inscrições.");
        }

        String chave = candidato.getId() + "_" + vaga.getId();
        if (candidaturaRepo.buscarPorId(chave).isPresent()) {
            throw new CandidaturaDuplicadaException("RN02: O candidato '" + candidato.getNome() 
                    + "' já possui uma inscrição ativa na vaga '" + vaga.getNomeVaga() + "'.");
        }

        Candidatura nova = new Candidatura(candidato, vaga);
        candidaturaRepo.salvar(nova);
        return nova;
    }

    public List<Candidatura> listarPorCandidato(Long idCandidato) {
        return candidaturaRepo.listarTodos().stream()
                .filter(c -> c.getCandidato().getId().equals(idCandidato))
                .collect(Collectors.toList());
    }

    public List<Candidatura> listarPorVaga(Long codVaga) {
        return candidaturaRepo.listarTodos().stream()
                .filter(c -> c.getVaga().getId().equals(codVaga))
                .collect(Collectors.toList());
    }
}