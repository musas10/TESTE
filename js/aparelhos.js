const Aparelhos = {
    async salvar(event) {
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
            tags: tagsRaw,
            obs: document.getElementById('campo-obs').value,
            ultima_alteracao: new Date().toLocaleString('pt-BR')
        };

        const isEdicao = window.idAparelhoEmEdicao !== null;
        const existe = window.db.aparelhos.find(a => a.id.toLowerCase() === id.toLowerCase());
        
        if (existe && (!isEdicao || existe.id !== window.idAparelhoEmEdicao)) return alert(`Erro: O ID "${id}" já está cadastrado!`);

        // Feedback visual de carregamento
        const btn = document.querySelector('#form-cadastro button[type="submit"]');
        btn.innerText = "Salvando na Nuvem...";
        btn.disabled = true;

        if (isEdicao) {
            const aparelhoAntigo = window.db.aparelhos.find(a => a.id === window.idAparelhoEmEdicao);
            dados.data_criacao = aparelhoAntigo.data_criacao || dados.ultima_alteracao;
            
            if (id !== window.idAparelhoEmEdicao) {
                await supabase.from('aparelhos').delete().eq('id', window.idAparelhoEmEdicao);
            }
            await supabase.from('aparelhos').upsert(dados);
            Historico.registrar('Edição', id, `Status atualizado para ${dados.status}`);
        } else {
            dados.data_criacao = dados.ultima_alteracao;
            await supabase.from('aparelhos').insert([dados]);
            Historico.registrar('Criação', id, `Cadastrado na BM ${dados.bm}`);
        }

        await Storage.loadFromCloud();
        Modais.fechar('modal-ativo');
        App.atualizarTudo();
        
        btn.innerText = "Salvar Aparelho";
        btn.disabled = false;
    },
    async excluir(id) {
        if(confirm(`Atenção: Excluir permanentemente o aparelho ${id}?`)) {
            await supabase.from('aparelhos').delete().eq('id', id);
            Historico.registrar('Exclusão', id, 'Aparelho removido do banco.');
            await Storage.loadFromCloud();
            App.atualizarTudo();
        }
    }
};
