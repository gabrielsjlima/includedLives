# Included Lives — atualização final

## Instalação no Mac

1. Faça backup do banco antes de qualquer migração. Mantenha a pasta anterior como cópia.
2. Use o mesmo banco `includedlives_dev`. Não execute novamente `schema.sql`.
3. Se já aplicou as migrações anteriores, execute **uma única vez**:

```bash
cd ~/Downloads/IncludedLives
mysql -u root includedlives_dev < database/migracao_ajustes_novembro.sql
```

Se seu MySQL exige senha, use `mysql -u root -p includedlives_dev < database/migracao_ajustes_novembro.sql`.

4. Encerre o servidor anterior com Ctrl+C e execute:

```bash
cd api
mvn spring-boot:run
```

5. Acesse `http://localhost:8080` e recarregue com Cmd+Shift+R.

## Novidades
- Empresa: botão para ocultar conversa (somente da própria lista), indicador roxo de mensagens não lidas, upload da logo, guia de orientações, menu sem aba de candidaturas.
- Candidato: Minha conta (e-mail e senha mediante senha atual), botão para ocultar conversa.
- Login: botão para mostrar/ocultar senha.
- O histórico de mensagens permanece salvo no MySQL. Uma nova mensagem faz a conversa reaparecer na lista do destinatário.

## Observações
- A migração adiciona colunas e uma tabela, sem apagar registros.
- Logo: JPG/PNG/WebP até 2 MB. A imagem é armazenada no banco.
- A senha atual é obrigatória para modificar e-mail ou senha do candidato.
- A versão deve ser testada localmente antes de qualquer implantação pública.
