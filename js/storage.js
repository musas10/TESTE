const Storage = {
    key: 'saas_operacoes_db',
    defaultData: {
        usuarios: [],
        sessaoLogada: null,
        bases: {
            pais: [{ id: 1, nome: '🇧🇷 Brasil' }, { id: 2, nome: '🇵🇪 Peru' }, { id: 3, nome: '🇨🇴 Colômbia' }],
            oferta: [{ id: 1, nome: 'Oferta Padrão' }],
            bm: [{ id: 1, nome: 'BM Principal' }],
            pagina: [{ id: 1, nome: 'Página Matriz' }]
        },
        aparelhos: [],
        historico: []
    },
    load() {
        const data = localStorage.getItem(this.key);
        if (!data) { this.save(this.defaultData); return JSON.parse(JSON.stringify(this.defaultData)); }
        return JSON.parse(data);
    },
    save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
};
window.db = Storage.load();
