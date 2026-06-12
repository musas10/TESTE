const Aparelhos = {
    async salvar(event) {
        event.preventDefault();
        
        if (!window.mySupabase) return alert("Erro: Sem conexão com o servidor.");

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
            tags: tagsRaw,
            obs: document.getElementById('campo-obs').value,
            ultima_alteracao: new Date().toLocaleString('pt-BR')
        };

        const isEdicao = window.idAparelhoEmEdicao !== null;
        const existe = window.db.aparelhos.find(a => a.id.toLowerCase() === id.toLowerCase());
        
        if (existe && (!isEdicao || existe.id !== window.idAparelhoEmEdicao)) return alert(`Erro: O ID "${id}" já está cadastrado!`);

        // Feedback visual
        const btn = document.querySelector('#form-cadastro button[type="submit"]');
        btn.innerText = "Salvando na Nuvem...";
        btn.disabled = true;

        try {
            if (isEdicao) {
                const aparelhoAntigo = window.db.aparelhos.find(a => a.id === window.idAparelhoEmEdicao);
                dados.data_criacao = aparelhoAntigo.data_criacao || dados.ultima_alteracao;
                
                if (id !== window.idAparelhoEmEdicao) {
                    await window.mySupabase.from('aparelhos').delete().eq('id', window.idAparelhoEmEdicao);
                }
                await window.mySupabase.from('aparelhos').upsert(dados);
                try { Historico.registrar('Edição', id, `Status atualizado para ${dados.status}`); } catch(e){}
            } else {
                dados.data_criacao = dados.ultima_alteracao;
                await window.mySupabase.from('aparelhos').insert([dados]);
                try { Historico.registrar('Criação', id, `Cadastrado na BM ${dados.bm}`); } catch(e){}
            }

            await Storage.loadFromCloud();
            Modais.fechar('modal-ativo');
            App.atualizarTudo();
            
        } catch (erro) {
            console.error("Erro ao salvar aparelho:", erro);
            alert("Falha ao salvar no banco de dados.");
        } finally {
            btn.innerText = "Salvar Aparelho";
            btn.disabled = false;
        }
    },
    async excluir(id) {
        if (!window.mySupabase) return alert("Erro: Sem conexão com o servidor.");

        if(confirm(`Atenção: Excluir permanentemente o aparelho ${id}?`)) {
            await window.mySupabase.from('aparelhos').delete().eq('id', id);
            try { Historico.registrar('Exclusão', id, 'Aparelho removido do banco.'); } catch(e){}
            await Storage.loadFromCloud();
            App.atualizarTudo();
        }
    }
};
