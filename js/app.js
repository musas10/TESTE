const App = {
    init() {
        // Ligar eventos do formulário de Aparelhos
        document.getElementById('form-cadastro').addEventListener('submit', Aparelhos.salvar);
        
        // Ligar eventos do formulário do Gerenciador Universal
        document.getElementById('form-gerenciador').addEventListener('submit', Render.salvarItemBase.bind(Render));

        // Ligar eventos de Filtros Automáticos (On Change/Keyup)
        const eventosFiltro = ['campo-busca', 'filtro-pais', 'filtro-bm', 'filtro-status', 'ordem-dados'];
        eventosFiltro.forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                if(el.tagName === 'INPUT') el.addEventListener('keyup', Filtros.aplicar);
                else el.addEventListener('change', Filtros.aplicar);
            }
        });

        // Carregar tela pela primeira vez
        this.atualizarTudo();
    },

    atualizarTudo() {
        Dashboard.atualizar();
        Filtros.popularDropdownsBusca();
        Filtros.aplicar(); // A própria aplicação dos filtros engatilha o Render da tela
    }
};

// Start 🚀
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});