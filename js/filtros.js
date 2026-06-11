const Filtros = {
    popularDropdownsBusca() {
        const pPais = document.getElementById('filtro-pais');
        const pBM = document.getElementById('filtro-bm');
        
        pPais.innerHTML = '<option value="">Todos os Países</option>';
        pBM.innerHTML = '<option value="">Todas as BMs</option>';

        const paisesUnicos = [...new Set(window.db.aparelhos.map(a => a.pais))];
        const bmsUnicas = [...new Set(window.db.aparelhos.map(a => a.bm))];

        paisesUnicos.forEach(p => pPais.innerHTML += `<option value="${p}">${p}</option>`);
        bmsUnicas.forEach(b => pBM.innerHTML += `<option value="${b}">${b}</option>`);
    },

    popularDropdownsAparelho() {
        ['oferta', 'bm', 'pagina'].forEach(tipo => {
            const select = document.getElementById(`campo-${tipo}`);
            select.innerHTML = '';
            if(window.db.bases[tipo].length === 0) select.innerHTML = '<option value="">-- Cadastre no Gerenciador --</option>';
            window.db.bases[tipo].forEach(item => {
                select.innerHTML += `<option value="${item.nome}">${item.nome}</option>`;
            });
        });
    },

    aplicar() {
        const termo = document.getElementById('campo-busca').value.toLowerCase();
        const selPais = document.getElementById('filtro-pais').value;
        const selBM = document.getElementById('filtro-bm').value;
        const selStatus = document.getElementById('filtro-status').value;
        const ordem = document.getElementById('ordem-dados').value;

        let filtrados = window.db.aparelhos.filter(ap => {
            const matchBusca = ap.id.toLowerCase().includes(termo) || ap.numero.toLowerCase().includes(termo) || (ap.tags && ap.tags.join(' ').toLowerCase().includes(termo));
            const matchPais = selPais === "" || ap.pais === selPais;
            const matchBM = selBM === "" || ap.bm === selBM;
            const matchStatus = selStatus === "" || ap.status === selStatus;
            return matchBusca && matchPais && matchBM && matchStatus;
        });

        // Ordenação
        filtrados.sort((a, b) => {
            if(ordem === 'id-asc') return a.id.localeCompare(b.id);
            if(ordem === 'id-desc') return b.id.localeCompare(a.id);
            if(ordem === 'status') return a.status.localeCompare(b.status);
            if(ordem === 'pais') return a.pais.localeCompare(b.pais);
            return 0;
        });

        Render.renderizarTela(filtrados);
    }
};