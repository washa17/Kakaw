/**
 * kakaw · menu.js
 * Injeta o menu lateral e overlay em qualquer página.
 * Uso: <script src="menu.js"></script>  (antes do </body>)
 *
 * Para adicionar uma nova página basta incluir um item em NAV_ITEMS.
 */

(function () {

  /* ── Itens de navegação ─────────────────────────────────────── */
  const NAV_ITEMS = [
    { href: "index.html",     label: "Nova Compra", sub: "registrar pedido"          },
    { href: "tabela.html",    label: "Tabela",      sub: "débitos ativos"            },
    { href: "mensagem.html",  label: "Mensagem",    sub: "template whatsapp"         },
    { href: "clientes.html",  label: "Clientes",    sub: "gestão de cadastros"       },
    { href: "importar.html",  label: "Importar",    sub: "vários clientes de uma vez"},
    { href: "historico.html", label: "Histórico",   sub: "últimos 7 dias"            },
  ];

  /* ── Detecta página ativa pelo pathname ─────────────────────── */
  function paginaAtiva(href) {
    const path = window.location.pathname;
    const file = path.split("/").pop();
    const atual = (!file || file === "") ? "index.html" : file;
    return atual === href;
  }

  /* ── SVG da flor ─────────────────────────────────────────────── */
  function florSVG(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="10" stroke="#3A5C2C" stroke-width="1.5"/>
      <circle cx="48" cy="48" r="4" fill="#3A5C2C"/>
      <path d="M48 38 C43 26 31 25 30 35 C29 45 40 47 48 38Z" fill="#3A5C2C" opacity=".12" stroke="#3A5C2C" stroke-width="1.1"/>
      <path d="M58 48 C70 43 71 31 61 30 C51 29 49 40 58 48Z" fill="#5C3418" opacity=".12" stroke="#5C3418" stroke-width="1.1"/>
      <path d="M48 58 C53 70 65 71 66 61 C67 51 56 49 48 58Z" fill="#3A5C2C" opacity=".12" stroke="#3A5C2C" stroke-width="1.1"/>
      <path d="M38 48 C26 53 25 65 35 66 C45 67 47 56 38 48Z" fill="#5C3418" opacity=".12" stroke="#5C3418" stroke-width="1.1"/>
    </svg>`;
  }

  /* ── HTML do menu ────────────────────────────────────────────── */
  function menuHTML() {
    const navItems = NAV_ITEMS.map(item => {
      const ativo = paginaAtiva(item.href);
      return `
        <a class="kakaw-nav-item${ativo ? " ativo" : ""}" href="${item.href}">
          <div class="kakaw-nav-label">${item.label}</div>
          <div class="kakaw-nav-sub">${item.sub}</div>
        </a>`;
    }).join("");

    return `
      <div id="kakaw-overlay"></div>

      <div id="kakaw-menu" role="navigation" aria-label="Menu principal">

        <div class="kakaw-menu-header">
          ${florSVG(32)}
          <div class="kakaw-menu-title">kakaw</div>
          <div class="kakaw-menu-divider"></div>
          <div class="kakaw-menu-subtitle">doces artesanais</div>
        </div>

        <nav class="kakaw-menu-nav">
          ${navItems}
        </nav>

        <div class="kakaw-menu-footer">
          versão 1.0 · kakaw
        </div>

      </div>`;
  }

  /* ── CSS ─────────────────────────────────────────────────────── */
  function injetarCSS() {
    if (document.getElementById("kakaw-menu-css")) return;
    const style = document.createElement("style");
    style.id = "kakaw-menu-css";
    style.textContent = `
      /* ── Overlay ── */
      #kakaw-overlay {
        position: fixed;
        inset: 0;
        background: rgba(26,18,8,.45);
        z-index: 98;
        opacity: 0;
        pointer-events: none;
        transition: opacity .3s;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
      }
      #kakaw-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      /* ── Painel ── */
      #kakaw-menu {
        position: fixed;
        top: 0;
        left: 0;
        /*
          100dvh (dynamic viewport height) acompanha a barra de
          endereço do browser mobile, eliminando o gap/corte.
          Fallback para 100vh em browsers sem suporte.
        */
        height: 100vh;
        height: 100dvh;
        width: 260px;
        background: var(--bg, #F5EFE2);
        z-index: 99;
        transform: translateX(-100%);
        transition: transform .35s cubic-bezier(.4,0,.2,1);
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--div, #DDD4BC);
        overflow: hidden; /* o scroll fica só na nav interna */
      }
      #kakaw-menu.open {
        transform: translateX(0);
      }

      /* ── Header (fixo no topo do menu) ── */
      .kakaw-menu-header {
        padding: 52px 32px 28px;
        border-bottom: 1px solid var(--div, #DDD4BC);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .45rem;
        flex-shrink: 0;
      }
      .kakaw-menu-title {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-weight: 400;
        font-size: 1.5rem;
        color: var(--dark, #1A1208);
        letter-spacing: .02em;
        line-height: 1;
      }
      .kakaw-menu-divider {
        height: 1px;
        width: 70px;
        background: var(--choco, #5C3418);
        opacity: .4;
      }
      .kakaw-menu-subtitle {
        font-family: 'DM Mono', monospace;
        font-size: .3rem;
        letter-spacing: .45em;
        text-transform: uppercase;
        color: var(--choco, #5C3418);
      }

      /* ── Nav — única área que scrolla ── */
      .kakaw-menu-nav {
        flex: 1;
        padding: 8px 0;
        overflow-y: auto;
        overflow-x: hidden;
        /*
          overscroll-behavior: contain impede que o scroll
          do menu propague para a página de fundo (desktop e mobile).
        */
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }
      /* esconde scrollbar mas mantém scroll funcional */
      .kakaw-menu-nav::-webkit-scrollbar { width: 0; }
      .kakaw-menu-nav { scrollbar-width: none; }

      /* ── Itens de navegação ── */
      .kakaw-nav-item {
        display: block;
        padding: 20px 32px;
        cursor: pointer;
        border-bottom: 1px solid var(--div, #DDD4BC);
        border-left: 3px solid transparent;
        transition: background .2s, border-color .2s;
        text-decoration: none;
      }
      .kakaw-nav-item:hover {
        background: var(--bgCard, #EDE5D4);
      }
      .kakaw-nav-item.ativo {
        background: var(--bgCard, #EDE5D4);
        border-left-color: var(--verde, #3A5C2C);
        padding-left: 29px; /* compensa os 3px da borda ativa */
      }
      .kakaw-nav-label {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-weight: 300;
        font-size: 1.18rem;
        color: var(--dark, #1A1208);
      }
      .kakaw-nav-sub {
        font-family: 'DM Mono', monospace;
        font-size: .46rem;
        letter-spacing: .3em;
        text-transform: uppercase;
        color: var(--muted, #8A7860);
        margin-top: 3px;
      }

      /* ── Footer (fixo na base do menu) ── */
      .kakaw-menu-footer {
        padding: 20px 32px;
        border-top: 1px solid var(--div, #DDD4BC);
        font-family: 'DM Mono', monospace;
        font-size: .46rem;
        letter-spacing: .28em;
        text-transform: uppercase;
        color: var(--mutedL, #B0A890);
        flex-shrink: 0;
      }

      /*
        Trava o scroll do body quando o menu está aberto.
        position: fixed + width: 100% é necessário no iOS,
        onde overflow: hidden sozinho não impede o scroll.
      */
      body.kakaw-menu-open {
        overflow: hidden;
        position: fixed;
        width: 100%;
        /* preserva a posição do scroll para não pular ao abrir */
        top: var(--kakaw-scroll-top, 0);
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Salva/restaura posição do scroll ao travar o body ──────── */
  let scrollY = 0;

  function travarBody() {
    scrollY = window.scrollY;
    document.documentElement.style.setProperty("--kakaw-scroll-top", `-${scrollY}px`);
    document.body.classList.add("kakaw-menu-open");
  }

  function liberarBody() {
    document.body.classList.remove("kakaw-menu-open");
    document.documentElement.style.removeProperty("--kakaw-scroll-top");
    window.scrollTo(0, scrollY);
  }

  /* ── Injeta HTML no início do body ──────────────────────────── */
  function injetar() {
    injetarCSS();

    const root = document.createElement("div");
    root.id = "kakaw-menu-root";
    root.innerHTML = menuHTML();
    document.body.insertBefore(root, document.body.firstChild);

    document.getElementById("kakaw-overlay")
      .addEventListener("click", () => window.kakawMenu.close());

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") window.kakawMenu.close();
    });
  }

  /* ── API pública ─────────────────────────────────────────────── */
  window.kakawMenu = {
    open() {
      document.getElementById("kakaw-menu")?.classList.add("open");
      document.getElementById("kakaw-overlay")?.classList.add("open");
      travarBody();
    },
    close() {
      document.getElementById("kakaw-menu")?.classList.remove("open");
      document.getElementById("kakaw-overlay")?.classList.remove("open");
      liberarBody();
    },
    toggle() {
      const aberto = document.getElementById("kakaw-menu")?.classList.contains("open");
      aberto ? this.close() : this.open();
    }
  };

  /* Retrocompatibilidade com os HTMLs existentes */
  window.openMenu  = () => window.kakawMenu.open();
  window.closeMenu = () => window.kakawMenu.close();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injetar);
  } else {
    injetar();
  }

})();
