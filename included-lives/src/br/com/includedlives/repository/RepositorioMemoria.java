package br.com.includedlives.repository;

import br.com.includedlives.interfaces.Identificavel;
import java.util.*;

public class RepositorioMemoria<T extends Identificavel<ID>, ID> implements IRepositorio<T, ID> {
    
    private final Map<ID, T> storage = new LinkedHashMap<>();

    @Override
    public void salvar(T entidade) {
        if (entidade == null || entidade.getId() == null) {
            throw new IllegalArgumentException("Entidade ou identificador não pode ser nulo.");
        }
        storage.put(entidade.getId(), entidade);
    }

    @Override
    public Optional<T> buscarPorId(ID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<T> listarTodos() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public boolean remover(ID id) {
        return storage.remove(id) != null;
    }
}