# Orika — loja

Landing page + loja da marca Orika. Backend em **Python (Flask)**,
banco de dados **PostgreSQL**, e front-end em **HTML, CSS e
JavaScript puro** (sem frameworks, sem etapa de build — é só abrir
e editar).

> Sobre o Node.js: não é necessário aqui. O Flask (Python) já serve o
> site inteiro sozinho, então usar Node.js junto criaria dois
> servidores fazendo a mesma coisa. O JavaScript do projeto roda
> igual, só que direto no navegador (arquivo `static/js/main.js`),
> que é onde o JavaScript de qualquer site sempre roda.

## O que tem de novo em relação à versão anterior

- Seção **Loja** com produtos vindos do banco de dados (preço, nota,
  estoque, desconto).
- **Carrinho de compras** (sacola) que salva no navegador e finaliza
  o pedido direto no WhatsApp, com o resumo já preenchido.
- Contador de **oferta do dia**, aviso de **estoque baixo**,
  **pessoas vendo a loja agora** e notificações de compras recentes
  — tudo para dar senso de urgência e confiança.
- Seção de **depoimentos** e **perguntas frequentes**.
- Popup de cupom de primeira compra.

## Estrutura de arquivos

```
orika/
├── app.py            → servidor Flask (rotas)
├── models.py          → tabela de produtos (SQLAlchemy)
├── seed.py             → cria/popula o banco com produtos de exemplo
├── seed_data.py         → lista dos produtos (edite aqui os produtos)
├── requirements.txt
├── .env.example
├── templates/
│   └── index.html      → HTML da página (usa {{ }} do Jinja)
└── static/
    ├── css/style.css   → todo o visual
    ├── js/main.js       → carrinho, contador, FAQ, notificações
    └── images/           → favicon.png
```

## Sobre a paleta e a marca

O site usa fundo preto, roxo/violeta e estrelas. A cor de destaque
(botões, avisos de estoque, contorno de status) usa a variável
`--accent` no topo de `style.css` — troque só ali se quiser ajustar o
tom de roxo. O favicon aparece na barra de navegação e na aba do
navegador.

## Como rodar

### 1. Instalar as dependências Python

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Configurar o PostgreSQL

Se você já tem o PostgreSQL instalado, crie um banco vazio, por
exemplo `orika_db`. Depois copie `.env.example` para `.env` e ajuste
usuário/senha:

```
DATABASE_URL=postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/orika_db
```

Se você **ainda não tem Postgres configurado**, não tem problema: o
site funciona mesmo assim, usando os produtos de exemplo definidos
em `seed_data.py` (você vai ver um aviso no terminal, e a página abre
normalmente).

### 3. Popular o banco (só na primeira vez)

```powershell
python seed.py
```

Isso cria a tabela `products` e insere os produtos de demonstração.

### 4. Rodar o site

```powershell
python app.py
```

Abra **http://127.0.0.1:5000** no navegador.

## Editando o conteúdo

- **Produtos** (nome, preço, estoque, kanji, cores): edite
  `seed_data.py` e rode `python seed.py` de novo (apague a tabela
  antes se quiser recomeçar do zero).
- **Textos do manifesto / hero**: edite direto em
  `templates/index.html`.
- **Número do WhatsApp**: troque a constante `WHATSAPP_NUMBER` no
  topo de `static/js/main.js`, e também o link do botão flutuante em
  `templates/index.html`.
- **Cores e tipografia**: no topo de `static/css/style.css`, dentro
  de `:root{...}`.
