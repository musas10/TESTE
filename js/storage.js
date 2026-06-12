// Verifica se a biblioteca da nuvem carregou corretamente
if (!window.supabase) {
    console.error("❌ ERRO CRÍTICO: O Supabase não foi carregado pelo HTML.");
}

// Transformando mySupabase em global para todos os arquivos acessarem
window.mySupabase = window.supabase ? window.supabase.createClient(
    'https://uovkevrjesupnfbfnifr.supabase.co', 
    'sb_publishable_TX2em9fdj2V2o_-hl95ftw_fPPY7ErR'
) : null;

const Storage = {
    async loadFromCloud() {
        console.log("☁️ Conectando ao Supabase...");
        
        let authLocal = { sessaoLogada: null };
        try {
            const salvo = localStorage.getItem('saas_auth');
            if (salvo) authLocal = JSON.parse(salvo);
        } catch (e) {
            console.warn("Aviso: Erro ao ler login local", e);
        }

        window.db = {
            usuarios: [],
            sessaoLogada: authLocal.sessaoLogada || null,
            bases: { pais: [], bm: [], pagina: [], oferta: [] },
            aparelhos: [],
            historico: []
        };

        if (!window.mySupabase) return window.db; 

        try {
            // Agora baixamos a tabela de usuários (resUsers) junto com o resto!
            const [resAp, resPaises, resBms, resPaginas, resOfertas, resHist, resUsers] = await Promise.all([
                window.mySupabase.from('aparelhos').select('*'),
                window.mySupabase.from('paises').select('*'),
                window.mySupabase.from('bms').select('*'),
                window.mySupabase.from('paginas').select('*'),
                window.mySupabase.from('ofertas').select('*'),
                window.mySupabase.from('historico').select('*').order('id', { ascending: false }).limit(200),
                window.mySupabase.from('usuarios').select('*')
            ]);

            window.db.bases.pais = resPaises?.data || [];
            window.db.bases.bm = resBms?.data || [];
            window.db.bases.pagina = resPaginas?.data || [];
            window.db.bases.oferta = resOfertas?.data || [];
            window.db.aparelhos = resAp?.data || [];
            window.db.historico = resHist?.data || [];
            window.db.usuarios = resUsers?.data || []; // Usuários da nuvem!

            window.db.aparelhos.forEach(ap => {
                if (typeof ap.tags === 'string') ap.tags = ap.tags.split(',').filter(t => t.trim() !== '');
            });

        } catch (erro) {
            console.error("❌ Erro ao baixar dados do Supabase:", erro);
            alert("Aviso: Falha ao conectar com a nuvem.");
        }

        return window.db;
    },

    saveLocalAuth() {
        // Agora o navegador salva apenas QUEM está logado no momento, e não a base inteira de usuários
        localStorage.setItem('saas_auth', JSON.stringify({
            sessaoLogada: window.db.sessaoLogada
        }));
    }
};
