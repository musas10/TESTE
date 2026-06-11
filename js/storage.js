const Storage = {
    key: 'saas_operacoes_db',
    
    // Dados padrão caso seja a primeira vez abrindo
    defaultData: {
        bases: {
            oferta: [{ id: 1, nome: 'Oferta Padrão' }],
            bm: [{ id: 1, nome: 'BM Principal' }],
            pagina: [{ id: 1, nome: 'Página Matriz' }]
        },
        aparelhos: [],
        historico: []
    },

    load() {
        const data = localStorage.getItem(this.key);
        if (!data) {
            this.save(this.defaultData);
            return JSON.parse(JSON.stringify(this.defaultData));
        }
        return JSON.parse(data);
    },

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
};

// Instância global dos dados em memória
window.db = Storage.load();