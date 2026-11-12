# Included Lives — integração de API e banco (versão de desenvolvimento)

## Status da entrega

Esta entrega substitui o armazenamento simulado de vagas/candidaturas por chamadas reais à API Spring Boot e inclui autenticação com sessão, perfil, vagas, candidaturas, vagas salvas, currículo, formação, experiências, habilidades e banco de talentos.

**NÃO É UMA VERSÃO CERTIFICADA PARA PRODUÇÃO.** Não foi possível executar a suíte Maven nem um MySQL real neste ambiente. A publicação requer testes, revisão de privacidade/LGPD e infraestrutura configurada. A recuperação de senha, envio de mensagens, notificações por e-mail, solicitações de acessibilidade e políticas legais ainda não foram implementados como serviços reais; a interface não deve sugerir que esses serviços estejam ativos.

## Requisitos

- Java 17 ou superior
- Maven 3.9+
- MySQL 8+

## Inicialização local

1. Crie um banco de desenvolvimento e execute `database/schema.sql` usando o cliente MySQL. **Não use o script antigo que continha DROP TABLE.**
2. No terminal, na pasta `api`, configure as variáveis:
   - `DB_URL=jdbc:mysql://localhost:3306/includedlives_dev?useUnicode=true&characterEncoding=utf8`
   - `DB_USER=seu_usuario`
   - `DB_PASSWORD=sua_senha`
   - `COOKIE_SECURE=false` **apenas para desenvolvimento HTTP local**
3. Execute `mvn test` e `mvn spring-boot:run`.
4. Acesse `http://localhost:8080` e cadastre um candidato e uma empresa para testar o fluxo.

## Hospedagem

- Configure HTTPS e `COOKIE_SECURE=true` (padrão). Use um único domínio/origem para front e API, servindo o front da pasta `api/src/main/resources/static`.
- Configure `DB_URL`, `DB_USER`, `DB_PASSWORD` e `PORT` no provedor; não publique segredos.
- Configure backups automáticos, política de retenção e exclusão de dados, logs sem dados sensíveis e monitoramento.
- Restrinja o acesso ao banco por rede privada; revise controles de consentimento e coleta de dados de acessibilidade antes de coletar dados reais.
- Antes de produção, implementar e testar recuperação de conta, fluxo de exclusão de dados, limites de tentativas de login, monitoramento, testes de segurança, migrações versionadas e conteúdo verdadeiro de Termos/Privacidade.

## Endpoints principais

`POST /api/cadastro`, `POST /api/login`, `GET /api/me`, `POST /api/logout`, `GET /api/perfil`, `PUT /api/perfil`, `PUT /api/curriculo`, `GET /api/vagas`, `GET|POST /api/minhas-vagas`, `PUT|DELETE /api/minhas-vagas/{id}`, `POST /api/vagas/{id}/candidatar`, `GET /api/minhas-candidaturas`, `GET /api/candidaturas-empresa`, `PUT /api/candidaturas-empresa/{vaga}/{candidato}`, `GET /api/vagas-salvas`, `POST|DELETE /api/vagas/{id}/salvar`, CRUD parcial de formação/experiências/habilidades e `GET /api/talentos`.

Todas as operações autenticadas dependem de cookie de sessão e as operações de escrita exigem o cabeçalho `X-CSRF-Token` obtido em `/api/me`.

## Código legado

`included-lives/src/` contém a implementação didática Java em console, preservada para referência; o aplicativo web é iniciado por `api/`.
