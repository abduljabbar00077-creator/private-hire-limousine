(() => {
  "use strict";
  const ROOT = "/";
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);

  async function loadArticles() {
    try {
      const response = await fetch(ROOT + "articles.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("Could not load articles.json");
      const data = await response.json();
      return Array.isArray(data) ? data.filter(item => item && item.title && item.url) : [];
    } catch (error) {
      console.error("Travel guide menu:", error);
      return [];
    }
  }

  function buildHeader(articles) {
    if (document.querySelector(".phl-site-header")) return;
    const header = document.createElement("header");
    header.className = "phl-site-header";
    const firstFive = articles.slice(0, 5);
    const remaining = articles.slice(5);

    header.innerHTML = `
      <div class="phl-nav-inner">
        <a class="phl-brand" href="/">PRIVATE HIRE <span>LIMOUSINE</span></a>
        <button class="phl-menu-toggle" type="button" aria-expanded="false" aria-controls="phl-main-nav">
          <span class="phl-menu-icon" aria-hidden="true">☰</span> Menu
        </button>
        <nav class="phl-main-nav" id="phl-main-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/abu-dhabi-limousine/">Abu Dhabi</a>
          <a href="/dubai-limousine/">Dubai</a>
          <a href="/#services">Services</a>
          <div class="phl-guides">
            <button class="phl-guides-toggle" type="button" aria-expanded="false" aria-controls="phl-guides-menu">
              Travel Guide <span aria-hidden="true">▾</span>
            </button>
            <div class="phl-guides-menu" id="phl-guides-menu">
              <a class="phl-all-guides" href="/articles/">All Travel Guides</a>
              <div class="phl-guide-links">
                ${firstFive.map(item => `<a href="${esc(item.url)}">${esc(item.title)}</a>`).join("")}
              </div>
              ${remaining.length ? `
                <button class="phl-more-toggle" type="button" aria-expanded="false">
                  More articles <span aria-hidden="true">＋</span>
                </button>
                <div class="phl-more-links" hidden>
                  ${remaining.map(item => `<a href="${esc(item.url)}">${esc(item.title)}</a>`).join("")}
                </div>` : ""}
            </div>
          </div>
          <a href="/#contact">Contact</a>
        </nav>
      </div>`;

    const style = document.createElement("style");
    style.textContent = `
      .phl-site-header{position:relative;z-index:1000;background:#101820;color:#fff;border-bottom:3px solid #c49a55;font:15px/1.4 Arial,Helvetica,sans-serif}
      .phl-nav-inner{max-width:1180px;margin:auto;padding:13px 20px;display:flex;align-items:center;justify-content:space-between;gap:18px}
      .phl-brand{color:#fff;text-decoration:none;font-weight:800;letter-spacing:.06em;font-size:15px;white-space:nowrap}
      .phl-brand span{color:#d9bd8b}
      .phl-main-nav{display:flex;align-items:center;gap:20px}
      .phl-main-nav>a,.phl-guides-toggle{color:#fff;text-decoration:none;font:500 14px Arial,Helvetica,sans-serif;background:none;border:0;padding:9px 0;cursor:pointer}
      .phl-main-nav>a:hover,.phl-guides-toggle:hover{color:#e2c38f}
      .phl-guides{position:relative}
      .phl-guides-menu{display:none;position:absolute;top:100%;left:0;width:260px;max-height:70vh;overflow:auto;background:#fff;color:#17212b;border:1px solid #e5e8eb;border-radius:7px;box-shadow:0 12px 28px rgba(0,0,0,.2);padding:9px}
      .phl-guides.is-open .phl-guides-menu{display:block}
      .phl-guides-menu a{display:block;color:#263442;text-decoration:none;padding:9px 10px;border-radius:4px;font-size:14px}
      .phl-guides-menu a:hover{background:#f5f1e9;color:#8b672f}
      .phl-guides-menu .phl-all-guides{font-weight:700;border-bottom:1px solid #e5e8eb;border-radius:0;margin-bottom:4px}
      .phl-more-toggle{display:block;width:100%;text-align:left;background:#f5f1e9;color:#765626;border:0;border-radius:4px;padding:10px;margin-top:6px;font-weight:700;cursor:pointer}
      .phl-more-links{padding-top:4px}
      .phl-menu-toggle{display:none;background:transparent;border:1px solid rgba(255,255,255,.45);border-radius:5px;color:#fff;padding:8px 11px;font-size:14px}
      @media(max-width:760px){
        .phl-nav-inner{flex-wrap:wrap;padding:12px 16px}
        .phl-menu-toggle{display:block;margin-left:auto}
        .phl-main-nav{display:none;flex:0 0 100%;align-items:stretch;flex-direction:column;gap:2px;padding:8px 0 4px}
        .phl-main-nav.is-open{display:flex}
        .phl-main-nav>a,.phl-guides-toggle{display:block;width:100%;text-align:left;padding:11px 5px;border-top:1px solid rgba(255,255,255,.12)}
        .phl-guides-menu{position:static;width:100%;max-height:none;margin:4px 0 8px;box-shadow:none}
        .phl-guides-toggle{border:0}
      }
    `;
    document.head.appendChild(style);
    document.body.insertBefore(header, document.body.firstChild);

    const menuToggle = header.querySelector(".phl-menu-toggle");
    const mainNav = header.querySelector(".phl-main-nav");
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      mainNav.classList.toggle("is-open", open);
    });

    const guides = header.querySelector(".phl-guides");
    const guidesToggle = header.querySelector(".phl-guides-toggle");
    guidesToggle.addEventListener("click", () => {
      const open = guidesToggle.getAttribute("aria-expanded") !== "true";
      guidesToggle.setAttribute("aria-expanded", String(open));
      guides.classList.toggle("is-open", open);
    });

    const moreToggle = header.querySelector(".phl-more-toggle");
    if (moreToggle) {
      const moreLinks = header.querySelector(".phl-more-links");
      moreToggle.addEventListener("click", () => {
        const open = moreToggle.getAttribute("aria-expanded") !== "true";
        moreToggle.setAttribute("aria-expanded", String(open));
        moreLinks.hidden = !open;
        moreToggle.innerHTML = open ? 'Show fewer <span aria-hidden="true">−</span>' : 'More articles <span aria-hidden="true">＋</span>';
      });
    }
    document.addEventListener("click", event => {
      if (!guides.contains(event.target)) {
        guides.classList.remove("is-open");
        guidesToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function buildArticleListing(articles) {
    const list = document.getElementById("all-articles");
    if (!list || list.dataset.rendered === "true") return;
    list.dataset.rendered = "true";
    const firstFive = articles.slice(0, 5);
    const remaining = articles.slice(5);
    const renderItems = items => items.map(item => `
      <li class="article-card">
        <a href="${esc(item.url)}">${esc(item.title)}</a>
        ${item.description ? `<p>${esc(item.description)}</p>` : ""}
      </li>`).join("");
    list.innerHTML = renderItems(firstFive);
    if (remaining.length) {
      const more = document.createElement("div");
      more.className = "articles-more-wrap";
      more.innerHTML = `<button class="articles-more-button" type="button" aria-expanded="false">More articles <span aria-hidden="true">＋</span></button><ul class="articles-extra" hidden>${renderItems(remaining)}</ul>`;
      list.insertAdjacentElement("afterend", more);
      const button = more.querySelector("button");
      const extra = more.querySelector(".articles-extra");
      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        extra.hidden = !open;
        button.innerHTML = open ? 'Show fewer articles <span aria-hidden="true">−</span>' : 'More articles <span aria-hidden="true">＋</span>';
      });
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const articles = await loadArticles();
    buildHeader(articles);
    buildArticleListing(articles);
  });
})();