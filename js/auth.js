/* ==========================================================================
   Autenticação — Vallê Doces
   ========================================================================== */

const Auth = (() => {

    let mode = 'login';

    function currentUser() {
        return window.auth.currentUser;
    }

    function firstName() {
        const u = currentUser();
        if (!u) return 'Administradora';
        const name = u.displayName || (u.email ? u.email.split('@')[0] : 'Administradora');
        return name.split(' ')[0].replace(/^\w/, c => c.toUpperCase());
    }

    function initials() {
        const u = currentUser();
        const base = (u && (u.displayName || u.email)) || 'A';
        return base.trim().charAt(0).toUpperCase();
    }

    async function login(email, password) {
        return window.auth.signInWithEmailAndPassword(email, password);
    }

    async function register(email, password) {
        return window.auth.createUserWithEmailAndPassword(email, password);
    }

    async function loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return window.auth.signInWithPopup(provider);
    }

    async function logout() {
        return window.auth.signOut();
    }

    function friendlyError(code) {
        const map = {
            'auth/invalid-email': 'E-mail inválido.',
            'auth/user-disabled': 'Este usuário está desativado.',
            'auth/user-not-found': 'E-mail ou senha incorretos.',
            'auth/wrong-password': 'E-mail ou senha incorretos.',
            'auth/invalid-credential': 'E-mail ou senha incorretos.',
            'auth/too-many-requests': 'Muitas tentativas. Aguarde um momento e tente novamente.',
            'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
            'auth/email-already-in-use': 'Este e-mail já está cadastrado. Faça login.',
            'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
            'auth/popup-closed-by-user': 'Janela do Google fechada antes de concluir o login.',
            'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.',
            'auth/cancelled-popup-request': 'Login com Google cancelado.',
            'auth/unauthorized-domain': 'Este domínio não está autorizado no Firebase Authentication.'
        };
        return map[code] || 'Não foi possível concluir. Tente novamente.';
    }

    function setMode(newMode) {
        mode = newMode;
        const isLogin = mode === 'login';
        document.getElementById('auth-title').textContent = isLogin ? 'Entrar no painel' : 'Criar sua conta';
        document.getElementById('auth-sub').textContent = isLogin ? 'Acesse sua conta para gerenciar a loja.' : 'Cadastre-se com e-mail e senha para começar.';
        document.getElementById('login-submit').innerHTML = isLogin
            ? '<i class="fa-solid fa-right-to-bracket"></i> Entrar'
            : '<i class="fa-solid fa-user-plus"></i> Criar conta';
        document.getElementById('auth-switch-text').textContent = isLogin ? 'Ainda não tem conta?' : 'Já tem conta?';
        document.getElementById('auth-switch-link').textContent = isLogin ? 'Criar conta' : 'Entrar';
        document.getElementById('login-error').style.display = 'none';
    }

    function bindLoginForm() {
        const form = document.getElementById('login-form');
        const errBox = document.getElementById('login-error');

        setMode('login');

        document.getElementById('auth-switch-link').addEventListener('click', (e) => {
            e.preventDefault();
            setMode(mode === 'login' ? 'register' : 'login');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errBox.style.display = 'none';
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const btn = document.getElementById('login-submit');
            const originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Aguarde...';
            try {
                if (mode === 'login') await login(email, password);
                else await register(email, password);
            } catch (err) {
                errBox.textContent = friendlyError(err.code);
                errBox.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        });

        document.getElementById('btn-google').addEventListener('click', async () => {
            errBox.style.display = 'none';
            const btn = document.getElementById('btn-google');
            btn.disabled = true;
            try {
                await loginWithGoogle();
            } catch (err) {
                errBox.textContent = friendlyError(err.code);
                errBox.style.display = 'block';
            } finally {
                btn.disabled = false;
            }
        });

        document.getElementById('btn-logout').addEventListener('click', () => {
            Utils.confirmDialog('Deseja realmente sair do sistema?', async () => {
                await logout();
            }, 'Sair do sistema');
        });
    }

    return { currentUser, firstName, initials, login, register, loginWithGoogle, logout, bindLoginForm };
})();
