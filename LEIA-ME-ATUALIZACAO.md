# Included Lives — atualização do painel de empresas

## Preservar o banco existente

1. Pare o Spring Boot anterior.
2. Faça backup: `mysqldump -u root includedlives_dev > ~/Documents/includedlives-backup.sql` (adicione `-p` se necessário).
3. **Não apague** `includedlives_dev` e **não importe** `database/schema.sql` sobre o banco existente.
4. Dentro da pasta do projeto, execute **nesta ordem**:

```bash
mysql -u root includedlives_dev < database/migracao_mensagens.sql
mysql -u root includedlives_dev < database/migracao_melhorias_empresa.sql
cd api
mvn spring-boot:run
```

Se o MySQL exigir senha, use `mysql -u root -p includedlives_dev < ...`.

## Funcionalidades

- Visão geral: indicadores reais, pendências e mensagens não lidas.
- Minhas vagas: botão **Ver candidaturas**, edição, encerramento e criação.
- Candidaturas: currículo completo (dados cadastrados no sistema), mensagem, etapas Em análise, Entrevista e Aprovado, e **Não selecionar** (envia agradecimento).
- Aprovação encerra a vaga e impede novas candidaturas. Candidaturas já existentes continuam registradas.
- Banco de talentos: ver currículo e vincular candidato a uma vaga ativa. Esta ação cria candidatura vinculada, com confirmação, e não representa contratação automática.
- Perfil da empresa: nome, e-mail, endereço, redes sociais opcionais, URL da logo e alteração de senha com verificação da senha atual.
- Mensagens: as conversas dependem da candidatura vinculada. Empresas iniciam pela aba Candidaturas; candidatos respondem pela aba Mensagens.

## Limitações

- A logo é configurada por **URL HTTPS pública**; upload de arquivo local ainda não foi implementado.
- O currículo mostra os campos estruturados do banco (formações, experiências e habilidades); não há upload de PDF de currículo.
- Não há atualização instantânea via WebSocket; atualize a aba Mensagens para ver novas respostas.
- É uma versão de desenvolvimento: não foi possível testar com seu banco MySQL real neste ambiente.
- Faça testes com contas fictícias antes de usar dados pessoais reais.
