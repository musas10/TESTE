const Historico = {
    registrar(acao, aparelhoId, detalhes = '') {
        const log = { id: Date.now(), data: new Date().toLocaleString('pt-BR'), acao: acao, aparelho: aparelhoId, detalhes: detalhes };
        window.db.historico.unshift(log);
        if(window.db.historico.length > 200) window.db.historico.pop();
        Storage.save(window.db);
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
