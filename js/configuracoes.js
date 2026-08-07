/* ==========================================================================
   Configurações — Vallê Doces
   ========================================================================== */

const Configuracoes = (() => {

    let activeTab = 'loja';
    let profilePhotoFile = null;

    function mount() {
        const el = document.getElementById('view-configuracoes');
        el.innerHTML = `
            <div class="settings-tabs">
                <div class="settings-tab active" data-tab="loja">Dados da loja</div>
                <div class="settings-tab" data-tab="categorias">Categorias de produtos</div>
                <div class="settings-tab" data-tab="pagamento">Formas de pagamento</div>
                <div class="settings-tab" data-tab="capa">Capa da loja</div>
                <div class="settings-tab" data-tab="usuarios">Usuários autorizados</div>
                <div class="settings-tab" data-tab="conta">Minha conta</div>
            </div>

            <div class="settings-panel active" id="panel-loja">
                <div class="panel" style="max-width:560px;">
                    <form id="loja-form">
                        <div class="form-group"><label>Nome da loja</label><input type="text" id="f-nome-loja"></div>
                        <div class="form-row">
                            <div class="form-group"><label>Telefone / WhatsApp</label><input type="text" id="f-telefone-loja"></div>
                            <div class="form-group"><label>Instagram</label><input type="text" id="f-instagram" placeholder="@valledoces"></div>
                        </div>
                        <div class="form-group"><label>Endereço</label><input type="text" id="f-endereco-loja"></div>
                        <div class="form-group"><label>Taxa de entrega padrão (R$)</label><input type="number" step="0.01" min="0" id="f-taxa-padrao"></div>
                        <div class="form-actions"><button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> Salvar dados da loja</button></div>
                    </form>
                </div>
            </div>

            <div class="settings-panel" id="panel-categorias">
                <div class="panel" style="max-width:560px;">
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px;">Categorias usadas em Produtos e Cardápio.</p>
                    <div class="chip-list" id="chips-categorias"></div>
                    <div class="add-chip-row">
                        <input type="text" id="new-categoria" placeholder="Nova categoria (ex: Trufas)">
                        <button class="btn btn-primary btn-sm" id="btn-add-categoria"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>

            <div class="settings-panel" id="panel-pagamento">
                <div class="panel" style="max-width:560px;">
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px;">Formas de pagamento aceitas nos pedidos.</p>
                    <div class="chip-list" id="chips-pagamento"></div>
                    <div class="add-chip-row">
                        <input type="text" id="new-pagamento" placeholder="Nova forma (ex: Boleto)">
                        <button class="btn btn-primary btn-sm" id="btn-add-pagamento"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>

            <div class="settings-panel" id="panel-capa">
                <div class="panel" style="max-width:680px;">
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:14px;">
                        Fotos exibidas em destaque na loja virtual. Com mais de uma, elas alternam
                        automaticamente a cada 3 segundos, deslizando para a esquerda.
                    </p>
                    <div class="capa-grid" id="capa-grid"></div>
                    <label class="btn btn-outline btn-sm" style="margin-top:14px;cursor:pointer;display:inline-flex;">
                        <i class="fa-solid fa-upload"></i> Adicionar foto
                        <input type="file" id="capa-input" accept="image/*" style="display:none;">
                    </label>
                    <span id="capa-uploading" style="display:none;margin-left:10px;font-size:0.82rem;color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Enviando...</span>
                </div>
            </div>

            <div class="settings-panel" id="panel-usuarios">
                <div class="panel" style="max-width:560px;">
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px;">
                        Só e-mails desta lista têm acesso ao painel de gestão. Quem entrar com um e-mail fora
                        da lista (Google ou cadastro) vê a loja virtual pública no lugar do painel.
                    </p>
                    <div class="chip-list" id="chips-usuarios"></div>
                    <div class="add-chip-row">
                        <input type="email" id="new-usuario" placeholder="email@exemplo.com">
                        <button class="btn btn-primary btn-sm" id="btn-add-usuario"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>

            <div class="settings-panel" id="panel-conta">
                <div class="panel" style="max-width:560px;">
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:22px;">
                        <div class="avatar" style="width:64px;height:64px;font-size:1.5rem;overflow:hidden;" id="conta-avatar">A</div>
                        <div>
                            <strong id="conta-email" style="display:block;"></strong>
                            <span style="font-size:0.8rem;color:var(--text-muted);">Administrador</span>
                            <label class="btn btn-outline btn-sm" style="margin-top:8px;cursor:pointer;display:inline-flex;">
                                <i class="fa-solid fa-camera"></i> Trocar foto
                                <input type="file" id="conta-foto-input" accept="image/*" style="display:none;">
                            </label>
                        </div>
                    </div>
                    <form id="perfil-form">
                        <div class="form-row">
                            <div class="form-group"><label>Seu nome</label><input type="text" id="f-perfil-nome" placeholder="Seu nome"></div>
                            <div class="form-group"><label>Telefone</label><input type="text" id="f-perfil-telefone" placeholder="(00) 00000-0000"></div>
                        </div>
                        <div class="form-actions" style="margin-top:0;">
                            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> Salvar perfil</button>
                        </div>
                    </form>
                    <hr style="border:none;border-top:1px solid var(--border);margin:22px 0;">
                    <button class="btn btn-outline" id="btn-reset-senha"><i class="fa-solid fa-key"></i> Enviar e-mail de redefinição de senha</button>
                    <button class="btn btn-danger" id="btn-sair-conta" style="margin-left:10px;"><i class="fa-solid fa-right-from-bracket"></i> Sair do sistema</button>
                </div>
            </div>
        `;

        el.querySelectorAll('.settings-tab').forEach(tab => tab.addEventListener('click', () => {
            activeTab = tab.dataset.tab;
            el.querySelectorAll('.settings-tab').forEach(t => t.classList.toggle('active', t === tab));
            el.querySelectorAll('.settings-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${activeTab}`));
        }));

        document.getElementById('loja-form').addEventListener('submit', saveLoja);
        document.getElementById('perfil-form').addEventListener('submit', saveProfile);
        document.getElementById('btn-add-categoria').addEventListener('click', () => addChip('categoriasProdutos', 'new-categoria'));
        document.getElementById('btn-add-pagamento').addEventListener('click', () => addChip('formasPagamento', 'new-pagamento'));
        document.getElementById('btn-add-usuario').addEventListener('click', () => addChip('usuariosAutorizados', 'new-usuario', true));
        document.getElementById('new-categoria').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('categoriasProdutos', 'new-categoria'); } });
        document.getElementById('new-pagamento').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('formasPagamento', 'new-pagamento'); } });
        document.getElementById('new-usuario').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('usuariosAutorizados', 'new-usuario', true); } });

        document.getElementById('capa-input').addEventListener('change', uploadCapa);

        document.getElementById('conta-foto-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            profilePhotoFile = file;
            const reader = new FileReader();
            reader.onload = () => { document.getElementById('conta-avatar').innerHTML = `<img src="${reader.result}" style="width:100%;height:100%;object-fit:cover;">`; };
            reader.readAsDataURL(file);
        });

        el.addEventListener('click', (e) => {
            const rm = e.target.closest('.js-chip-remove');
            const rmCapa = e.target.closest('.js-capa-remove');
            if (rm) removeChip(rm.dataset.field, rm.dataset.value);
            if (rmCapa) removeCapa(rmCapa.dataset.url);
        });

        document.getElementById('btn-reset-senha').addEventListener('click', async () => {
            try {
                await window.auth.sendPasswordResetEmail(Auth.currentUser().email);
                Utils.toast('E-mail de redefinição enviado.', 'success');
            } catch (err) { Utils.toast('Erro: ' + err.message, 'error'); }
        });
        document.getElementById('btn-sair-conta').addEventListener('click', () => {
            Utils.confirmDialog('Deseja realmente sair do sistema?', async () => { await Auth.logout(); }, 'Sair do sistema', 'Sim, sair');
        });

        render();
    }

    async function saveLoja(e) {
        e.preventDefault();
        const data = {
            nomeLoja: document.getElementById('f-nome-loja').value.trim(),
            telefone: document.getElementById('f-telefone-loja').value.trim(),
            instagram: document.getElementById('f-instagram').value.trim(),
            endereco: document.getElementById('f-endereco-loja').value.trim(),
            taxaEntregaPadrao: Number(document.getElementById('f-taxa-padrao').value) || 0
        };
        try {
            await window.db.collection('configuracoes').doc('geral').set(data, { merge: true });
            Utils.toast('Dados da loja atualizados.', 'success');
        } catch (err) { Utils.toast('Erro: ' + err.message, 'error'); }
    }

    async function saveProfile(e) {
        e.preventDefault();
        const user = Auth.currentUser();
        if (!user) return;
        const btn = e.target.querySelector('button[type="submit"]');
        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
        try {
            let fotoUrl = Store.profile.fotoUrl || '';
            if (profilePhotoFile && window.storage) {
                const path = `usuarios/${user.uid}/${Date.now()}_${profilePhotoFile.name}`;
                const ref = window.storage.ref().child(path);
                await ref.put(profilePhotoFile);
                fotoUrl = await ref.getDownloadURL();
                profilePhotoFile = null;
            }
            await window.db.collection('usuarios').doc(user.uid).set({
                nome: document.getElementById('f-perfil-nome').value.trim() || 'Administradora',
                telefone: document.getElementById('f-perfil-telefone').value.trim(),
                fotoUrl,
                email: user.email || ''
            }, { merge: true });
            Utils.toast('Perfil atualizado.', 'success');
        } catch (err) {
            Utils.toast('Erro: ' + err.message, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }

    async function uploadCapa(e) {
        const file = e.target.files[0];
        if (!file || !window.storage) return;
        const status = document.getElementById('capa-uploading');
        status.style.display = 'inline';
        try {
            const path = `capas/${Date.now()}_${file.name}`;
            const ref = window.storage.ref().child(path);
            await ref.put(file);
            const url = await ref.getDownloadURL();
            await window.db.collection('configuracoes').doc('geral').set({
                capas: firebase.firestore.FieldValue.arrayUnion(url)
            }, { merge: true });
            Utils.toast('Foto de capa adicionada.', 'success');
        } catch (err) {
            Utils.toast('Erro ao enviar foto: ' + err.message, 'error');
        } finally {
            status.style.display = 'none';
            e.target.value = '';
        }
    }

    async function removeCapa(url) {
        Utils.confirmDialog('Remover esta foto da capa da loja?', async () => {
            try {
                await window.db.collection('configuracoes').doc('geral').update({
                    capas: firebase.firestore.FieldValue.arrayRemove(url)
                });
                Utils.toast('Foto removida.', 'success');
            } catch (err) { Utils.toast('Erro: ' + err.message, 'error'); }
        }, 'Remover foto');
    }

    function capaGridHtml(capas) {
        if (!capas || !capas.length) return '<span style="font-size:0.82rem;color:var(--text-muted);">Nenhuma foto de capa ainda.</span>';
        return capas.map(url => `
            <div class="capa-thumb">
                <img src="${url}">
                <button class="js-capa-remove" data-url="${Utils.escapeHtml(url)}" title="Remover"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');
    }

    async function addChip(field, inputId, isEmail = false) {
        const input = document.getElementById(inputId);
        let value = input.value.trim();
        if (!value) return;
        if (isEmail) value = value.toLowerCase();
        try {
            await window.db.collection('configuracoes').doc('geral').set({
                [field]: firebase.firestore.FieldValue.arrayUnion(value)
            }, { merge: true });
            input.value = '';
        } catch (err) { Utils.toast('Erro: ' + err.message, 'error'); }
    }

    async function removeChip(field, value) {
        if (field === 'usuariosAutorizados' && Auth.currentUser() && value === Auth.currentUser().email) {
            Utils.toast('Você não pode remover o seu próprio e-mail da lista.', 'error');
            return;
        }
        try {
            await window.db.collection('configuracoes').doc('geral').update({
                [field]: firebase.firestore.FieldValue.arrayRemove(value)
            });
        } catch (err) { Utils.toast('Erro: ' + err.message, 'error'); }
    }

    function chipHtml(field, values) {
        if (!values || !values.length) return '<span style="font-size:0.82rem;color:var(--text-muted);">Nenhum item cadastrado.</span>';
        return values.map(v => `<span class="chip">${Utils.escapeHtml(v)}<button class="js-chip-remove" data-field="${field}" data-value="${Utils.escapeHtml(v)}"><i class="fa-solid fa-xmark"></i></button></span>`).join('');
    }

    function render() {
        if (!document.getElementById('f-nome-loja')) return;
        const c = Store.config;
        document.getElementById('f-nome-loja').value = c.nomeLoja || '';
        document.getElementById('f-telefone-loja').value = c.telefone || '';
        document.getElementById('f-instagram').value = c.instagram || '';
        document.getElementById('f-endereco-loja').value = c.endereco || '';
        document.getElementById('f-taxa-padrao').value = c.taxaEntregaPadrao || 0;

        document.getElementById('capa-grid').innerHTML = capaGridHtml(c.capas);
        document.getElementById('chips-categorias').innerHTML = chipHtml('categoriasProdutos', c.categoriasProdutos);
        document.getElementById('chips-pagamento').innerHTML = chipHtml('formasPagamento', c.formasPagamento);
        document.getElementById('chips-usuarios').innerHTML = chipHtml('usuariosAutorizados', c.usuariosAutorizados);

        const user = Auth.currentUser();
        if (user) document.getElementById('conta-email').textContent = user.email;

        const p = Store.profile || {};
        document.getElementById('f-perfil-nome').value = p.nome || '';
        document.getElementById('f-perfil-telefone').value = p.telefone || '';
        const avatarEl = document.getElementById('conta-avatar');
        if (avatarEl) {
            avatarEl.innerHTML = p.fotoUrl
                ? `<img src="${p.fotoUrl}" style="width:100%;height:100%;object-fit:cover;">`
                : (p.nome || Auth.initials() || 'A').trim().charAt(0).toUpperCase();
        }
    }

    return { mount, render };
})();
