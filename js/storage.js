// Conexão Oficial Supabase
const supabaseUrl = 'https://uovkevrjesupnfbfnifr.supabase.co';
const supabaseKey = 'sb_publishable_TX2em9fdj2V2o_-hl95ftw_fPPY7ErR';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const Storage = {
    async loadFromCloud() {
        console.log("☁️ Baixando dados do Supabase...");
        
        // Faz o download de todas as tabelas ao mesmo tempo
        const [resAp, resPaises, resBms, resPaginas, resOfertas, resHist] = await Promise.all([
            supabase.from('aparelhos').select('*'),
            supabase.from('paises').select('*'),
            supabase.from('bms').select('*'),
            supabase.from('paginas').select('*'),
            supabase.from('ofertas').select('*'),
            supabase.from('historico').select('*').order('id', { ascending: false }).limit(200)
        ]);

        // Mantemos os usuários no navegador temporariamente para não te deslogar
        const authLocal = JSON.parse(localStorage.getItem('saas_auth')) || { usuarios: [], sessaoLogada: null };

        // Monta o banco de dados na memória do computador para ser rápido
        window.db = {
            usuarios: authLocal.usuarios,
            sessaoLogada: authLocal.sessaoLogada,
            bases: {
                pais: resPaises.data || [],
                bm: resBms.data || [],
                pagina: resPaginas.data || [],
                oferta: resOfertas.data || []
            },
            aparelhos: resAp.data || [],
            historico: resHist.data || []
        };

        // Formata as tags corretamente
        window.db.aparelhos.forEach(ap => {
            if (typeof ap.tags === 'string') ap.tags = ap.tags.split(',').filter(t => t.trim() !== '');
        });

        return window.db;
    },

    saveLocalAuth() {
        localStorage.setItem('saas_auth', JSON.stringify({
            usuarios: window.db.usuarios,
            sessaoLogada: window.db.sessaoLogada
        }));
    }
};
