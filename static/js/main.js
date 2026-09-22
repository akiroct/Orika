/* ============================================================
   ORIKA — main.js
   JavaScript puro (sem framework), organizado em blocos por
   funcionalidade. Cada bloco tem um comentário explicando o que faz.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initRevealOnScroll();
  initCart();
  initFaq();
  initSocialProofToasts();
  initViewersCounter();
  initPromoPopup();
});

/* ---------------------------------------------------------
   1) CONTADOR REGRESSIVO
   A "oferta" sempre termina à meia-noite do dia atual.
   Isso cria urgência de forma honesta: o contador é real,
   só que a "oferta" se renova todo dia.
--------------------------------------------------------- */
function initCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  function tick() {
    const agora = new Date();
    const meiaNoite = new Date(agora);
    meiaNoite.setHours(24, 0, 0, 0);

    const diffMs = meiaNoite - agora;
    const horas = String(Math.floor(diffMs / 3600000)).padStart(2, "0");
    const minutos = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, "0");
    const segundos = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, "0");

    el.textContent = `${horas}:${minutos}:${segundos}`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   2) ANIMAÇÃO AO ROLAR A PÁGINA
   Elementos com [data-reveal] ganham a classe "is-visible"
   quando entram na tela.
--------------------------------------------------------- */
function initRevealOnScroll() {
  const alvos = document.querySelectorAll("[data-reveal]");
  if (!alvos.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  alvos.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   3) CARRINHO / SACOLA
   Guardamos o carrinho no localStorage do navegador, então
   ele continua lá mesmo se a pessoa atualizar a página.
   Ao finalizar, montamos uma mensagem e abrimos o WhatsApp
   (é a forma mais simples e comum de "checkout" para lojas
   pequenas no Brasil — sem precisar de gateway de pagamento).
--------------------------------------------------------- */
const CART_KEY = "orika_cart";
const WHATSAPP_NUMBER = "5511999999999"; // troque pelo número real da loja

function lerCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
}

function initCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const toggleBtn = document.getElementById("cart-toggle");
  const closeBtn = document.getElementById("cart-close");
  const mobileOpenBtn = document.getElementById("mobile-cart-open");

  function abrirCarrinho() {
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
  }
  function fecharCarrinho() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
  }

  toggleBtn?.addEventListener("click", abrirCarrinho);
  mobileOpenBtn?.addEventListener("click", abrirCarrinho);
  closeBtn?.addEventListener("click", fecharCarrinho);
  overlay?.addEventListener("click", fecharCarrinho);

  // Botões "Adicionar à sacola" de cada produto
  document.querySelectorAll("[data-add-to-cart]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const card = botao.closest(".product-card");
      const produto = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
      };
      adicionarAoCarrinho(produto);

      // feedback visual rápido no botão
      botao.textContent = "Adicionado ✓";
      botao.classList.add("is-added");
      setTimeout(() => {
        botao.textContent = "Adicionar à sacola";
        botao.classList.remove("is-added");
      }, 1600);

      mostrarToast(`"${produto.name}" foi adicionado à sua sacola`, "🛍");
    });
  });

  renderizarCarrinho();
}

function adicionarAoCarrinho(produto) {
  const carrinho = lerCarrinho();
  const existente = carrinho.find((item) => item.id === produto.id);

  if (existente) {
    existente.qty += 1;
  } else {
    carrinho.push({ ...produto, qty: 1 });
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function alterarQuantidade(id, delta) {
  let carrinho = lerCarrinho();
  const item = carrinho.find((i) => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    carrinho = carrinho.filter((i) => i.id !== id);
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function removerDoCarrinho(id) {
  const carrinho = lerCarrinho().filter((i) => i.id !== id);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function renderizarCarrinho() {
  const carrinho = lerCarrinho();
  const container = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("cart-empty");
  const subtotalEl = document.getElementById("cart-subtotal");
  const contadores = [document.getElementById("cart-count"), document.getElementById("mobile-cart-count")];
  const checkoutLink = document.getElementById("cart-checkout");
  const mobileBar = document.getElementById("mobile-sticky-bar");

  if (!container) return;

  // limpa tudo que não seja a mensagem de "vazio"
  container.querySelectorAll(".cart-line").forEach((el) => el.remove());

  const totalItens = carrinho.reduce((soma, item) => soma + item.qty, 0);
  contadores.forEach((el) => el && (el.textContent = totalItens));

  if (mobileBar) {
    mobileBar.classList.toggle("is-visible", totalItens > 0);
  }

  if (carrinho.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";

    carrinho.forEach((item) => {
      const linha = document.createElement("div");
      linha.className = "cart-line";
      linha.innerHTML = `
        <div class="cart-line-media" style="background:#222">🛍</div>
        <div class="cart-line-info">
          <h4>${item.name}</h4>
          <div class="cart-line-price">R$ ${item.price.toFixed(2).replace(".", ",")} × ${item.qty}</div>
          <div class="cart-line-qty">
            <button data-qty-menos>−</button>
            <span>${item.qty}</span>
            <button data-qty-mais>+</button>
          </div>
          <button class="cart-line-remove" data-remover>remover</button>
        </div>
      `;
      linha.querySelector("[data-qty-menos]").addEventListener("click", () => alterarQuantidade(item.id, -1));
      linha.querySelector("[data-qty-mais]").addEventListener("click", () => alterarQuantidade(item.id, 1));
      linha.querySelector("[data-remover]").addEventListener("click", () => removerDoCarrinho(item.id));
      container.appendChild(linha);
    });
  }

  const subtotal = carrinho.reduce((soma, item) => soma + item.price * item.qty, 0);
  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;

  // monta o link do WhatsApp com o resumo do pedido
  if (checkoutLink) {
    if (carrinho.length === 0) {
      checkoutLink.href = "#";
    } else {
      const linhas = carrinho.map((i) => `• ${i.qty}x ${i.name} — R$ ${(i.price * i.qty).toFixed(2).replace(".", ",")}`);
      const texto = [
        "Olá! Quero fechar este pedido na Orika:",
        "",
        ...linhas,
        "",
        `Total: R$ ${subtotal.toFixed(2).replace(".", ",")}`,
      ].join("\n");
      checkoutLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    }
  }
}

/* ---------------------------------------------------------
   4) FAQ (perguntas frequentes) — abre/fecha ao clicar
--------------------------------------------------------- */
function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const pergunta = item.querySelector(".faq-question");
    const resposta = item.querySelector(".faq-answer");

    pergunta.addEventListener("click", () => {
      const jaAberto = item.classList.contains("is-open");

      // fecha os outros itens abertos (efeito "acordeão")
      document.querySelectorAll(".faq-item.is-open").forEach((outro) => {
        outro.classList.remove("is-open");
        outro.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!jaAberto) {
        item.classList.add("is-open");
        resposta.style.maxHeight = resposta.scrollHeight + "px";
      }
    });
  });
}

/* ---------------------------------------------------------
   5) NOTIFICAÇÕES DE PROVA SOCIAL
   Mostra de tempos em tempos um aviso tipo
   "Fulano comprou X há 3 minutos" — nomes e tempos fictícios,
   só para dar uma sensação de loja ativa.
--------------------------------------------------------- */
const NOMES_DEMO = ["Lucas", "Marina", "Pedro", "Ana", "Rafael", "Júlia", "Gabriel", "Larissa"];
const CIDADES_DEMO = ["São Paulo", "Rio de Janeiro", "Curitiba", "Belo Horizonte", "Porto Alegre", "Salvador"];

function initSocialProofToasts() {
  const produtos = Array.from(document.querySelectorAll(".product-card")).map((c) => c.dataset.name);
  if (!produtos.length) return;

  function dispararToast() {
    const nome = NOMES_DEMO[Math.floor(Math.random() * NOMES_DEMO.length)];
    const cidade = CIDADES_DEMO[Math.floor(Math.random() * CIDADES_DEMO.length)];
    const produto = produtos[Math.floor(Math.random() * produtos.length)];
    const minutos = Math.floor(Math.random() * 12) + 1;

    mostrarToast(`${nome}, de ${cidade}, comprou ${produto} há ${minutos} min`, "🔥");
  }

  // primeiro toast depois de um tempinho, depois em intervalos aleatórios
  setTimeout(dispararToast, 6000);
  setInterval(() => dispararToast(), 14000 + Math.random() * 8000);
}

function mostrarToast(mensagem, emoji = "✳") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-emoji">${emoji}</span><span>${mensagem}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 4600);

  // não deixa acumular muitos toasts na tela
  const todos = container.querySelectorAll(".toast");
  if (todos.length > 3) todos[0].remove();
}

/* ---------------------------------------------------------
   6) CONTADOR DE "PESSOAS VENDO A LOJA AGORA"
   Um número que oscila levemente para parecer ao vivo.
--------------------------------------------------------- */
function initViewersCounter() {
  const el = document.getElementById("viewers-count");
  if (!el) return;

  setInterval(() => {
    const atual = parseInt(el.textContent, 10);
    const variacao = Math.floor(Math.random() * 5) - 2; // -2 a +2
    const novo = Math.min(89, Math.max(21, atual + variacao));
    el.textContent = novo;
  }, 3500);
}

/* ---------------------------------------------------------
   7) POPUP DE CUPOM
   Aparece uma vez por sessão, depois de alguns segundos.
--------------------------------------------------------- */
function initPromoPopup() {
  const overlay = document.getElementById("promo-overlay");
  const closeBtn = document.getElementById("promo-close");
  const form = document.getElementById("promo-form");
  if (!overlay) return;

  const jaMostrou = sessionStorage.getItem("orika_promo_mostrado");

  if (!jaMostrou) {
    setTimeout(() => {
      overlay.classList.add("is-open");
      sessionStorage.setItem("orika_promo_mostrado", "1");
    }, 15000);
  }

  closeBtn?.addEventListener("click", () => overlay.classList.remove("is-open"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("is-open");
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    overlay.querySelector(".promo-modal").innerHTML = `
      <span class="eyebrow">OBRIGADO!</span>
      <h3>Seu cupom é<br>ORIKA10</h3>
      <p>Use no WhatsApp na hora de fechar o pedido.</p>
    `;
    setTimeout(() => overlay.classList.remove("is-open"), 2600);
  });
}
