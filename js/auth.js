const Auth = {
    verificarSessao() {
        if (window.db && window.db.sessaoLogada) {
            document.getElementById('tela-auth').style.display = 'none';
            document.getElementById('app-principal').style.display = 'block';
            document.getElementById('nome-usuario-logado').innerText = `Olá, ${window.db.sessaoLogada.nome}`;
            return true;
        } else {
            document.getElementById('tela-auth').style.display = 'flex';
            document.getElementById('app-principal').style.display = 'none';
            return false;
        }
    },
    toggleForm() {
        const formLogin = document.getElementById('form-login');
        const formRegister = document.getElementById('form-register');
        if (formLogin.style.display === 'none') {
            formLogin.style.display = 'flex'; formRegister.style.display = 'none';
        } else {
            formLogin.style.display = 'none'; formRegister.style.display = 'flex';
        }
    },
    login(event) {
        event.preventDefault();
        
        if (!window.db || !window.db.usuarios) {
            return alert('Aguarde o sistema conectar ao servidor...');
        }

        const email = document.getElementById('login-email').value.trim();
        const senha = document.getElementById('login-senha').value;
        const user = window.db.usuarios.find(u => u.email === email && u.senha === senha);
        
        if (user) {
            window.db.sessaoLogada = { nome: user.nome, email: user.email };
            Storage.saveLocalAuth();
            try { Historico.registrar('Login', 'Sistema', `Usuário ${user.nome} acessou o sistema.`); } catch(e){}
            App.iniciarSistema();
            this.verificarSessao();
            document.getElementById('login-senha').value = '';
        } else { 
            alert('Credenciais inválidas. Tente novamente.'); 
        }
    },
    async registrar(event) {
        event.preventDefault();
        
        if (!window.mySupabase) return alert("Erro de conexão com o servidor.");

        const nome = document.getElementById('reg-nome').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const senha = document.getElementById('reg-senha').value;

        // Verifica se já existe na memória carregada da nuvem
        if (window.db.usuarios.find(u => u.email === email)) {
            return alert('Este e-mail já está cadastrado!');
        }

        // Feedback visual
        const btn = document.querySelector('#form-register button[type="submit"]');
        btn.innerText = "Criando conta na nuvem...";
        btn.disabled = true;
        
        // 1. Cadastra o novo usuário diretamente na NUVEM
        const { error } = await window.mySupabase.from('usuarios').insert([{ nome, email, senha }]);
        
        if (error) {
            btn.innerText = "Criar Conta";
            btn.disabled = false;
            console.error(error);
            return alert('Erro ao criar conta no servidor.');
        }

        // 2. Atualiza a memória local e faz login automático
        window.db.usuarios.push({ nome, email, senha });
        window.db.sessaoLogada = { nome, email };
        Storage.saveLocalAuth();
        
        try { Historico.registrar('Novo Operador', 'Sistema', `Usuário ${nome} foi cadastrado.`); } catch(e){}
        
        alert('Conta criada com sucesso! Bem-vindo(a).');
        
        document.getElementById('form-register').reset();
        btn.innerText = "Criar Conta";
        btn.disabled = false;

        App.iniciarSistema();
        this.verificarSessao();
    },
    logout() {
        if(confirm('Tem certeza que deseja sair?')) {
            try { Historico.registrar('Logout', 'Sistema', `Usuário ${window.db.sessaoLogada.nome} saiu.`); } catch(e){}
            window.db.sessaoLogada = null;
            Storage.saveLocalAuth();
            this.verificarSessao();
        }
    }
};
