# Included Lives — CSS organizado por seção

Abra `index.html` para visualizar o site integrado. O design, o header dinâmico, o FAQ e a página de login foram preservados.

## Organização

- `css/base.css`: reset, variáveis, tipografia, botões, header e menu.
- `css/home.css`: apresentação inicial.
- `css/beneficios.css`: cards de benefícios.
- `css/vagas.css`: oportunidades e empresas.
- `css/guia.css`: seção do guia prático.
- `css/faq.css`: perguntas frequentes.
- `css/footer.css`: rodapé.
- `css/responsivo.css`: media queries originais.
- `css/telas.css`: alturas calculadas e ajustes de cada seção à viewport.
- `css/header-dinamico.css`: redução do cabeçalho durante a rolagem.
- `login.css`: estilos exclusivos da página de login (mantido separado).

Os estilos são carregados nessa ordem em `index.html`, para preservar a cascata CSS original. Não é necessário usar `@import`.

As vagas são exemplos visuais; autenticação e candidaturas dependem de backend.
