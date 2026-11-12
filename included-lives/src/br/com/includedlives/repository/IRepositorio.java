package br.com.includedlives.repository;

import java.util.List;
import java.util.Optional;

public interface IRepositorio<T, ID> {
    void salvar(T entidade);
    Optional<T> buscarPorId(ID id);
    List<T> listarTodos();
    boolean remover(ID id);
}