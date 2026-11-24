package br.com.includedlives.exception;

public class CandidaturaDuplicadaException extends RegraNegocioException {
    public CandidaturaDuplicadaException(String mensagem) {
        super(mensagem);
    }
}