# Included Lives - Plataforma Inclusiva de Oportunidades PCD

**Disciplina:** Técnicas de Programação I  
**Curso:** Tecnologia em Desenvolvimento de Software Multiplataforma (DSM) - FATEC  
**Professora:** Profa. Me. Eliza Bomfim  
**Data de Entrega:** 06/Novembro/2026  

---

## 1. Integrantes do Grupo
* Adriana Carla Rodrigues
* Gabriel Sebastião;
* Maria Luísa;
* Pâmela Roberta;
* Vinícius Sodré Vito;
* Wallace Petterson;

---

## 2. Descrição do Problema
Pessoas com deficiência (PCD) frequentemente encontram barreiras estruturais em plataformas convencionais de emprego, onde vagas anunciadas sob a Lei de Cotas omitem os recursos reais de acessibilidade do ambiente laboral (como rampas, intérpretes de Libras ou leitores de tela), gerando incompatibilidade no processo de seleção.

## 3. Público-Alvo e Usuários
* **Candidatos PCD:** Profissionais que buscam oportunidades de trabalho com detalhes de apoio, recursos ergonômicos e compatibilidade com seu CID.
* **Empresas Contratantes:** Organizações comprometidas com a diversidade que publicam vagas estruturadas com indicação transparente de recursos acessíveis oferecidos.

## 4. Objetivo da Aplicação
Prover um sistema orientado a objetos robusto para o gerenciamento de perfis profissionais, anúncios de vagas inclusivas e controle de candidaturas, garantindo validações de negócio e segurança de dados.

---

## 5. Principais Funcionalidades
1. Cadastro especializado de Candidatos PCD com laudos, CIDs, habilidades e escolaridade.
2. Cadastro corporativo de Empresas e publicação de oportunidades com detalhamento de acessibilidade.
3. Consulta e filtragem de vagas ativas com critérios de localidade e suporte técnico.
4. Inscrição de candidatos em vagas com travas contra duplicidade e vagas inativas.
5. Controle progressivo das etapas de recrutamento (Inscrito -> Em Análise -> Entrevista -> Finalizado).
6. Demonstração de perfis unificados através de polimorfismo.

---

## 6. Mapeamento de Conceitos de POO Obrigatórios

* **Encapsulamento:** Todos os atributos em todas as classes de domínio são estritamente `private`. O acesso e as mutações ocorrem exclusivamente por métodos que realizam validações de integridade. Coleções internas expostas por getters retornam cópias imutáveis (`Collections.unmodifiableList` e `Collections.unmodifiableSet`).
* **Composição e Agregação:** 
  * `Candidato` possui composição com listas de `Formacao` e conjunto de `Habilidade`.
  * `Empresa` possui agregação com instâncias de `Vaga`.
  * `Candidatura` relaciona `Candidato` e `Vaga`.
* **Herança:** A superclasse abstrata `Usuario` centraliza credenciais de acesso, localização e contatos, estendida pelas subclasses `Candidato` e `Empresa`.
* **Polimorfismo:** O método abstrato `exibirPerfil()` em `Usuario` é implementado com lógica própria em `Candidato` e `Empresa`. Sua invocação a partir de referências da superclasse executa o comportamento dinâmico de cada subtipo sem necessidade de checagens manuais.
* **Interfaces Java:** A interface `Autenticavel` define o contrato de autenticação (`autenticar(email, senha)`), implementada na árvore de `Usuario`. A interface `Identificavel<ID>` padroniza o acesso ao identificador único para as classes persistíveis.
* **Coleções (Java Collections Framework):**
  * `List`: Utilizada em `VagaService` e nas candidaturas para manter ordenação cronológica e permitir iterações sequenciais.
  * `Set`: Utilizado em `Candidato` para o armazenamento de `Habilidade`, assegurando ausência de duplicidade de competências técnicas.
  * `Map`: Empregado na infraestrutura de `RepositorioMemoria<T, ID>` via `LinkedHashMap` para garantir buscas indexadas em tempo constante O(1).
* **Generics:** A interface `IRepositorio<T, ID>` e a classe `RepositorioMemoria<T extends Identificavel<ID>, ID>` utilizam tipos genéricos, garantindo tipagem estrita, reuso e ausência de *typecasting* manual.
* **Tratamento de Exceções:** Hierarquia de exceções personalizadas de negócio estendendo `RuntimeException`:
  * `RegraNegocioException` (Superclasse de negócio).
  * `VagaInativaException` (Disparada na violação da RN01).
  * `CandidaturaDuplicadaException` (Disparada na violação da RN02).
  * Tratamento estruturado via blocos `try/catch` no menu textual em console (`MenuConsole`).

---

## 7. Relação das 5 Regras de Negócio Implementadas

1. **RN01 — Bloqueio de Candidatura em Vaga Inativa:** Uma candidatura só é efetivada se a vaga estiver com status `ATIVA`. Vagas `PAUSADA` ou `ENCERRADA` disparam `VagaInativaException` (`CandidaturaService.java`).
2. **RN02 — Unicidade de Inscrição:** O sistema impede que o mesmo candidato se inscreva mais de uma vez na mesma oportunidade, disparando `CandidaturaDuplicadaException` (`CandidaturaService.java`).
3. **RN03 — Validação de Quantidade Mínima de Vagas:** Não é permitido cadastrar oportunidade com quantidade de vagas <= 0, disparando `RegraNegocioException` (`VagaService.java`).
4. **RN04 — Transição Linear de Etapas de Seleção:** As fases de candidatura avançam de forma progressiva: `INSCRITO` -> `EM_ANALISE` -> `ENTREVISTA` -> `FINALIZADO` (`Candidatura.java`).
5. **RN05 — Proteção do Banco de Talentos:** Candidatos com `disponivelBanco = false` são suprimidos da listagem de busca ativa visualizada por recrutadores.

---

## 8. Instruções para Compilação e Execução

### Pré-requisitos
* Java Development Kit (JDK) 17 ou superior instalado.

### Execução via Terminal / Console
1. Clone o repositório ou navegue até a pasta raiz do projeto:
   ```bash
   cd included-lives
   ```
2. Compile todas as classes do projeto:
   ```bash
   javac -d bin src/br/com/includedlives/**/*.java
   ```
3. Execute a aplicação a partir da classe `Main`:
   ```bash
   java -cp bin br.com.includedlives.app.Main
   ```