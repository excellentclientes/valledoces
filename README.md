# Vallê Doces — Sistema de Gestão

Sistema completo de gestão para a Vallê Doces: pedidos, clientes, produtos, cardápio,
produção, estoque, financeiro, precificação e relatórios — tudo em tempo real com Firebase.

## Stack

HTML, CSS e JavaScript puro (sem build/bundler), Firebase (Authentication + Firestore + Storage)
e Chart.js para os gráficos. Basta abrir/publicar os arquivos estáticos, não há passo de build.

## Estrutura

```
index.html              shell da aplicação (login + layout do painel)
css/style.css            paleta e estilos (laranja/creme, identidade Vallê Doces)
config/firebase-config.js  credenciais do projeto Firebase (separado do restante do código)
js/utils.js               helpers (formatação, toasts, modais)
js/auth.js                login/logout
js/app.js                 Store central (dados em tempo real) + navegação
js/dashboard.js           aba Dashboard
js/pedidos.js             aba Pedidos (kanban por status)
js/clientes.js            aba Clientes
js/produtos.js             aba Produtos
js/cardapio.js             aba Cardápio
js/producao.js             aba Produção
js/estoque.js               aba Estoque (ingredientes/insumos)
js/financeiro.js            aba Financeiro
js/precificacao.js          aba Precificação (ficha técnica de custo)
js/relatorios.js            aba Relatórios
js/configuracoes.js         aba Configurações
firestore.rules            regras de segurança do Firestore
storage.rules               regras de segurança do Storage (fotos de produtos)
```

## Primeiro acesso — passo a passo no Firebase Console

O projeto `valledoces` já está conectado no código. Falta apenas habilitar o login e
criar seu usuário administrador:

1. Acesse o [Firebase Console](https://console.firebase.google.com/) → projeto **valledoces**.
2. **Authentication → Sign-in method** → habilite o provedor **E-mail/senha**.
3. **Authentication → Users → Add user** → cadastre seu e-mail e uma senha (esse será o
   login usado na tela inicial do sistema).
4. **Firestore Database** → crie o banco (modo produção) caso ainda não exista.
5. Publique as regras de segurança inclusas neste repositório para restringir o acesso
   aos dados apenas a usuários autenticados:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use valledoces
   firebase deploy --only firestore:rules,storage
   ```
   (ou cole o conteúdo de `firestore.rules` e `storage.rules` diretamente no console,
   em Firestore → Regras / Storage → Regras).
6. Abra `index.html` (ou publique via Firebase Hosting / GitHub Pages) e entre com o
   e-mail e senha cadastrados no passo 3.

> As chaves em `config/firebase-config.js` são as credenciais **públicas** do app Web —
> é normal e esperado que fiquem visíveis no navegador. A segurança de verdade vem das
> regras do Firestore/Storage (passo 5) e do login: sem estar autenticado, ninguém lê ou
> grava dados.

## Publicar (Firebase Hosting)

```bash
firebase init hosting   # escolha a pasta atual como "public directory"
firebase deploy --only hosting
```

Qualquer outra opção de hospedagem de site estático (GitHub Pages, Netlify, Vercel) também
funciona, já que não há back-end — tudo fala diretamente com o Firebase pelo navegador.

## Como o sistema funciona

- **Dashboard**: faturamento, pedidos e ticket médio do dia (com variação vs. ontem),
  gráfico de faturamento, status dos pedidos, pedidos recentes, top produtos e alertas
  de estoque baixo — tudo calculado em tempo real a partir das outras abas.
- **Pedidos**: quadro kanban (Aguardando → Em produção → Pronto → Entregue). Criar um
  pedido gera automaticamente o lançamento no Financeiro, os itens na Produção e reduz o
  estoque dos produtos vendidos.
- **Clientes / Produtos / Estoque**: cadastros completos com busca e edição.
- **Cardápio**: vitrine visual dos produtos ativos, com destaque e preço.
- **Produção**: lista diária de itens a produzir, com status (pendente → em andamento → concluído).
- **Financeiro**: receitas e despesas, saldo do mês e gráfico dos últimos 6 meses.
- **Precificação**: monta a ficha técnica (ingredientes + quantidade), calcula o custo e
  sugere o preço de venda a partir da margem desejada — com um clique aplica o preço ao produto.
- **Relatórios**: desempenho por período, top produtos, formas de pagamento e top clientes,
  com exportação em CSV.
- **Configurações**: dados da loja, categorias de produtos, formas de pagamento aceitas e conta.
