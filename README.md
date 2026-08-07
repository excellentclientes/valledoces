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
js/onboarding.js            assistente de boas-vindas (primeiro login de um usuário autorizado)
js/storefront.js            loja virtual pública (login autenticado mas fora da lista de autorizados)
firestore.rules            regras de segurança do Firestore
storage.rules               regras de segurança do Storage (fotos de produtos e de perfil)
```

## Primeiro acesso — passo a passo no Firebase Console

O projeto `valledoces` já está conectado no código. O login da tela inicial é feito por
**e-mail e senha (com cadastro direto pelo próprio sistema)** ou por **login com Google** —
não é preciso criar o usuário manualmente no console. Falta apenas habilitar os dois
provedores:

1. Acesse o [Firebase Console](https://console.firebase.google.com/) → projeto **valledoces**.
2. **Authentication → Sign-in method** → habilite o provedor **E-mail/senha**.
3. Nessa mesma tela, habilite também o provedor **Google** (defina um e-mail de suporte
   quando pedido).
4. **Authentication → Settings → Authorized domains** → confira se o domínio onde o
   sistema vai rodar (ex.: `valledoces.web.app`, ou o domínio do GitHub Pages/Hosting)
   está na lista — senão o login com Google não funciona.
5. **Firestore Database** → crie o banco (modo produção) caso ainda não exista.
6. Publique as regras de segurança inclusas neste repositório para restringir o acesso
   aos dados apenas a usuários autenticados:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use valledoces
   firebase deploy --only firestore:rules,storage
   ```
   (ou cole o conteúdo de `firestore.rules` e `storage.rules` diretamente no console,
   em Firestore → Regras / Storage → Regras).
7. Abra `index.html` (ou publique via Firebase Hosting / GitHub Pages) e crie sua conta
   direto na tela de login ("Cadastrar") ou entre com o Google, usando o e-mail
   `andressavalerio@yahoo.com` (já vem liberado por padrão — veja abaixo).

> As chaves em `config/firebase-config.js` são as credenciais **públicas** do app Web —
> é normal e esperado que fiquem visíveis no navegador. A segurança de verdade vem das
> regras do Firestore/Storage (passo 6) e do login.

### Quem consegue entrar no painel de gestão?

O cadastro (e-mail ou Google) é aberto para qualquer pessoa, mas **só quem está na lista
de "Usuários autorizados"** (Configurações → Usuários autorizados, dentro do painel) tem
acesso aos dados do negócio — pedidos, clientes, financeiro, etc. As regras do Firestore
já aplicam essa mesma restrição no servidor, não só na tela.

Quem faz login com um e-mail fora da lista (Google ou cadastro) não vê o painel: cai
direto numa **loja virtual pública**, com o catálogo de produtos ativos e um carrinho que
finaliza o pedido pelo WhatsApp da loja (número configurado em Dados da loja).

No primeiro login (autorizado ou não) o sistema pede nome, telefone e foto (opcional) antes
de continuar. Para e-mails autorizados isso vira o perfil do painel (`usuarios/{uid}`); para
clientes da loja virtual, vira um cadastro em `clientes/{uid}` — ou seja, cada pessoa que faz
login na loja já entra automaticamente como cliente no CRM do painel. Ao finalizar uma compra,
a loja cria um pedido de verdade (mesma coleção `pedidos` usada pelo painel, com o `clienteId`
apontando pra esse cadastro), lançamento em Financeiro e itens em Produção — então as compras
feitas pela loja aparecem no Kanban de Pedidos, nas estatísticas de Clientes, no Financeiro e
no Dashboard, junto com os pedidos criados manualmente pelo painel.

> Pedidos feitos pela loja virtual não abatem automaticamente o estoque de ingredientes —
> só os pedidos lançados pelo painel fazem isso hoje, pra evitar dar a uma conta de cliente
> qualquer permissão de alterar estoque/preço no banco.

A capa da loja (Configurações → Capa da loja) aceita quantas fotos você quiser. Com 2 ou mais,
elas aparecem na página inicial da loja como um carrossel, avançando sozinho a cada 3 segundos.

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
