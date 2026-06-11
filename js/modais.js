window.idAparelhoEmEdicao = null;
window.tipoGerenciadorAtual = '';

const Modais = {
    abrir(id) { document.getElementById(id).classList.add('ativo'); },
    fechar(id) { document.getElementById(id).classList.remove('ativo'); },

    abrirModalAtivo(idEdit = null) {
        window.idAparelhoEmEdicao = idEdit;
        const form = document.getElementById('form-cadastro');
        const titulo = document.getElementById('titulo-modal-ativo');
        Filtros.popularDropdownsAparelho();

        if (idEdit) {
            titulo.innerText = '✏️ Editar Aparelho';
            const ap = window.db.aparelhos.find(a => a.id === idEdit);
            document.getElementById('campo-id').value = ap.id;
            document.getElementById('campo-pais').value = ap.pais;
            document.getElementById('campo-numero').value = ap.numero;
            document.getElementById('campo-bm').value = ap.bm;
            document.getElementById('campo-pagina').value = ap.pagina;
            document.getElementById('campo-oferta').value = ap.oferta;
            document.getElementById('campo-status').value = ap.status;
            document.getElementById('campo-tags').value = ap.tags ? ap.tags.join(', ') : '';
            document.getElementById('campo-obs').value = ap.obs || '';
        } else {
            titulo.innerText = '📱 Vincular Novo Aparelho';
            form.reset();
        }
        this.abrir('modal-ativo');
    },

    abrirDetalhes(id) {
        const ap = window.db.aparelhos.find(a => a.id === id);
        const container = document.getElementById('conteudo-detalhes');
        
        let tagsHTML = (ap.tags && ap.tags.length > 0) ? ap.tags.map(t => `<span class="tag-chip">${t}</span>`).join('') : 'Nenhuma tag';
        
        container.innerHTML = `
            <div class="linha-dado"><span class="label">ID</span><span class="valor">${ap.id}</span></div>
            <div class="linha-dado"><span class="label">Status</span><span class="badge-status bg-${ap.status}">${ap.status}</span></div>
            <div class="linha-dado"><span class="label">País / Número</span><span class="valor">${ap.pais} <br> ${ap.numero}</span></div>
            <div class="linha-dado"><span class="label">BM</span><span class="valor">${ap.bm}</span></div>
            <div class="linha-dado"><span class="label">Página</span><span class="valor">${ap.pagina}</span></div>
            <div class="linha-dado"><span class="label">Oferta</span><span class="valor">${ap.oferta}</span></div>
            <hr style="border-color:#334155; margin:15px 0;">
            <div style="margin-bottom: 10px;"><span class="label">Tags:</span> <div class="tags-container">${tagsHTML}</div></div>
            <div style="margin-bottom: 10px;"><span class="label">Observações:</span> <p style="color:#94a3b8; font-size:0.9rem;">${ap.obs || 'Nenhuma observação registrada.'}</p></div>
            <hr style="border-color:#334155; margin:15px 0;">
            <div style="font-size: 0.8rem; color:#64748b; text-align:right;">Criado em: ${ap.dataCriacao || 'N/A'}<br>Última alteração: ${ap.ultimaAlteracao || 'N/A'}</div>
        `;
        
        document.getElementById('btn-editar-detalhe').onclick = () => {
            this.fechar('modal-detalhes');
            this.abrirModalAtivo(id);
        };
        
        this.abrir('modal-detalhes');
    },

    abrirHistorico() {
        Historico.renderizar();
        this.abrir('modal-historico');
    },

    abrirGerenciador(tipo, titulo) {
        window.tipoGerenciadorAtual = tipo;
        document.getElementById('titulo-gerenciador').innerText = `Gerenciar ${titulo}`;
        Render.renderizarListaGerenciador();
        this.abrir('modal-gerenciador');
    }
};