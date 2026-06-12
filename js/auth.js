const Auth = {
    verificarSessao() {
        if (window.db.sessaoLogada) {
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
        const email = document.getElementById('login-email').value.trim();
        const senha = document.getElementById('login-senha').value;
        const user = window.db.usuarios.find(u => u.email === email && u.senha === senha);
        
        if (user) {
            window.db.sessaoLogada = { nome: user.nome, email: user.email };
            Storage.saveLocalAuth();
            Historico.registrar('Login', 'Sistema', `Usuário ${user.nome} acessou o sistema.`);
            App.iniciarSistema();
            this.verificarSessao();
            document.getElementById('login-senha').value = '';
        } else { alert('Credenciais inválidas. Tente novamente.'); }
    },
    registrar(event) {
        event.preventDefault();
        const nome = document.getElementById('reg-nome').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const senha = document.getElementById('reg-senha').value;

        if (window.db.usuarios.find(u => u.email === email)) return alert('Este e-mail já está cadastrado!');
        
        window.db.usuarios.push({ id: Date.now(), nome, email, senha });
        window.db.sessaoLogada = { nome, email };
        Storage.saveLocalAuth();
        
        Historico.registrar('Novo Operador', 'Sistema', `Usuário ${nome} foi cadastrado.`);
        
        alert('Conta criada com sucesso!');
        document.getElementById('form-register').reset();
        App.iniciarSistema();
        this.verificarSessao();
    },
    logout() {
        if(confirm('Tem certeza que deseja sair?')) {
            Historico.registrar('Logout', 'Sistema', `Usuário ${window.db.sessaoLogada.nome} saiu.`);
            window.db.sessaoLogada = null;
            Storage.saveLocalAuth();
            this.verificarSessao();
        }
    }
};
