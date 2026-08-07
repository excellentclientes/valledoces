/* ==========================================================================
   Loja virtual pública — Vallê Doces
   Exibida para logins que não estão na lista de usuários autorizados.
   ========================================================================== */

const Storefront = (() => {

    let produtos = [];
    let config = {};
    let cart = [];
    let catFilter = '';
    let unsubs = [];
    let mounted = false;

    function mount() {
        if (mounted) { render(); return; }
        mounted = true;
        const el = document.getElementById('storefront-screen');
        el.innerHTML = shellHtml();
        bindStatic();
        listen();
    }

    function shellHtml() {
        return `
        <div class="store-page">
            <header class="store-header">
                <div class="store-header-inner">
                    <div class="store-logo brand-font">Vallê<span>DOCES</span></div>
                    <nav class="store-nav">
                        <a href="#store-produtos">Cardápio</a>
                        <a href="#store-sobre">Quem somos</a>
                        <a href="#store-contato">Contato</a>
                    </nav>
                    <div class="store-header-actions">
                        <button class="store-icon-btn" id="store-cart-btn" title="Carrinho">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span class="store-cart-badge" id="store-cart-badge" style="display:none;">0</span>
                        </button>
                        <button class="store-icon-btn" id="store-logout-btn" title="Sair"><i class="fa-solid fa-right-from-bracket"></i></button>
                    </div>
                </div>
            </header>

            <section class="store-hero">
                <div class="store-hero-text">
                    <span class="store-hero-tag">Doce momento</span>
                    <h1>Doçura que abraça,<br>sabor que fica na memória.</h1>
                    <p id="store-hero-sub">Doces artesanais feitos com amor para adoçar os seus melhores momentos.</p>
                    <a href="#store-produtos" class="btn btn-primary store-hero-btn"><i class="fa-solid fa-cookie-bite"></i> Ver cardápio</a>
                </div>
                <div class="store-hero-art"><i class="fa-solid fa-cookie-bite"></i></div>
            </section>

            <section class="store-features">
                <div class="store-feature"><i class="fa-solid fa-heart"></i><strong>Feito com amor</strong><span>Em cada detalhe e camada</span></div>
                <div class="store-feature"><i class="fa-solid fa-leaf"></i><strong>Ingredientes selecionados</strong><span>Qualidade que você sente</span></div>
                <div class="store-feature"><i class="fa-solid fa-wand-magic-sparkles"></i><strong>Doce momentos</strong><span>Para celebrar e presentear</span></div>
                <div class="store-feature"><i class="fa-solid fa-mortar-pestle"></i><strong>Artesanal</strong><span>Receitas exclusivas feitas à mão</span></div>
            </section>

            <section class="store-section" id="store-produtos">
                <div class="store-section-head"><h2>Navegue por categoria</h2></div>
                <div class="store-cats" id="store-cats"></div>

                <div class="store-section-head" style="margin-top:36px;"><h2>Nossos doces 🧡</h2></div>
                <div class="store-grid" id="store-grid"></div>
            </section>

            <section class="store-banner" id="store-sobre">
                <div>
                    <span class="store-hero-tag light">Compartilhe</span>
                    <h2>Doçura!</h2>
                    <p>Kits especiais para tornar qualquer momento inesquecível.</p>
                    <a href="#store-produtos" class="btn btn-primary">Quero presentear</a>
                </div>
            </section>

            <section class="store-benefits">
                <div><i class="fa-solid fa-truck"></i><strong>Entrega combinada</strong><span>Direto com a loja</span></div>
                <div><i class="fa-solid fa-box"></i><strong>Embalagem segura</strong><span>Chega perfeito até você</span></div>
                <div><i class="fa-brands fa-whatsapp"></i><strong>Pedido simples</strong><span>Finalize pelo WhatsApp</span></div>
                <div><i class="fa-solid fa-comments"></i><strong>Atendimento</strong><span>Feito com carinho</span></div>
            </section>

            <footer class="store-footer" id="store-contato">
                <div>
                    <div class="store-logo brand-font">Vallê<span>DOCES</span></div>
                    <p>Doces artesanais feitos com amor para adoçar os seus melhores momentos.</p>
                </div>
                <div>
                    <strong>Contato</strong>
                    <p id="store-contato-tel"><i class="fa-brands fa-whatsapp"></i> —</p>
                    <p id="store-contato-insta"><i class="fa-brands fa-instagram"></i> —</p>
                    <p id="store-contato-end"><i class="fa-solid fa-location-dot"></i> —</p>
                </div>
            </footer>
            <p class="store-copy">© ${new Date().getFullYear()} Vallê Doces. Todos os direitos reservados.</p>
        </div>

        <div class="store-cart-backdrop" id="store-cart-backdrop"></div>
        <aside class="store-cart-drawer" id="store-cart-drawer">
            <div class="store-cart-head">
                <h3><i class="fa-solid fa-cart-shopping"></i> Seu carrinho</h3>
                <button id="store-cart-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="store-cart-items" id="store-cart-items"></div>
            <div class="store-cart-footer">
                <div class="row"><span>Total</span><strong id="store-cart-total">R$ 0,00</strong></div>
                <button class="btn btn-primary btn-block" id="store-cart-checkout"><i class="fa-brands fa-whatsapp"></i> Finalizar no WhatsApp</button>
                <p class="store-cart-note">Você vai finalizar o pedido direto com a loja pelo WhatsApp.</p>
            </div>
        </aside>
        `;
    }

    function bindStatic() {
        document.getElementById('store-cart-btn').addEventListener('click', () => toggleCart(true));
        document.getElementById('store-cart-close').addEventListener('click', () => toggleCart(false));
        document.getElementById('store-cart-backdrop').addEventListener('click', () => toggleCart(false));
        document.getElementById('store-cart-checkout').addEventListener('click', checkout);
        document.getElementById('store-logout-btn').addEventListener('click', () => {
            Utils.confirmDialog('Deseja sair da sua conta?', async () => { await Auth.logout(); }, 'Sair');
        });
        document.getElementById('storefront-screen').addEventListener('click', (e) => {
            const catChip = e.target.closest('.store-cat-chip');
            const addBtn = e.target.closest('.js-add-cart');
            const qtyBtn = e.target.closest('.js-cart-qty');
            const rmBtn = e.target.closest('.js-cart-remove');
            if (catChip) { catFilter = catChip.dataset.cat; renderCats(); renderGrid(); }
            if (addBtn) addToCart(addBtn.dataset.id);
            if (qtyBtn) changeQty(qtyBtn.dataset.id, Number(qtyBtn.dataset.delta));
            if (rmBtn) removeFromCart(rmBtn.dataset.id);
        });
    }

    function toggleCart(open) {
        document.getElementById('store-cart-drawer').classList.toggle('open', open);
        document.getElementById('store-cart-backdrop').classList.toggle('open', open);
    }

    function listen() {
        unsubs.forEach(u => { try { u(); } catch (e) {} });
        unsubs = [];
        unsubs.push(window.db.collection('produtos').where('ativo', '==', true).onSnapshot(snap => {
            produtos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            render();
        }, err => console.error('storefront produtos', err)));
        unsubs.push(window.db.collection('configuracoes').doc('geral').onSnapshot(snap => {
            config = snap.exists ? snap.data() : {};
            renderFooter();
        }, err => console.error('storefront config', err)));
    }

    function render() {
        renderCats();
        renderGrid();
        renderCart();
    }

    function renderFooter() {
        const tel = document.getElementById('store-contato-tel');
        const insta = document.getElementById('store-contato-insta');
        const end = document.getElementById('store-contato-end');
        const sub = document.getElementById('store-hero-sub');
        if (tel) tel.innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${Utils.escapeHtml(config.telefone || 'Em breve')}`;
        if (insta) insta.innerHTML = `<i class="fa-brands fa-instagram"></i> ${Utils.escapeHtml(config.instagram || '@valledoces')}`;
        if (end) end.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${Utils.escapeHtml(config.endereco || 'Consulte a loja')}`;
        if (sub && config.nomeLoja) sub.textContent = `Doces artesanais da ${config.nomeLoja}, feitos com amor para adoçar os seus melhores momentos.`;
    }

    function renderCats() {
        const box = document.getElementById('store-cats');
        if (!box) return;
        const cats = [...new Set(produtos.map(p => p.categoria).filter(Boolean))];
        const icons = { 'Bombons': 'fa-candy-cane', 'Trufas': 'fa-cookie', 'Tortas': 'fa-cake-candles', 'Doces de Colher': 'fa-ice-cream', 'Brigadeiros': 'fa-circle', 'Cento de Docinhos': 'fa-gift' };
        box.innerHTML = ['', ...cats].map(c => `
            <div class="store-cat-chip ${catFilter === c ? 'active' : ''}" data-cat="${Utils.escapeHtml(c)}">
                <div class="store-cat-circle"><i class="fa-solid ${icons[c] || 'fa-cookie-bite'}"></i></div>
                <span>${c || 'Todos'}</span>
            </div>
        `).join('');
    }

    function renderGrid() {
        const grid = document.getElementById('store-grid');
        if (!grid) return;
        let list = produtos;
        if (catFilter) list = list.filter(p => p.categoria === catFilter);
        if (!list.length) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-cookie-bite"></i>Nenhum doce disponível no momento. Volte em breve!</div>`;
            return;
        }
        grid.innerHTML = list.map(p => `
            <div class="store-card">
                <div class="store-card-thumb">${p.imagemUrl ? `<img src="${p.imagemUrl}">` : '<i class="fa-solid fa-cookie-bite"></i>'}</div>
                <div class="store-card-body">
                    <span class="store-card-cat">${Utils.escapeHtml(p.categoria || 'Doces')}</span>
                    <strong class="store-card-name">${Utils.escapeHtml(p.nome)}</strong>
                    <div class="store-card-foot">
                        <span class="store-card-price">${Utils.formatBRL(p.precoVenda)}</span>
                        <button class="store-add-btn js-add-cart" data-id="${p.id}"><i class="fa-solid fa-cart-plus"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function addToCart(id) {
        const p = produtos.find(x => x.id === id);
        if (!p) return;
        const item = cart.find(i => i.id === id);
        if (item) item.qtd += 1;
        else cart.push({ id, nome: p.nome, preco: Number(p.precoVenda) || 0, qtd: 1 });
        Utils.toast(`${p.nome} adicionado ao carrinho.`, 'success');
        renderCart();
        toggleCart(true);
    }

    function changeQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qtd += delta;
        if (item.qtd <= 0) cart = cart.filter(i => i.id !== id);
        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(i => i.id !== id);
        renderCart();
    }

    function cartTotal() {
        return cart.reduce((s, i) => s + i.preco * i.qtd, 0);
    }

    function renderCart() {
        const badge = document.getElementById('store-cart-badge');
        const count = cart.reduce((s, i) => s + i.qtd, 0);
        if (badge) { badge.textContent = count; badge.style.display = count ? 'flex' : 'none'; }

        const itemsBox = document.getElementById('store-cart-items');
        if (!itemsBox) return;
        if (!cart.length) {
            itemsBox.innerHTML = `<div class="empty-state"><i class="fa-solid fa-cart-shopping"></i>Seu carrinho está vazio.</div>`;
        } else {
            itemsBox.innerHTML = cart.map(i => `
                <div class="store-cart-item">
                    <div class="store-cart-item-info">
                        <strong>${Utils.escapeHtml(i.nome)}</strong>
                        <span>${Utils.formatBRL(i.preco)}</span>
                    </div>
                    <div class="store-cart-item-qty">
                        <button class="js-cart-qty" data-id="${i.id}" data-delta="-1">−</button>
                        <span>${i.qtd}</span>
                        <button class="js-cart-qty" data-id="${i.id}" data-delta="1">+</button>
                    </div>
                    <button class="store-cart-item-remove js-cart-remove" data-id="${i.id}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `).join('');
        }
        document.getElementById('store-cart-total').textContent = Utils.formatBRL(cartTotal());
    }

    function checkout() {
        if (!cart.length) { Utils.toast('Seu carrinho está vazio.', 'error'); return; }
        const linhas = cart.map(i => `• ${i.qtd}x ${i.nome} — ${Utils.formatBRL(i.preco * i.qtd)}`).join('\n');
        const texto = `Olá! Gostaria de fazer este pedido:\n\n${linhas}\n\n*Total: ${Utils.formatBRL(cartTotal())}*`;
        const tel = (config.telefone || '').replace(/\D/g, '');
        if (!tel) { Utils.toast('A loja ainda não configurou um telefone para pedidos.', 'error'); return; }
        window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(texto)}`, '_blank');
    }

    return { mount };
})();
