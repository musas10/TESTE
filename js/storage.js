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
        if (!data) { 
            this.save(this.defaultData); 
            return JSON.parse(JSON.stringify(this.defaultData)); 
        }
        
        const parsedData = JSON.parse(data);

        // AUTO-MIGRAÇÃO: Se for o banco de dados antigo, injeta as tabelas novas
        if (!parsedData.usuarios) parsedData.usuarios = [];
        if (parsedData.sessaoLogada === undefined) parsedData.sessaoLogada = null;
        if (!parsedData.bases) parsedData.bases = this.defaultData.bases;
        if (!parsedData.bases.pais) parsedData.bases.pais = this.defaultData.bases.pais;

        return parsedData;
    },
    save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
};

window.db = Storage.load();
