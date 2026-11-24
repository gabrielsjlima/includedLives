window.COCOON_A11Y = {
    color: '#852a99',
    persist: true,
    labels: {
        launcher: 'Opções de acessibilidade',
        title: 'Acessibilidade',
        close: 'Fechar painel de acessibilidade',
        profiles: 'Perfis rápidos',
        vision: 'Visão',
        readAloud: 'Leitura em voz alta',
        reading: 'Leitura',
        navigation: 'Navegação',
        motor: 'Mobilidade e coordenação',
        readPage: 'Ler página',
        readSelection: 'Ler seleção',
        pause: 'Pausar',
        stop: 'Parar',
        speed: 'Velocidade:',
        hint: 'Durante a leitura, clique em um parágrafo para continuar a partir dele. A frase atual fica destacada.',
        reset: 'Restaurar configurações',
        skip: 'Pular para o conteúdo',
        on: 'ativado',
        off: 'desativado',
        profileOn: '— perfil ativado',
        profileOff: '— perfil desativado',
        resetDone: 'Todas as configurações de acessibilidade foram restauradas',
        ttsUnsupported: 'Este navegador não oferece suporte à leitura em voz alta.',
        noContent: 'Nenhum conteúdo disponível para leitura.',
        noSelection: 'Selecione um trecho e clique em Ler seleção.',
        structTitle: 'Estrutura da página',
        structClose: 'Fechar estrutura da página',
        structEmpty: 'Nenhum título encontrado nesta página',
        lmMain: 'Conteúdo principal',
        lmNav: 'Navegação',
        lmHeader: 'Cabeçalho',
        lmFooter: 'Rodapé',
        lmAside: 'Barra lateral',
        scrollUp: 'Rolar para cima',
        scrollDown: 'Rolar para baixo',
        scrollStop: 'Parar rolagem',
        scrollSpeed: 'Velocidade da rolagem',
        kbClose: 'Fechar teclado',
        'p-lowvision': 'Baixa visão',
        'p-dyslexia': 'Dislexia',
        'p-motor': 'Apoio motor',
        'p-focus': 'Foco para TDAH',
        'p-seizure': 'Reduzir estímulos visuais',
        'a11y-contrast': 'Mais contraste',
        'a11y-invert': 'Modo escuro',
        'a11y-desat': 'Tons de cinza',
        'a11y-cursor': 'Cursor grande',
        'a11y-hideimg': 'Ocultar imagens',
        'a11y-light': 'Modo claro',
        'a11y-protan': 'Filtro para protanopia',
        'a11y-deutan': 'Filtro para deuteranopia',
        'a11y-tritan': 'Filtro para tritanopia',
        'a11y-big': 'Texto maior',
        'a11y-bigger': 'Texto extra grande',
        'a11y-spacing': 'Espaçamento do texto',
        'a11y-lh': 'Espaçamento entre linhas',
        'a11y-dyslexia': 'Fonte para dislexia',
        'a11y-links': 'Destacar links',
        'a11y-mono': 'Fonte monoespaçada',
        'a11y-focus': 'Destacar foco',
        'a11y-ruler': 'Guia de leitura',
        'a11y-noanim': 'Parar animações',
        'a11y-mask': 'Máscara de leitura',
        'a11y-struct': 'Estrutura da página',
        'a11y-bigtargets': 'Ampliar áreas de clique',
        'a11y-tspace': 'Separar áreas de clique',
        'a11y-dwell': 'Clicar ao manter o cursor parado',
        'a11y-autoscroll': 'Rolagem automática',
        'a11y-clickguard': 'Evitar cliques acidentais',
        'a11y-nomove': 'Pausar conteúdo em movimento',
        'a11y-sticky': 'Manter menus abertos',
        'a11y-kb': 'Teclado virtual'
    }
};

const cocoonTheme = document.createElement('style');
cocoonTheme.textContent = `
    html #cocoon-a11y-btn svg { fill: #fff; }
    html #cocoon-a11y-btn:focus-visible { box-shadow: 0 0 0 6px var(--ca-accent); }
    html #cocoon-a11y-panel :focus-visible { outline-color: var(--ca-accent); }
    #cocoon-a11y-panel .a11y-play:not(.on),
    #cocoon-a11y-panel .a11y-play.on,
    #cocoon-a11y-panel .a11y-rst,
    html #a11y-scroll-ctl button,
    html #a11y-skip { color: #fff; }
    #cocoon-a11y-panel .a11y-play:hover { background: #702281; }
`;
document.head.append(cocoonTheme);

window.addEventListener('load', () => {
    document.getElementById('a11y-struct')?.setAttribute(
        'aria-label', window.COCOON_A11Y.labels.structTitle
    );
});
