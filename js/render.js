window.visualizacaoAtual = 'cards';

const Render = {
    mudarView(tipo) {
        window.visualizacaoAtual = tipo;
        document.querySelectorAll('.btn-view').forEach(btn => btn.classList.remove('ativo'));
        document.getElementById('btn-view-' + tipo).classList.add('ativo');
        Filtros.aplicar();
    },
    gerarCardHTML(aparelho) {
        let tagsHTML = (aparelho.tags && aparelho.tags.length > 0) ? `<div class="tags-container">${aparelho.tags.slice(0,3).map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>` : '';
        return `
            <div class="card borda-${aparelho.status}">
                <div class="status-dot bg-${aparelho.status}" title="Status: ${aparelho.status}"></div>
                <div class="card-header">
                    <h2>${aparelho.id}</h2>
                    <div>
                        <button class="btn-acao" style="border:none; padding:5px; border-radius:50%; margin-right: 5px;" onclick="Modais.abrirDetalhes('${aparelho.id}')">👁️</button>
                        <button class="btn-acao" style="border:none; padding:5px; border-radius:50%; margin-right: 5px;" onclick="Modais.abrirModalAtivo('${aparelho.id}')">✏️</button>
                        <button class="btn-perigo" style="border:none; padding:5px; border-radius:50%;" onclick="Aparelhos.excluir('${aparelho.id}')">🗑️</button>
                    </div>
                </div>
                <div class="linha-dado"><span class="label">País / Nº</span><span class="valor">${aparelho.pais}<br>${aparelho.numero}</span></div>
                <div class="linha-dado"><span class="label">BM / Página</span><span class="valor" style="color:#94a3b8; font-size:0.8rem;">${aparelho.bm}<br><span style="color:#e2e8f0;">${aparelho.pagina}</span></span></div>
                <div class="linha-dado"><span class="label">Oferta Ativa</span><span class="valor" style="color: #38bdf8;">${aparelho.oferta}</span></div>
                ${tagsHTML}
            </div>
        `;
    },
    renderizarTela(dadosFiltrados) {
        const painel = document.getElementById('painel-principal');
        painel.innerHTML = '';
        if (dadosFiltrados.length === 0) return painel.innerHTML = '<p style="color: #64748b; text-align: center; width: 100%; margin-top: 50px;">Nenhum ativo corresponde à busca.</p>';

        if (window.visualizacaoAtual === 'cards') {
            painel.className = 'view-cards';
            dadosFiltrados.forEach(ap => painel.innerHTML += this.gerarCardHTML(ap));
        } else if (window.visualizacaoAtual === 'lista') {
            painel.className = '';
            let htmlTabela = `<table class="view-lista"><thead><tr><th>ID</th><th>País / Nº</th><th>BM / Página</th><th>Oferta</th><th>Status</th><th>Ações</th></tr></thead><tbody>`;
            dadosFiltrados.forEach(ap => {
                htmlTabela += `
                    <tr>
                        <td style="font-weight: bold; color: #fff;">${ap.id}</td>
                        <td>${ap.pais}<br><span style="color:#94a3b8; font-size:0.8rem;">${ap.numero}</span></td>
                        <td>${ap.bm}<br><span style="color:#94a3b8; font-size:0.8rem;">${ap.pagina}</span></td>
                        <td style="color: #38bdf8;">${ap.oferta}</td>
                        <td><span class="badge-status bg-${ap.status}">${ap.status}</span></td>
                        <td><button class="btn-acao" onclick="Modais.abrirDetalhes('${ap.id}')">👁️</button> <button class="btn-acao" onclick="Modais.abrirModalAtivo('${ap.id}')">✏️</button></td>
                    </tr>`;
            });
            painel.innerHTML = htmlTabela + '</tbody></table>';
        } else if (window.visualizacaoAtual.startsWith('agrupada')) {
            painel.className = 'view-agrupada';
            const chave = window.visualizacaoAtual === 'agrupada-pais' ? 'pais' : 'bm';
            const gruposUnicos = [...new Set(dadosFiltrados.map(ap => ap[chave]))];
            gruposUnicos.forEach(grupoNome => {
                const aparelhosDoGrupo = dadosFiltrados.filter(ap => ap[chave] === grupoNome);
                let colunaHTML = `<div class="coluna-grupo"><h3>${grupoNome} <span class="contador-col">Total: ${aparelhosDoGrupo.length}</span></h3><div class="conteudo-coluna">`;
                aparelhosDoGrupo.forEach(ap => colunaHTML += this.gerarCardHTML(ap));
                painel.innerHTML += colunaHTML + `</div></div>`;
            });
        }
    },
    salvarItemBase(event) {
        event.preventDefault();
        const input = document.getElementById('campo-novo-item');
        if(input.value.trim() !== '') {
            window.db.bases[window.tipoGerenciadorAtual].push({ id: Date.now(), nome: input.value });
            input.value = ''; Storage.save(window.db);
            this.renderizarListaGerenciador(); Filtros.popularDropdownsAparelho();
        }
    },
    editarItemBase(id) {
        const novoNome = document.getElementById(`input-item-${id}`).value;
        const index = window.db.bases[window.tipoGerenciadorAtual].findIndex(i => i.id === id);
        if(index !== -1 && novoNome.trim() !== '') {
            const nomeAntigo = window.db.bases[window.tipoGerenciadorAtual][index].nome;
            window.db.aparelhos.forEach(ap => { if(ap[window.tipoGerenciadorAtual] === nomeAntigo) ap[window.tipoGerenciadorAtual] = novoNome; });
            window.db.bases[window.tipoGerenciadorAtual][index].nome = novoNome;
            Storage.save(window.db);
            alert('Atualizado com sucesso!'); Filtros.popularDropdownsAparelho(); App.atualizarTudo();
        }
    },
    excluirItemBase(id) {
        if(confirm('Apagar este registro afetará os aparelhos vinculados. Continuar?')) {
            window.db.bases[window.tipoGerenciadorAtual] = window.db.bases[window.tipoGerenciadorAtual].filter(i => i.id !== id);
            Storage.save(window.db); this.renderizarListaGerenciador(); Filtros.popularDropdownsAparelho();
        }
    },
    renderizarListaGerenciador() {
        const container = document.getElementById('container-lista-gerenciador');
        container.innerHTML = '';
        window.db.bases[window.tipoGerenciadorAtual].forEach(item => {
            container.innerHTML += `
                <div class="item-gerenciador" style="display:flex; justify-content:space-between; margin-bottom:10px; background:#1e293b; padding:10px; border-radius:8px;">
                    <input type="text" id="input-item-${item.id}" value="${item.nome}" style="background:transparent; border:none; color:#fff; flex:1;">
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-acao" onclick="Render.editarItemBase(${item.id})">Salvar</button>
                        <button class="btn-perigo" onclick="Render.excluirItemBase(${item.id})">🗑️</button>
                    </div>
                </div>`;
        });
    }
};
