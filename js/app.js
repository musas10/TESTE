const App = {
    init() {
        document.getElementById('form-cadastro').addEventListener('submit', Aparelhos.salvar);
        document.getElementById('form-gerenciador').addEventListener('submit', Render.salvarItemBase.bind(Render));

        const eventosFiltro = ['campo-busca', 'filtro-pais', 'filtro-bm', 'filtro-status', 'ordem-dados'];
        eventosFiltro.forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                if(el.tagName === 'INPUT') el.addEventListener('keyup', Filtros.aplicar);
                else el.addEventListener('change', Filtros.aplicar);
            }
        });

        if(Auth.verificarSessao()) { this.iniciarSistema(); }
    },
    iniciarSistema() { Dashboard.atualizar(); Filtros.popularDropdownsBusca(); Filtros.aplicar(); },
    atualizarTudo() { this.iniciarSistema(); }
};
document.addEventListener('DOMContentLoaded', () => { App.init(); });
