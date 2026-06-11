const Aparelhos = {
    salvar(event) {
        event.preventDefault();
        
        const id = document.getElementById('campo-id').value.trim();
        const tagsRaw = document.getElementById('campo-tags').value;
        
        const dados = {
            id: id,
            pais: document.getElementById('campo-pais').value,
            numero: document.getElementById('campo-numero').value,
            bm: document.getElementById('campo-bm').value,
            pagina: document.getElementById('campo-pagina').value,
            oferta: document.getElementById('campo-oferta').value,
            status: document.getElementById('campo-status').value,
            tags: tagsRaw.split(',').map(t => t.trim()).filter(t => t !== ''),
            obs: document.getElementById('campo-obs').value,
            ultimaAlteracao: new Date().toLocaleString('pt-BR')
        };

        const isEdicao = window.idAparelhoEmEdicao !== null;
        
        // Validação de Duplicidade
        const existe = window.db.aparelhos.find(a => a.id.toLowerCase() === id.toLowerCase());
        if (existe && (!isEdicao || existe.id !== window.idAparelhoEmEdicao)) {
            alert(`Erro: O ID "${id}" já está cadastrado em outro aparelho!`);
            return;
        }

        if (isEdicao) {
            const index = window.db.aparelhos.findIndex(ap => ap.id === window.idAparelhoEmEdicao);
            if(!window.db.aparelhos[index].dataCriacao) dados.dataCriacao = dados.ultimaAlteracao; // Preserva se houver
            else dados.dataCriacao = window.db.aparelhos[index].dataCriacao;
            
            window.db.aparelhos[index] = dados;
            Historico.registrar('Edição', id, `Status: ${dados.status} | Oferta: ${dados.oferta}`);
        } else {
            dados.dataCriacao = dados.ultimaAlteracao;
            window.db.aparelhos.push(dados);
            Historico.registrar('Criação', id, `Cadastrado na BM ${dados.bm}`);
        }

        Storage.save(window.db);
        Modais.fechar('modal-ativo');
        App.atualizarTudo();
    },

    excluir(id) {
        if(confirm(`Atenção: Excluir permanentemente o aparelho ${id}?`)) {
            window.db.aparelhos = window.db.aparelhos.filter(ap => ap.id !== id);
            Historico.registrar('Exclusão', id, 'Aparelho removido do sistema.');
            Storage.save(window.db);
            App.atualizarTudo();
        }
    }
};