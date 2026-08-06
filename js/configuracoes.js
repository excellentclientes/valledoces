/* ==========================================================================
   Configurações — Vallê Doces
   ========================================================================== */

const Configuracoes = (() => {

    let activeTab = 'loja';

    function mount() {
        const el = document.getElementById('view-configuracoes');
        el.innerHTML = `
            <div class="settings-tabs">
                <div class="settings-tab active" data-tab="loja">Dados da loja</div>
                <div class="settings-tab" data-tab="categorias">Categorias de produtos</div>
                <div class="settings-tab" data-tab="pagamento">Formas de pagamento</div>
                <div class="settings-tab" data-tab="conta">Minha conta</div>
            </div>

            <div class="settings-panel active" id="panel-loja">
                <div class="panel" style="max-width:560px;">
                    <form id="loja-form">
                        <div class="form-row">
                            <div class="form-group"><label>Nome da loja</label><input type="text" id="f-nome-loja"></div>
                            <div class="form-group"><label>Seu nome (usado na saudação)</label><input type="text" id="f-nome-admin" placeholder="Ex: Andressa"></div>
                        </div>
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

            <div class="settings-panel" id="panel-conta">
                <div class="panel" style="max-width:560px;">
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
                        <div class="avatar" style="width:52px;height:52px;font-size:1.2rem;" id="conta-avatar">A</div>
                        <div><strong id="conta-email" style="display:block;"></strong><span style="font-size:0.8rem;color:var(--text-muted);">Administrador</span></div>
                    </div>
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
        document.getElementById('btn-add-categoria').addEventListener('click', () => addChip('categoriasProdutos', 'new-categoria'));
        document.getElementById('btn-add-pagamento').addEventListener('click', () => addChip('formasPagamento', 'new-pagamento'));
        document.getElementById('new-categoria').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('categoriasProdutos', 'new-categoria'); } });
        document.getElementById('new-pagamento').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('formasPagamento', 'new-pagamento'); } });

        el.addEventListener('click', (e) => {
            const rm = e.target.closest('.js-chip-remove');
            if (rm) removeChip(rm.dataset.field, rm.dataset.value);
        });

        document.getElementById('btn-reset-senha').addEventListener('click', async () => {
            try {
                await window.auth.sendPasswordResetEmail(Auth.currentUser().email);
                Utils.toast('E-mail de redefinição enviado.', 'success');
            } catch (err) { Utils.toast('Erro: ' + err.message, 'error'); }
        });
        document.getElementById('btn-sair-conta').addEventListener('click', () => {
            Utils.confirmDialog('Deseja realmente sair do sistema?', async () => { await Auth.logout(); }, 'Sair do sistema');
        });

        render();
    }

    async function saveLoja(e) {
        e.preventDefault();
        const data = {
            nomeLoja: document.getElementById('f-nome-loja').value.trim(),
            nomeAdmin: document.getElementById('f-nome-admin').value.trim() || 'Administradora',
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

    async function addChip(field, inputId) {
        const input = document.getElementById(inputId);
        const value = input.value.trim();
        if (!value) return;
        try {
            await window.db.collection('configuracoes').doc('geral').set({
                [field]: firebase.firestore.FieldValue.arrayUnion(value)
            }, { merge: true });
            input.value = '';
        } catch (err) { Utils.toast('Erro: ' + err.message, 'error'); }
    }

    async function removeChip(field, value) {
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
        document.getElementById('f-nome-admin').value = c.nomeAdmin || '';
        document.getElementById('f-telefone-loja').value = c.telefone || '';
        document.getElementById('f-instagram').value = c.instagram || '';
        document.getElementById('f-endereco-loja').value = c.endereco || '';
        document.getElementById('f-taxa-padrao').value = c.taxaEntregaPadrao || 0;

        document.getElementById('chips-categorias').innerHTML = chipHtml('categoriasProdutos', c.categoriasProdutos);
        document.getElementById('chips-pagamento').innerHTML = chipHtml('formasPagamento', c.formasPagamento);

        const user = Auth.currentUser();
        if (user) {
            document.getElementById('conta-email').textContent = user.email;
            document.getElementById('conta-avatar').textContent = Auth.initials();
        }
    }

    return { mount, render };
})();
