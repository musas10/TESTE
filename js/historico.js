const Historico = {
    async registrar(acao, aparelhoId, detalhes = '') {
        const dataAtual = new Date().toLocaleString('pt-BR');
        
        // Salva na Nuvem
        await supabase.from('historico').insert([{ acao: acao, aparelho: aparelhoId, detalhes: detalhes, data: dataAtual }]);
        
        // Atualiza a tela em tempo real
        window.db.historico.unshift({ id: Date.now(), data: dataAtual, acao: acao, aparelho: aparelhoId, detalhes: detalhes });
        if(window.db.historico.length > 200) window.db.historico.pop();
    },
    renderizar() {
        const container = document.getElementById('lista-logs');
        container.innerHTML = '';
        if(window.db.historico.length === 0) return container.innerHTML = '<p style="color:#64748b;">Nenhum registro encontrado.</p>';
        window.db.historico.forEach(log => {
            container.innerHTML += `
                <div class="log-item">
                    <div class="log-data">${log.data}</div>
                    <strong>${log.acao}</strong> - Ativo: <span style="color:#38bdf8">${log.aparelho}</span><br>
                    <span style="color:#94a3b8">${log.detalhes}</span>
                </div>
            `;
        });
    }
};
