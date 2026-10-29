# Evidências de Testes — Banco de Dados MySQL

**Projeto:** IncludedLives  
**Instituição:** FATEC — Desenvolvimento de Software Multiplataforma (DSM)  
**Ambiente:** MySQL Server 8.0.46 / MySQL Workbench  
**Banco de dados:** `includedlives_dev`  
**Data dos testes:** 26/10/2026  
**Branch:** `feature/database-mysql`

## 1. Objetivo

Validar a estrutura inicial do banco de dados IncludedLives, migrada de Oracle para MySQL 8, verificando a criação das tabelas, os relacionamentos, as restrições de integridade e a reversão de operações de teste.

Todos os testes foram realizados em ambiente local de desenvolvimento, utilizando exclusivamente dados fictícios.

## 2. Resultados dos testes

| Teste realizado | Resultado | Evidência |
|---|---|---|
| Criação do banco `includedlives_dev` | Aprovado | Banco criado sem erros |
| Criação das 10 tabelas | Aprovado | 10 instruções `CREATE TABLE` executadas |
| Verificação das chaves estrangeiras | Aprovado | 9 relacionamentos identificados |
| Verificação das restrições | Aprovado | 23 restrições listadas |
| Bloqueio de vaga com quantidade negativa | Aprovado | Erro MySQL 3819 |
| Bloqueio de candidatura com candidato inexistente | Aprovado | Erro MySQL 1452 |
| Bloqueio de candidatura duplicada | Aprovado | Erro MySQL 1062 |
| Reversão dos registros fictícios | Aprovado | `ROLLBACK` executado e contagens zeradas |
| Exclusão em cascata entre candidato e formação | Aprovado | `formacoes_restantes = 0`; `ROLLBACK` executado |

## 3. Testes de integridade

### 3.1. Restrição de quantidade de vagas

Foi executada uma tentativa de inserir uma vaga com quantidade negativa.

**Resultado:**

`Error Code: 3819 — Check constraint 'CK_VAGA_QUANT' is violated.`

O banco rejeitou corretamente a operação, demonstrando o funcionamento da restrição `CHECK (QUANT_VAGA > 0)`.

**Status:** Aprovado.

### 3.2. Integridade referencial

Foi realizada uma tentativa de cadastrar uma candidatura vinculada a um candidato inexistente.

**Resultado:**

`Error Code: 1452 — Cannot add or update a child row.`

A restrição `FK_CANDIDATAR_CANDIDATO` impediu corretamente a operação.

**Status:** Aprovado.

### 3.3. Candidaturas duplicadas

Foram criados registros fictícios de empresa, candidato e vaga, seguidos por uma candidatura válida.

Ao tentar cadastrar novamente o mesmo candidato na mesma vaga, o MySQL apresentou:

`Error Code: 1062 — Duplicate entry.`

A chave primária composta pelos campos `CPF` e `COD_VAGA` impediu a duplicidade.

**Status:** Aprovado.

### 3.4. Reversão de transações

Após o teste de candidatura duplicada, foi executado o comando `ROLLBACK`.

Consultas posteriores confirmaram que os registros fictícios de candidato e empresa utilizados no teste não permaneceram cadastrados.

**Status:** Aprovado.

### 3.5. Exclusão em cascata

Foi executado um teste com as seguintes etapas:

1. Cadastro de um candidato fictício.
2. Cadastro de uma formação vinculada ao candidato.
3. Exclusão do candidato.
4. Consulta dos registros restantes na tabela `FORMACAO`.
5. Execução de `ROLLBACK`.

A consulta retornou `formacoes_restantes = 0`, confirmando
que a formação vinculada foi excluída automaticamente.

O comando `ROLLBACK` foi executado após a verificação.

**Status:** Aprovado.

## 4. Estrutura do banco

O banco contém as seguintes tabelas:

- `EMPRESA`
- `VAGA`
- `CANDIDATO`
- `CID`
- `FORMACAO`
- `EXPERIENCIA`
- `HABILIDADES`
- `ACESSIBILIDADE`
- `CANDIDATAR`
- `TER`

Foram identificadas nove chaves estrangeiras e 23 restrições no relatório de inspeção da estrutura.

## 5. Observações e limitações

- A criação do esquema foi validada no MySQL 8.0.46.
- Os testes utilizaram dados fictícios, sem informações pessoais reais.
- Foram realizados testes de restrições selecionadas, não uma cobertura completa de todas as regras do modelo.
- O funcionamento do backend Java e da conexão Spring Boot/MySQL ainda não foi testado nesta etapa.
- As divergências de nomenclatura e obrigatoriedade entre os modelos lógico e físico continuam documentadas no arquivo `README_MIGRACAO.md`.
- A aprovação final da modelagem depende de revisão pela equipe.

## 6. Conclusão

A migração inicial da estrutura Oracle para MySQL apresentou resultados positivos nos testes executados.

As dez tabelas foram criadas e os nove relacionamentos de chave estrangeira foram identificados. As regras testadas de quantidade de vagas, integridade referencial e prevenção de candidaturas duplicadas funcionaram conforme esperado.

O Pull Request deve permanecer aberto para revisão técnica, sem realizar merge na branch `main` até a aprovação da equipe e a conclusão das verificações pendentes.
