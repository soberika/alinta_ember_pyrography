// === Shared site scripts ===

// Footer year
const yr = document.getElementById('yr');
if (yr) yr.textContent = String(new Date().getFullYear());

// Ember particles
const layer = document.getElementById('embers');
if (layer) {
  const SIZES = ['s', 's', 'm', 'm', 'm', 'l', 'l', 'xl'] as const;
  const N = 26;
  for (let i = 0; i < N; i++) {
    const e = document.createElement('span');
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];
    e.className = `ember ${size}`;
    e.style.left = `${Math.random() * 100}%`;
    e.style.bottom = `${Math.random() * 30}%`;
    const dur = 5 + Math.random() * 6;
    e.style.animationDuration = `${dur}s`;
    e.style.animationDelay = `${-Math.random() * dur}s`;
    e.style.setProperty('--dx', `${Math.random() * 80 - 40}px`);
    layer.appendChild(e);
  }
}

// Mobile menu
const burger = document.getElementById('burger');
const menu   = document.getElementById('mobile-menu');
const icon   = document.getElementById('burger-icon');
if (burger && menu) {
  let open = false;
  function setOpen(v: boolean) {
    open = v;
    burger!.setAttribute('aria-expanded', String(v));
    if (v) {
      menu!.style.maxHeight = `${menu!.scrollHeight}px`;
      if (icon) icon.innerHTML = '<path d="M6 6l12 12M18 6L6 18"/>';
    } else {
      menu!.style.maxHeight = '0px';
      if (icon) icon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16"/>';
    }
  }
  burger.addEventListener('click', () => setOpen(!open));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) setOpen(false); });
}

// Dark mode toggle
(function () {
  function injectToggle() {
    const header = document.querySelector<HTMLElement>('header .max-w-6xl');
    if (!header || header.querySelector('.theme-toggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle ml-2 md:ml-4';
    btn.setAttribute('aria-label', 'Farbschema umschalten');
    btn.innerHTML =
      `<svg class="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>` +
      `<svg class="sun"  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
    const burgerEl = header.querySelector('#burger');
    if (burgerEl) header.insertBefore(btn, burgerEl);
    else header.appendChild(btn);
    btn.addEventListener('click', () => {
      const dark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('alita-theme', dark ? 'dark' : 'light'); } catch (_) {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectToggle);
  else injectToggle();
})();

// Language toggle (DE/EN)
(function () {
  const DICT: Record<string, string> = {
    "Home":"Home","Galerie":"Gallery","Shop":"Shop","Blog":"Blog","Über mich":"About",
    "Kontakt":"Contact","Menü öffnen":"Open menu","Farbschema umschalten":"Toggle color scheme",
    "Sprache umschalten":"Toggle language","Schließen":"Close",
    "Pyrography Kunst mit Feuer und Seele":"Pyrography art with fire and soul",
    "Zur Galerie":"To the Gallery","Shop entdecken":"Discover Shop",
    "Galerie · Auswahl":"Gallery · Selection","Featured Works":"Featured Works",
    "Vier ausgewählte Stücke — von glühendem Phönix bis zur Mechanik der Zeit. Die vollständige Sammlung wartet in der Galerie.":
      "Four selected pieces — from glowing phoenix to the mechanics of time. The full collection awaits in the gallery.",
    "Zur vollen Galerie":"View full gallery","Nach Kategorien filtern":"Filter by category",
    "Ansehen":"View","Über mich · Kurz":"About · Short",
    "Mit dem Brenneisen erzähle ich Geschichten.":"I tell stories with the burning iron.",
    "Ich bin Alita — Pyrographie-Künstlerin aus Leidenschaft. Jedes Stück entsteht in stundenlanger Handarbeit, Linie für Linie, Funke für Funke. Holz, Hitze, Atem.":
      "I'm Alita — pyrography artist by passion. Every piece is hours of handwork, line by line, spark by spark. Wood, heat, breath.",
    "Meine Geschichte":"My Story","Mein Prozess im Detail":"My process in detail",
    "Shop · Überblick":"Shop · Overview","Originale & limitierte Editionen":"Originals & Limited Editions",
    "Originale":"Originals","Editionen":"Editions","Auftrag":"Commission",
    "Einzelstücke, signiert.":"Unique pieces, signed.","Kleinserien, nummeriert.":"Small series, numbered.",
    "Dein Motiv, gebrannt.":"Your motif, burned.","Zum vollen Shop":"View full shop",
    "Auftragsarbeit anfragen":"Request a commission","Kontakt · Kurz":"Contact · Short",
    "Sag Hallo.":"Say hello.","Oder: erzähl mir deine Idee.":"Or tell me your idea.",
    "Zur Kontaktseite":"View contact page","Auftragsarbeit":"Commission",
    "Dein Name":"Your name","Deine E-Mail":"Your email",
    "Kurze Nachricht":"Short message","Nachricht senden":"Send message","Gesendet ✓":"Sent ✓",
    "Phönix":"Phoenix","Rose":"Rose","Nebelwald":"Misty Forest","Steampunk-Uhr":"Steampunk Clock",
    "Werk":"Work","In den Shop":"To the shop","Details öffnen":"Open details",
    "Alle Werke":"All Works","Alle":"All","Tiere & Mythos":"Animals & Myth","Natur":"Nature",
    "Steampunk":"Steampunk","Portrait":"Portrait",
    "verfügbar":"available","inkl. MwSt.":"incl. VAT","In den Warenkorb":"Add to cart",
    "Hinzugefügt ✓":"Added ✓","Details":"Details",
    "Hallo, ich bin Alita.":"Hi, I'm Alita.",
    "Werkstatt-Tagebuch":"Workshop Diary","Weiterlesen":"Read more",
    "Lesezeit":"read","Abonnieren":"Subscribe","Newsletter":"Newsletter",
  };
  const REV: Record<string, string> = {};
  for (const k in DICT) REV[DICT[k]] = k;

  function nodeWalk(root: Node, fn: (n: Text) => void) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        const p = (n as Text).parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n: Node | null;
    while ((n = w.nextNode())) fn(n as Text);
  }

  function apply(lang: 'de' | 'en') {
    const fwd = lang === 'en' ? DICT : REV;
    document.documentElement.lang = lang;
    nodeWalk(document.body, (t) => {
      const v = t.nodeValue ?? '';
      const trimmed = v.replace(/\s+/g, ' ').trim();
      if (fwd[trimmed] !== undefined) t.nodeValue = v.replace(trimmed, fwd[trimmed]);
    });
    const attrs = ['placeholder', 'aria-label', 'alt', 'title'] as const;
    document.querySelectorAll<HTMLElement>('[placeholder],[aria-label],[alt],[title]').forEach(el => {
      attrs.forEach(a => {
        const v = el.getAttribute(a);
        if (v && fwd[v.trim()]) el.setAttribute(a, fwd[v.trim()]);
      });
    });
    document.querySelectorAll<HTMLOptionElement>('option').forEach(o => {
      const v = o.textContent?.trim() ?? '';
      if (fwd[v]) o.textContent = fwd[v];
    });
  }

  function injectButton() {
    const header = document.querySelector<HTMLElement>('header .max-w-6xl');
    if (!header || header.querySelector('.lang-toggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle lang-toggle ml-2';
    btn.setAttribute('aria-label', 'Sprache umschalten');
    btn.style.cssText = 'width:auto;padding:0 .75rem;font-weight:700;font-size:13px;';
    const label = () => { btn.textContent = document.documentElement.lang === 'en' ? 'DE' : 'EN'; };
    label();
    const theme = header.querySelector('.theme-toggle');
    const burgerEl = header.querySelector('#burger');
    const anchor = theme || burgerEl;
    if (anchor) header.insertBefore(btn, anchor); else header.appendChild(btn);
    btn.addEventListener('click', () => {
      const cur = document.documentElement.lang === 'en' ? 'en' : 'de';
      const next = cur === 'en' ? 'de' : 'en';
      apply(next);
      try { localStorage.setItem('alita-lang', next); } catch (_) {}
      label();
    });
  }

  function init() {
    injectButton();
    let saved: string | null = null;
    try { saved = localStorage.getItem('alita-lang'); } catch (_) {}
    if (saved === 'en') {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        apply('en');
        const b = document.querySelector<HTMLElement>('.lang-toggle');
        if (b) b.textContent = 'DE';
      }));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
