package br.com.includedlives.service;

import br.com.includedlives.exception.RegraNegocioException;
import br.com.includedlives.model.Empresa;
import br.com.includedlives.model.Vaga;
import br.com.includedlives.model.enums.StatusVaga;
import br.com.includedlives.repository.IRepositorio;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class VagaService {
    private final IRepositorio<Vaga, Long> vagaRepo;
    private long seqId = 1L;

    public VagaService(IRepositorio<Vaga, Long> vagaRepo) {
        this.vagaRepo = vagaRepo;
    }

    public Vaga cadastrarVaga(Empresa empresa, String titulo, int quantidade, 
                              String cidade, String uf, BigDecimal salario, String acessibilidade) {
        if (quantidade <= 0) {
            throw new RegraNegocioException("RN03: Não é permitido abrir uma vaga com quantidade menor ou igual a zero.");
        }
        Vaga nova = new Vaga(seqId++, empresa, titulo, quantidade, cidade, uf, salario, acessibilidade);
        vagaRepo.salvar(nova);
        empresa.registrarVaga(nova);
        return nova;
    }

    public List<Vaga> listarVagasAtivas() {
        return vagaRepo.listarTodos().stream()
                .filter(v -> v.getStatus() == StatusVaga.ATIVA)
                .collect(Collectors.toList());
    }

    public Vaga buscarPorId(Long id) {
        return vagaRepo.buscarPorId(id)
                .orElseThrow(() -> new RegraNegocioException("Vaga com ID " + id + " não encontrada."));
    }
}