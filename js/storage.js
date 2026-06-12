// Verifica se a biblioteca da nuvem carregou corretamente
if (!window.supabase) {
    console.error("❌ ERRO CRÍTICO: O Supabase não foi carregado pelo HTML.");
}

// Usando 'var' para evitar erros de cache/dupla leitura no navegador
var supabaseUrl = 'https://uovkevrjesupnfbfnifr.supabase.co';
var supabaseKey = 'sb_publishable_TX2em9fdj2V2o_-hl95ftw_fPPY7ErR';
var mySupabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

const Storage = {
    async loadFromCloud() {
        console.log("☁️ Conectando ao Supabase...");
        
        let authLocal = { usuarios: [], sessaoLogada: null };
        try {
            const salvo = localStorage.getItem('saas_auth');
            if (salvo) authLocal = JSON.parse(salvo);
        } catch (e) {
            console.warn("Aviso: Erro ao ler login local", e);
        }

        window.db = {
            usuarios: authLocal.usuarios || [],
            sessaoLogada: authLocal.sessaoLogada || null,
            bases: { pais: [], bm: [], pagina: [], oferta: [] },
            aparelhos: [],
            historico: []
        };

        if (!mySupabase) return window.db; 

        try {
            const [resAp, resPaises, resBms, resPaginas, resOfertas, resHist] = await Promise.all([
                mySupabase.from('aparelhos').select('*'),
                mySupabase.from('paises').select('*'),
                mySupabase.from('bms').select('*'),
                mySupabase.from('paginas').select('*'),
                mySupabase.from('ofertas').select('*'),
                mySupabase.from('historico').select('*').order('id', { ascending: false }).limit(200)
            ]);

            window.db.bases.pais = resPaises?.data || [];
            window.db.bases.bm = resBms?.data || [];
            window.db.bases.pagina = resPaginas?.data || [];
            window.db.bases.oferta = resOfertas?.data || [];
            window.db.aparelhos = resAp?.data || [];
            window.db.historico = resHist?.data || [];

            window.db.aparelhos.forEach(ap => {
                if (typeof ap.tags === 'string') ap.tags = ap.tags.split(',').filter(t => t.trim() !== '');
            });

            console.log("✅ Conexão com Supabase Perfeita! Dados carregados.");
        } catch (erro) {
            console.error("❌ Erro ao baixar dados do Supabase:", erro);
            alert("Aviso: Falha ao conectar com a nuvem. O painel pode não carregar os dados corretamente.");
        }

        return window.db;
    },

    saveLocalAuth() {
        localStorage.setItem('saas_auth', JSON.stringify({
            usuarios: window.db.usuarios,
            sessaoLogada: window.db.sessaoLogada
        }));
    }
};
