package br.com.includedlives.view;

import br.com.includedlives.exception.RegraNegocioException;
import br.com.includedlives.model.*;
import br.com.includedlives.model.enums.TipoHabilidade;
import br.com.includedlives.repository.IRepositorio;
import br.com.includedlives.repository.RepositorioMemoria;
import br.com.includedlives.service.CandidaturaService;
import br.com.includedlives.service.VagaService;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class MenuConsole {
    private final Scanner scanner = new Scanner(System.in);
    private final IRepositorio<Candidato, Long> candRepo = new RepositorioMemoria<>();
    private final IRepositorio<Empresa, Long> empRepo = new RepositorioMemoria<>();
    private final IRepositorio<Vaga, Long> vagaRepo = new RepositorioMemoria<>();
    private final IRepositorio<Candidatura, String> canditRepo = new RepositorioMemoria<>();

    private final VagaService vagaService = new VagaService(vagaRepo);
    private final CandidaturaService candidaturaService = new CandidaturaService(canditRepo);

    public void inicializarDadosDemo() {
        Empresa emp1 = new Empresa(1L, "rh@peixinho.com", "1234", "1999998888", "Porto Ferreira", "SP",
                "Restaurante O Peixinho LTDA", "O Peixinho", "11222333000199", "Gastronomia");
        empRepo.salvar(emp1);

        vagaService.cadastrarVaga(emp1, "Assistente Administrativo Inclusivo", 2, "Porto Ferreira", "SP",
                new BigDecimal("2200.00"), "Rampa de acesso, leitor de tela, banheiro adaptado");
        
        Vaga vagaPausada = vagaService.cadastrarVaga(emp1, "Operador de Atendimento", 1, "Porto Ferreira", "SP",
                new BigDecimal("1800.00"), "Comunicação por texto");
        vagaPausada.pausar();

        Candidato c1 = new Candidato(101L, "ana@email.com", "1234", "19988887777", "Porto Ferreira", "SP",
                "Ana Souza", "12345678901", "H54.0", "Visual", "Leitor de tela e ampliação");
        c1.adicionarHabilidade(new Habilidade("Excel Intermediário", TipoHabilidade.TECNICA));
        c1.adicionarHabilidade(new Habilidade("Comunicação Escrita", TipoHabilidade.COMPORTAMENTAL));
        c1.adicionarFormacao(new Formacao("Técnico em Administração", "ETEC", 2024));
        candRepo.salvar(c1);
    }

    public void executar() {
        int opcao = -1;
        while (opcao != 0) {
            System.out.println("\n========== INCLUDED LIVES - MENU CONSOLE ==========");
            System.out.println("1. Listar Vagas Abertas (Ativas)");
            System.out.println("2. Inscrever Candidato em Vaga (Testar RN01 e RN02)");
            System.out.println("3. Cadastrar Nova Vaga (Testar RN03)");
            System.out.println("4. Demonstrar Polimorfismo (Perfis de Usuários)");
            System.out.println("5. Listar Candidaturas de um Candidato");
            System.out.println("6. Avançar Etapa de Seleção");
            System.out.println("0. Sair");
            System.out.print("Escolha uma opção: ");

            try {
                opcao = Integer.parseInt(scanner.nextLine());
                switch (opcao) {
                    case 1:
                        listarVagas();
                        break;
                    case 2:
                        simularInscricao();
                        break;
                    case 3:
                        simularCadastroVaga();
                        break;
                    case 4:
                        demonstrarPolimorfismo();
                        break;
                    case 5:
                        listarCandidaturas();
                        break;
                    case 6:
                        avancarEtapaProcesso();
                        break;
                    case 0:
                        System.out.println("Encerrando aplicação Included Lives.");
                        break;
                    default:
                        System.out.println("Opção inválida!");
                        break;
                }
            } catch (NumberFormatException e) {
                System.out.println("Erro: Digite apenas números inteiros.");
            } catch (RegraNegocioException e) {
                System.err.println("ALERTA DE REGRA DE NEGÓCIO: " + e.getMessage());
            } catch (Exception e) {
                System.err.println("Erro inesperado: " + e.getMessage());
            }
        }
    }

    private void listarVagas() {
        System.out.println("\n--- VAGAS ATIVAS DISPONÍVEIS ---");
        List<Vaga> vagas = vagaService.listarVagasAtivas();
        if (vagas.isEmpty()) {
            System.out.println("Nenhuma vaga ativa no momento.");
            return;
        }
        vagas.forEach(System.out::println);
    }

    private void simularInscricao() {
        System.out.print("Informe o ID do Candidato (ex: 101): ");
        Long idC = Long.parseLong(scanner.nextLine());
        System.out.print("Informe o ID da Vaga (ex: 1 para ativa, 2 para pausada): ");
        Long idV = Long.parseLong(scanner.nextLine());

        Candidato c = candRepo.buscarPorId(idC)
                .orElseThrow(() -> new RegraNegocioException("Candidato não localizado!"));
        Vaga v = vagaService.buscarPorId(idV);

        Candidatura cand = candidaturaService.realizarInscricao(c, v);
        System.out.println("SUCESSO: " + cand);
    }

    private void simularCadastroVaga() {
        Empresa emp = empRepo.buscarPorId(1L).get();
        System.out.print("Título da vaga: ");
        String titulo = scanner.nextLine();
        System.out.print("Quantidade de vagas (digite 0 para testar o erro da RN03): ");
        int quant = Integer.parseInt(scanner.nextLine());

        Vaga nova = vagaService.cadastrarVaga(emp, titulo, quant, "Porto Ferreira", "SP",
                new BigDecimal("2500.00"), "Mobiliário acessível");
        System.out.println("Vaga cadastrada com sucesso: " + nova);
    }

    private void demonstrarPolimorfismo() {
        System.out.println("\n--- DEMONSTRAÇÃO DE POLIMORFISMO (Usuario -> exibirPerfil()) ---");
        List<Usuario> usuarios = Arrays.asList(
                candRepo.buscarPorId(101L).get(),
                empRepo.buscarPorId(1L).get()
        );

        for (Usuario u : usuarios) {
            System.out.println(u.exibirPerfil());
        }
    }

    private void listarCandidaturas() {
        System.out.print("Informe o ID do Candidato (ex: 101): ");
        Long idC = Long.parseLong(scanner.nextLine());
        List<Candidatura> lista = candidaturaService.listarPorCandidato(idC);
        if (lista.isEmpty()) {
            System.out.println("Nenhuma inscrição encontrada para este candidato.");
        } else {
            lista.forEach(System.out::println);
        }
    }

    private void avancarEtapaProcesso() {
        System.out.print("Informe o ID do Candidato (ex: 101): ");
        Long idC = Long.parseLong(scanner.nextLine());
        System.out.print("Informe o ID da Vaga (ex: 1): ");
        Long idV = Long.parseLong(scanner.nextLine());

        String chave = idC + "_" + idV;
        Candidatura c = canditRepo.buscarPorId(chave)
                .orElseThrow(() -> new RegraNegocioException("Inscrição não localizada para avançar etapa."));
        
        c.avancarEtapa();
        System.out.println("Etapa atualizada com sucesso: " + c);
    }
}