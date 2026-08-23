/* =========================================================================
   multipage · shell.js   (vanilla, no build)

   The SHARED CHROME for every page: app bar, cross-page nav, footer and the
   detail <dialog>. It also owns global state (language + theme) and exposes a
   tiny toolkit on window.LDW that each page's app.js reuses.

   Loaded on EVERY page BEFORE app.js. It:
     1. reads the page's language from <html lang> and the theme from localStorage,
     2. injects app bar + nav + footer + dialog around <main id="page">,
     3. points the language link at this same page in the other language,
     4. highlights the current page (from <body data-page="...">),
     5. wires the theme toggle.

   Theme persists across pages via localStorage (an origin-wide store).
   Language does not persist: it belongs to the URL — Chinese at the root,
   English under /en/ — so every page shows the language its address promises,
   to visitors and to crawlers alike.
   ========================================================================= */
(function () {
  "use strict";

  var META = window.SITE_META || { title: {}, subtitle: {}, footer: {} };
  var PAGES = Array.isArray(window.SITE_PAGES) ? window.SITE_PAGES : [];

  /* ---------- chrome i18n (page content strings live in the data) ---------- */
  var I18N = {
    en: { close: "Close", menu: "Pages", skip: "Skip to content", star: "Star", starAria: "Star this project on GitHub" },
    zh: { close: "關閉", menu: "頁面", skip: "跳到內容", star: "給星", starAria: "在 GitHub 給這個專案星星" }
  };
  var REPO = META.repo || "";   // "owner/name" → drives the GitHub star button

  /* ---------- sandbox-safe localStorage ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---------- language: decided by the URL, never by localStorage ----------
     Each page declares its own language in <html lang>; the English twin of
     every page lives at the same filename under /en/. Reading a stored
     preference here would override what the address says — and would leave
     crawlers, which have no localStorage, permanently on the default. */
  var TWIN_DIR = "/en";
  var LANG_CODE = { zh: "zh-Hant", en: "en" };

  function pageLang() {
    var declared = (document.documentElement.getAttribute("lang") || "zh").toLowerCase();
    return declared.indexOf("zh") === 0 ? "zh" : "en";
  }
  function inTwinDir() {
    var p = location.pathname;
    return p === TWIN_DIR || p.indexOf(TWIN_DIR + "/") === 0;
  }
  /* this same page in the other language — derived from the path, so adding a
     page never means coming back here to add a link */
  function otherLangHref() {
    var p = location.pathname;
    return inTwinDir() ? (p.slice(TWIN_DIR.length) || "/") : TWIN_DIR + p;
  }
  /* the data layer writes asset paths relative to the site root (logos live at
     assets/logos/…). The English pages sit one level below it, so those paths
     need a hop up — otherwise every logo under /en/ is a 404. */
  function asset(path) {
    if (!path || path.charAt(0) === "/" || /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path)) return path;
    return inTwinDir() ? "../" + path : path;
  }

  /* ---------- global state ---------- */
  var state = {
    lang:  pageLang(),
    theme: lsGet("theme") || "light"
  };

  /* ---------- helpers shared with app.js ---------- */
  function t(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[state.lang] || obj.en || obj.zh || "";
  }
  function ui(key) { return (I18N[state.lang] || I18N.en)[key]; }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function r(n) { return Math.round(n * 100) / 100; }

  function pageHref(p) { return p.slug === "home" ? "index.html" : p.slug + ".html"; }
  function currentSlug() { return document.body.getAttribute("data-page") || "home"; }
  function currentPage() {
    var slug = currentSlug();
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].slug === slug) return PAGES[i];
    return PAGES[0] || null;
  }

  /* =======================================================================
     CHROME INJECTION — app bar, nav, footer, dialog around <main id="page">
     ===================================================================== */
  function injectChrome() {
    var main = document.getElementById("page");
    if (!main) return;

    /* skip link */
    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#page";
    skip.id = "skipLink";
    document.body.insertBefore(skip, document.body.firstChild);

    /* app bar */
    var appbar = document.createElement("header");
    appbar.className = "appbar";
    appbar.innerHTML =
      '<div class="appbar__inner">' +
        '<a class="brand" href="index.html">' +
          '<span class="material-symbols-rounded brand__logo">health_and_safety</span>' +
          '<span class="brand__name" id="brandName"></span>' +
        '</a>' +
        '<div class="appbar__actions">' +
          (REPO ?
            '<a class="gh-star" id="ghStar" href="https://github.com/' + REPO + '" ' +
              'target="_blank" rel="noopener noreferrer">' +
              '<svg class="gh-star__mark" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
                '<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 ' +
                '0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 ' +
                '1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 ' +
                '0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012-.27c.68 0 ' +
                '1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 ' +
                '3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 ' +
                '8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>' +
              '<span class="material-symbols-rounded gh-star__icon" aria-hidden="true">star</span>' +
              '<span class="gh-star__label" id="ghStarLabel"></span>' +
              '<span class="gh-star__count" id="ghStarCount" hidden></span>' +
            '</a>' : "") +
          '<a class="icon-btn" id="langToggle" href="' + otherLangHref() + '"' +
             ' rel="alternate" hreflang="' + LANG_CODE[state.lang === "zh" ? "en" : "zh"] + '"' +
             ' title="Language / 語言" aria-label="Switch language / 切換語言">' +
            '<span class="material-symbols-rounded">translate</span>' +
            '<span class="icon-btn__txt" id="langLabel"></span>' +
          '</a>' +
          '<button class="icon-btn" id="themeToggle" type="button" title="Theme" aria-label="Toggle theme / 切換主題">' +
            '<span class="material-symbols-rounded" id="themeIcon">dark_mode</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(appbar, main);

    /* cross-page nav */
    var nav = document.createElement("nav");
    nav.className = "pagenav";
    nav.id = "pageNav";
    nav.innerHTML = '<div class="pagenav__inner" id="pageNavInner"></div>';
    document.body.insertBefore(nav, main);

    /* footer */
    var footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = '<p id="footerText"></p>' +
      '<div class="profile-links" style="display:flex;gap:12px;justify-content:center;align-items:center;margin-top:10px">' +
        '<a class="icon-btn" href="https://www.peteraim.com" target="_blank" rel="noopener" title="Home" aria-label="Back to peteraim.com / 返回首頁">' +
          '<span class="material-symbols-rounded">home</span>' +
        '</a>' +
        '<a class="icon-btn" href="https://www.linkedin.com/in/ai-med/" target="_blank" rel="noopener" title="LinkedIn" aria-label="LinkedIn (opens in new tab)">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>' +
        '</a>' +
      '</div>';
    main.parentNode.insertBefore(footer, main.nextSibling);

    /* shared detail dialog (used by card layouts) */
    var dialog = document.createElement("dialog");
    dialog.className = "dialog";
    dialog.id = "dialog";
    dialog.setAttribute("aria-labelledby", "dialogTitle");
    dialog.innerHTML =
      '<div class="dialog__bar">' +
        '<span class="dialog__spacer"></span>' +
        '<button class="icon-btn" id="dialogClose" type="button" aria-label="Close / 關閉">' +
          '<span class="material-symbols-rounded">close</span>' +
        '</button>' +
      '</div>' +
      '<div class="dialog__body" id="dialogBody"></div>';
    document.body.appendChild(dialog);

    /* dialog wiring (shared close behaviour; deep links handled by app.js) */
    document.getElementById("dialogClose").addEventListener("click", function () {
      if (dialog.open) dialog.close();
    });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  }

  function paintNav() {
    var inner = document.getElementById("pageNavInner");
    if (!inner) return;
    inner.innerHTML = "";
    var here = currentSlug();
    PAGES.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "navpill" + (p.slug === here ? " navpill--active" : "");
      a.href = pageHref(p);
      if (p.slug === here) a.setAttribute("aria-current", "page");
      a.innerHTML =
        '<span class="material-symbols-rounded" aria-hidden="true">' +
          escapeHtml(p.icon || "label") + "</span>" +
        "<span>" + escapeHtml(t(p.title)) + "</span>";
      inner.appendChild(a);
    });
    /* keep the active pill in view within the scrolling nav */
    var active = inner.querySelector(".navpill--active");
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }

  /* ---------- chrome text in the page's language ---------- */
  function refreshChrome() {
    var page = currentPage();
    var siteTitle = t(META.title);
    var pageTitle = page ? t(page.title) : "";
    /* the home page is titled after the site, so appending the site name again
       would just say the same thing twice */
    document.title = (pageTitle && pageTitle !== siteTitle)
      ? pageTitle + " · " + siteTitle
      : siteTitle;

    var brand = document.getElementById("brandName");
    if (brand) brand.textContent = siteTitle;
    var foot = document.getElementById("footerText");
    if (foot) foot.textContent = "© " + new Date().getFullYear() + " " + siteTitle;
    var skip = document.getElementById("skipLink");
    if (skip) skip.textContent = ui("skip");
    var nav = document.getElementById("pageNav");
    if (nav) nav.setAttribute("aria-label", ui("menu"));
    var dc = document.getElementById("dialogClose");
    if (dc) dc.setAttribute("aria-label", ui("close"));
    var starLabel = document.getElementById("ghStarLabel");
    if (starLabel) starLabel.textContent = ui("star");
    var star = document.getElementById("ghStar");
    if (star) { star.setAttribute("aria-label", ui("starAria")); star.setAttribute("title", ui("starAria")); }
    paintNav();
  }

  /* ---------- GitHub star count (public API, no auth, silent on failure) ---------- */
  function loadStarCount() {
    if (!REPO || typeof fetch !== "function") return;
    var countEl = document.getElementById("ghStarCount");
    if (!countEl) return;
    fetch("https://api.github.com/repos/" + REPO, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || typeof j.stargazers_count !== "number") return;
        var n = j.stargazers_count;
        countEl.textContent = n >= 1000 ? (Math.round(n / 100) / 10) + "k" : String(n);
        countEl.hidden = false;
      })
      .catch(function () { /* offline / rate-limited: leave the button without a count */ });
  }

  /* =======================================================================
     THEME + LANGUAGE
     ===================================================================== */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    var icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
    lsSet("theme", state.theme);
  }
  /* the language control is a link, so its label names where it goes rather
     than where you already are */
  function applyLangChrome() {
    var label = document.getElementById("langLabel");
    if (!label) return;
    var other = state.lang === "zh" ? "en" : "zh";
    label.textContent = other === "zh" ? "中" : "EN";
    label.setAttribute("lang", LANG_CODE[other]);
  }

  function wire() {
    document.getElementById("themeToggle").addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
    });
  }

  /* =======================================================================
     PUBLIC TOOLKIT (app.js uses this)
     ===================================================================== */
  window.LDW = {
    ready: false,          // flipped true once the chrome (incl. #dialog) is injected
    state: state,
    t: t, ui: ui, escapeHtml: escapeHtml, r: r,
    asset: asset,
    lsGet: lsGet, lsSet: lsSet,
    pages: PAGES, meta: META,
    currentPage: currentPage, currentSlug: currentSlug, pageHref: pageHref,
    refreshChrome: refreshChrome,
    dialog: function () { return document.getElementById("dialog"); }
  };

  /* =======================================================================
     INIT
     ===================================================================== */
  function init() {
    injectChrome();
    applyTheme();
    applyLangChrome();
    refreshChrome();
    wire();
    loadStarCount();
    window.LDW.ready = true;
    document.dispatchEvent(new CustomEvent("ldw:shell-ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
