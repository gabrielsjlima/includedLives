# Included Lives — Visão geral e mensagens

## O que foi alterado
- Visão geral da empresa agora mostra vagas ativas, candidaturas aguardando análise e entrevistas conforme o banco.
- Pendências e mensagens não lidas são reais; sem dados fictícios.
- Conversas entre empresa e candidato são vinculadas a uma candidatura existente.
- A empresa inicia a conversa em **Candidaturas → Enviar mensagem**.
- O candidato inicia a conversa em **Minhas candidaturas → Conversar com a empresa**.
- Cada participante só pode consultar suas próprias conversas; mensagens são gravadas no MySQL.
- Atualização das conversas ao abrir a seção ou enviar mensagens (sem WebSocket).

## Aplicar ao banco já existente (obrigatório)

```bash
mysql -u root includedlives_dev < database/migracao_mensagens.sql
```

Se seu MySQL usa senha, acrescente `-p` antes do nome do banco.
O script não apaga vagas, usuários nem candidaturas existentes.

## Iniciar

```bash
cd api
mvn spring-boot:run
```

Acesse http://localhost:8080 e atualize com Cmd+Shift+R.

## Teste
1. Entre como empresa e veja os indicadores reais.
2. Abra Candidaturas e clique Enviar mensagem em uma candidatura existente.
3. Entre como o candidato correspondente e abra Mensagens para responder.
4. Confira que outra conta não consegue acessar a conversa.

## Observações
- A contagem de entrevistas corresponde às candidaturas na etapa ENTREVISTA, não a eventos de calendário.
- O sistema não cria conversas fictícias. É necessário haver uma candidatura para iniciar uma conversa.
- Este projeto é uma implementação inicial: antes de publicar na internet, revisar autenticação, proteção de dados e testes automatizados.
