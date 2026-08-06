/* ==========================================================================
   Autenticação — Vallê Doces
   ========================================================================== */

const Auth = (() => {

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
            'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.'
        };
        return map[code] || 'Não foi possível entrar. Tente novamente.';
    }

    function bindLoginForm() {
        const form = document.getElementById('login-form');
        const errBox = document.getElementById('login-error');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errBox.style.display = 'none';
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const btn = document.getElementById('login-submit');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';
            try {
                await login(email, password);
            } catch (err) {
                errBox.textContent = friendlyError(err.code);
                errBox.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Entrar';
            }
        });

        document.getElementById('btn-logout').addEventListener('click', () => {
            Utils.confirmDialog('Deseja realmente sair do sistema?', async () => {
                await logout();
            }, 'Sair do sistema');
        });
    }

    return { currentUser, firstName, initials, login, logout, bindLoginForm };
})();
