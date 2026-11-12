# Atualização do painel do candidato — Included Lives

Esta versão parte do pacote **IncludedLives-Painel-Empresa-Atualizado.zip**, mantendo as melhorias do painel da empresa e das mensagens.

## Instalação no Mac

1. Faça backup do projeto e do banco MySQL antes de substituir arquivos.
2. Extraia o ZIP para uma pasta nova. Não misture com versões antigas.
3. Execute a migração **uma única vez**, a partir da raiz do projeto:
   `mysql -u root -p includedlives_dev < database/migracao_painel_candidato.sql`
   (Se seu MySQL não usa senha, remova `-p`.)
4. Entre na pasta `api` e execute `mvn spring-boot:run`.
5. Abra `http://localhost:8080/painel_candidato/index.html` e atualize com Cmd+Shift+R.

**Não execute novamente `database/schema.sql`** para aplicar esta atualização.

## Alterações

- Visão inicial: atalho de Comunicação e privacidade substituído por Vagas salvas.
- Currículo: telefone, endereço e foto opcional. Foto JPG/PNG/WebP de até 2 MB, salva no banco; acessível somente na sessão do próprio candidato.
- Candidaturas: cartões separados por vaga, etapas com cores, botão de conversa; candidaturas reprovadas deixam de aparecer na lista (continuam registradas no banco e a mensagem de agradecimento continua disponível na conversa).
- Vagas salvas: dados reais do MySQL com empresa, cargo e local; estado vazio consistente.
- Busca de vagas: cartões e botões estilizados.

## Observações

- A migração adiciona `FOTO_PERFIL` e `FOTO_MIME` à tabela CANDIDATO. Se já executou a migração, não execute novamente, pois o MySQL informará colunas duplicadas.
- A foto fica no MySQL, não em pasta pública. Para uso real em produção, recomenda-se implementar processamento/reescrita segura de imagens, validação reforçada e testes de carga.
- O backend foi alterado; apenas atualizar o HTML não basta. Reinicie o Spring Boot.
- O projeto não foi compilado/testado contra um MySQL real neste ambiente; valide cadastro, edição de currículo, foto, candidaturas e mensagens localmente antes de publicar.
