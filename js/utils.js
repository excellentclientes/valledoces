/* ==========================================================================
   Utilidades compartilhadas — Vallê Doces
   ========================================================================== */

const Utils = (() => {

    function formatBRL(value) {
        const n = Number(value) || 0;
        return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDateBR(date) {
        if (!date) return '--';
        const d = (date instanceof Date) ? date : new Date(date);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    function formatDateShort(date) {
        if (!date) return '--';
        const d = (date instanceof Date) ? date : new Date(date);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    function formatDateTimeBR(date) {
        if (!date) return '--';
        const d = (date instanceof Date) ? date : new Date(date);
        return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function todayKey(date) {
        const d = date ? new Date(date) : new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function toDate(val) {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (val.toDate) return val.toDate();
        return new Date(val);
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

    function debounce(fn, wait = 250) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    }

    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function toast(msg, type = 'info') {
        const wrap = document.getElementById('toast-wrap');
        const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${escapeHtml(msg)}</span>`;
        wrap.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; setTimeout(() => el.remove(), 260); }, 3200);
    }

    function openModal(html, opts = {}) {
        const overlay = document.getElementById('modal-overlay');
        const box = document.getElementById('modal-box');
        box.className = 'modal' + (opts.wide ? ' wide' : '');
        box.innerHTML = html;
        overlay.classList.add('open');
    }

    function closeModal() {
        document.getElementById('modal-overlay').classList.remove('open');
        document.getElementById('modal-box').innerHTML = '';
    }

    function confirmDialog(message, onConfirm, title = 'Confirmar exclusão') {
        const overlay = document.getElementById('confirm-overlay');
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-msg').textContent = message;
        overlay.classList.add('open');
        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.getElementById('confirm-cancel');
        const cleanup = () => { overlay.classList.remove('open'); okBtn.onclick = null; cancelBtn.onclick = null; };
        okBtn.onclick = async () => { cleanup(); await onConfirm(); };
        cancelBtn.onclick = cleanup;
    }

    // Fecha modal clicando fora
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') closeModal();
        });
        document.getElementById('confirm-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-overlay') e.currentTarget.classList.remove('open');
        });
    });

    const STATUS_LABELS = {
        aguardando: 'Aguardando',
        producao: 'Em produção',
        pronto: 'Pronto',
        entregue: 'Entregue',
        cancelado: 'Cancelado'
    };

    function statusBadge(status) {
        const label = STATUS_LABELS[status] || status;
        return `<span class="badge badge-${status}">${label}</span>`;
    }

    return {
        formatBRL, formatDateBR, formatDateShort, formatDateTimeBR, todayKey, toDate,
        escapeHtml, debounce, uid, toast, openModal, closeModal, confirmDialog,
        statusBadge, STATUS_LABELS
    };
})();
