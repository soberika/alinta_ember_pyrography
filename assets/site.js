// === Alita Ember — shared scripts ===
(function(){
  // year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // ember particles (only if there is a #embers layer on the page)
  var layer = document.getElementById('embers');
  if (layer){
    var SIZES = ['s','s','m','m','m','l','l','xl'];
    var N = 26;
    for (var i = 0; i < N; i++){
      var e = document.createElement('span');
      var size = SIZES[Math.floor(Math.random()*SIZES.length)];
      e.className = 'ember ' + size;
      e.style.left   = (Math.random()*100) + '%';
      e.style.bottom = (Math.random()*30)  + '%';
      var dur = 5 + Math.random()*6;
      e.style.animationDuration = dur + 's';
      e.style.animationDelay = (-Math.random()*dur) + 's';
      e.style.setProperty('--dx', (Math.random()*80 - 40) + 'px');
      layer.appendChild(e);
    }
  }

  // mobile menu
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('mobile-menu');
  var icon   = document.getElementById('burger-icon');
  if (burger && menu){
    var open = false;
    function setOpen(v){
      open = v;
      burger.setAttribute('aria-expanded', String(v));
      if (v){
        menu.style.maxHeight = menu.scrollHeight + 'px';
        if (icon) icon.innerHTML = '<path d="M6 6l12 12M18 6L6 18"/>';
      } else {
        menu.style.maxHeight = '0px';
        if (icon) icon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16"/>';
      }
    }
    burger.addEventListener('click', function(){ setOpen(!open); });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setOpen(false); });
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth >= 768) setOpen(false);
    });
  }
})();


// === Dark mode toggle (injected into header) ===
(function(){
  function injectToggle(){
    var header = document.querySelector('header .max-w-6xl');
    if (!header) return;
    if (header.querySelector('.theme-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle ml-2 md:ml-4';
    btn.setAttribute('aria-label','Farbschema umschalten');
    btn.innerHTML = ''
      + '<svg class="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
      + '<svg class="sun"  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    // insert before burger if present, else append
    var burger = header.querySelector('#burger');
    if (burger) header.insertBefore(btn, burger);
    else header.appendChild(btn);

    btn.addEventListener('click', function(){
      var dark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('alita-theme', dark ? 'dark' : 'light'); } catch(e){}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectToggle);
  else injectToggle();
})();


// === Language toggle (DE / EN) ===
(function(){
  // Dictionary: German text -> English. Keys are matched against trimmed textContent
  // of leaf text nodes, and against placeholder / aria-label / alt / title attributes.
  var DICT = {
    // nav / footer / chrome
    "Home":"Home", "Galerie":"Gallery", "Shop":"Shop", "Blog":"Blog", "Über mich":"About",
    "Kontakt":"Contact", "Menü öffnen":"Open menu", "Menü":"Menu",
    "Farbschema umschalten":"Toggle color scheme", "Sprache umschalten":"Toggle language",
    "Schließen":"Close", "Startseite":"Home page", "Alita Ember — Startseite":"Alita Ember — Home page",
    // hero
    "Pyrography Kunst mit Feuer\u00a0und\u00a0Seele":"Pyrography art with fire and soul",
    "Pyrography Kunst mit Feuer und Seele":"Pyrography art with fire and soul",
    "Zur Galerie":"To the Gallery", "Shop entdecken":"Discover Shop",
    "Alita Ember — Pyrography Künstlerin mit feurigen Goggles und brennendem Brenneisen":
      "Alita Ember — pyrography artist with fiery goggles and a burning iron",
    // featured works
    "Galerie · Auswahl":"Gallery · Selection", "Featured Works":"Featured Works",
    "Vier ausgewählte Stücke — von glühendem Phönix bis zur Mechanik der Zeit. Die vollständige Sammlung wartet in der Galerie.":
      "Four selected pieces — from glowing phoenix to the mechanics of time. The full collection awaits in the gallery.",
    "Zur vollen Galerie":"View full gallery",
    "Nach Kategorien filtern":"Filter by category",
    "Ansehen":"View",
    // about overview
    "Über mich · Kurz":"About · Short", "Über mich · Mehr":"About · More",
    "Mit dem Brenneisen erzähle ich Geschichten.":"I tell stories with the burning iron.",
    "Ich bin Alita — Pyrographie-Künstlerin aus Leidenschaft. Jedes Stück entsteht in stundenlanger Handarbeit, Linie für Linie, Funke für Funke. Holz, Hitze, Atem.":
      "I'm Alita — pyrography artist by passion. Every piece is hours of handwork, line by line, spark by spark. Wood, heat, breath.",
    "Meine Geschichte":"My Story",
    "Mein Prozess im Detail":"My process in detail",
    // shop overview
    "Shop · Überblick":"Shop · Overview",
    "Originale & limitierte Editionen":"Originals & Limited Editions",
    "Jedes Werk ist ein Unikat — signiert, datiert, in liebevoller Verpackung versendet. Im Shop findest du Preise, Versandinfos und verfügbare Stücke.":
      "Every work is unique — signed, dated, shipped in loving packaging. The shop has prices, shipping info and available pieces.",
    "Originale":"Originals", "Editionen":"Editions", "Auftrag":"Commission",
    "Einzelstücke, signiert.":"Unique pieces, signed.",
    "Kleinserien, nummeriert.":"Small series, numbered.",
    "Dein Motiv, gebrannt.":"Your motif, burned.",
    "Zum vollen Shop":"View full shop",
    "Auftragsarbeit anfragen":"Request a commission",
    // contact overview
    "Kontakt · Kurz":"Contact · Short",
    "Sag Hallo. Oder: erzähl mir deine Idee.":"Say hello. Or tell me your idea.",
    "Sag Hallo.":"Say hello.",
    "Oder: erzähl mir deine Idee.":"Or tell me your idea.",
    "Für ausführliche Anfragen, Auftragsarbeiten und Presse findest du alle Details auf der Kontaktseite.":
      "For detailed requests, commissions and press, find all the details on the contact page.",
    "Zur Kontaktseite":"View contact page",
    "Auftragsarbeit":"Commission",
    "Dein Name":"Your name", "Deine E-Mail":"Your email",
    "Kurze Nachricht":"Short message", "Deine Nachricht":"Your message",
    "Nachricht senden":"Send message", "Gesendet ✓":"Sent ✓",
    "Danke — ich melde mich!":"Thanks — I'll be in touch!",
    // footer
    "Pyrography":"Pyrography",
    // work titles
    "Phönix":"Phoenix", "Rose":"Rose", "Nebelwald":"Misty Forest", "Steampunk-Uhr":"Steampunk Clock",
    "Phönix II — Studie":"Phoenix II — Study", "Rose Noir":"Rose Noir",
    "Nebelwald · Dämmerung":"Misty Forest · Dusk", "Zahnräder":"Cogs",
    "Selbstporträt · Alita":"Self-portrait · Alita",
    // modal labels
    "Werk":"Work", "In den Shop":"To the shop", "Details öffnen":"Open details",
    // gallery page
    "Alle Werke":"All Works",
    "Eine Sammlung gebrannter Stücke aus den letzten Jahren — sortiert nach Kategorie. Klicke ein Werk an, um Details zu sehen.":
      "A collection of burned pieces from recent years — sorted by category. Click a work for details.",
    "Alle":"All", "Tiere & Mythos":"Animals & Myth", "Natur":"Nature",
    "Steampunk":"Steampunk", "Portrait":"Portrait",
    "Keine Werke in dieser Kategorie. Schau bald wieder vorbei — die Werkstatt brennt täglich.":
      "No works in this category. Check back soon — the workshop burns daily.",
    "Ein Werk soll dir gehören?":"Want a piece for yourself?",
    "Originale & Editionen findest du im Shop. Für eigene Motive: Auftragsarbeit.":
      "Originals & editions are in the shop. For your own motif: commission.",
    "Zum Shop":"To the shop", "Auftrag anfragen":"Request commission",
    // shop page
    "Originale\n& Editionen":"Originals\n& Editions",
    "Jedes Werk handgebrannt, signiert und in liebevoller Verpackung versendet. Versand innerhalb 5–7 Werktagen aus Deutschland.":
      "Every work hand-burned, signed and shipped in loving packaging. Dispatch within 5–7 working days from Germany.",
    "Verfügbar":"Available", "Aktuelle Stücke":"Current pieces",
    "Sortierung:":"Sort:",
    "Empfohlen":"Featured", "Preis aufsteigend":"Price ascending",
    "Preis absteigend":"Price descending", "Neueste zuerst":"Newest first",
    "verfügbar":"available", "inkl. MwSt.":"incl. VAT",
    "In den Warenkorb":"Add to cart", "Hinzugefügt ✓":"Added ✓", "Details":"Details",
    "Dein Motiv. In Holz gebrannt.":"Your motif. Burned in wood.",
    "Erzähl mir, was du dir vorstellst — Tier, Portrait, Hochzeitsbild, Erinnerungsstück. Ich melde mich mit Skizze und Angebot innerhalb von 3 Werktagen.":
      "Tell me what you have in mind — animal, portrait, wedding piece, keepsake. I'll reply with a sketch and quote within 3 working days.",
    "Anfrage starten":"Start a request",
    "Lieferzeit":"Lead time", "4–8 Wochen":"4–8 weeks",
    "Ab":"From", "Größen":"Sizes", "Versand":"Shipping", "Weltweit":"Worldwide",
    "Versand & Verpackung":"Shipping & Packaging",
    "DHL versichert, plastikfrei verpackt in handbeschriftetem Karton. Versand innerhalb von 5–7 Werktagen nach Bestellung.":
      "DHL insured, plastic-free packaging in hand-labeled box. Dispatch within 5–7 working days.",
    "Zahlung":"Payment",
    "PayPal, Klarna, Überweisung. Alle Preise inkl. MwSt. — Kleinunternehmerregelung §19 UStG.":
      "PayPal, Klarna, bank transfer. All prices incl. VAT — small business rule §19 UStG.",
    "Rückgabe":"Returns",
    "14 Tage Rückgaberecht für Lagerstücke. Auftragsarbeiten sind vom Widerruf ausgenommen.":
      "14-day return policy for in-stock pieces. Commissions are excluded from withdrawal.",
    // about page
    "Hallo, ich bin Alita.":"Hi, I'm Alita.",
    "Pyrographie-Künstlerin aus Süddeutschland. Ich brenne Geschichten in Holz — von feurigen Phönixen bis zu schweigenden Uhrwerken.":
      "Pyrography artist from southern Germany. I burn stories into wood — from fiery phoenixes to silent clockworks.",
    "Vom ersten Funken bis zum letzten Strich.":"From first spark to final stroke.",
    "Prozess":"Process", "So entsteht ein Werk.":"How a piece is made.",
    "Vier Phasen, viele Stunden — jedes Stück durchläuft sie in dieser Reihenfolge.":
      "Four phases, many hours — every piece goes through them in this order.",
    "Skizze":"Sketch", "Holzauswahl":"Wood selection", "Brennen":"Burning", "Finish":"Finish",
    "Konzept, Komposition, Lichtführung. Vorzeichnung in mehreren Iterationen.":
      "Concept, composition, lighting. Pre-drawing in several iterations.",
    "Birke, Eiche, Linde — Maserung muss zum Motiv passen. Geschliffen, geölt, bereit.":
      "Birch, oak, lime — grain must fit the motif. Sanded, oiled, ready.",
    "Konturen zuerst, dann Schicht für Schicht Tiefe. 15–80 Stunden je nach Größe.":
      "Contours first, then layer by layer depth. 15–80 hours depending on size.",
    "Akzent-Lasur, Versiegelung mit Naturöl, Signatur. Versand-bereit verpackt.":
      "Accent glaze, sealing with natural oil, signature. Packaged ready to ship.",
    "Material":"Material", "Werkzeug":"Tools",
    "Holz aus regionaler Forstwirtschaft":"Wood from regional forestry",
    "Birke für Feinheit, Eiche für Tiefe, Linde für weiche Übergänge. Jedes Stück Holz wird vor Bearbeitung mindestens 12 Monate gelagert.":
      "Birch for finesse, oak for depth, lime for soft transitions. Every piece is aged at least 12 months.",
    "Brennkolben mit auswechselbarer Spitze":"Burning iron with interchangeable tip",
    "14 Spitzen, von Haarlinie bis Schraffur. Temperaturen zwischen 380 °C und 750 °C — jede Holzart braucht ihre eigene Hitze.":
      "14 tips, from hairline to hatching. Temperatures from 380°C to 750°C — each wood needs its own heat.",
    "Bisher":"So far", "Stationen":"Milestones",
    "Erste Ausstellung":"First exhibition", "Kleine Galerie · Freiburg":"Small gallery · Freiburg",
    "Werkstatteröffnung":"Workshop opening", "Eigene Werkstatt am Waldrand":"Own workshop at the forest edge",
    "Steampunk-Reihe":"Steampunk series", "Erste Serien-Edition · 24 Stücke":"First series edition · 24 pieces",
    "Selbstporträt-Serie":"Self-portrait series", "Laufend · individuelle Aufträge willkommen":"Ongoing · individual commissions welcome",
    "Sehen wir uns in der Werkstatt?":"See you in the workshop?",
    "Auftragsarbeiten, Studio-Besuche und Presseanfragen sind herzlich willkommen.":
      "Commissions, studio visits and press inquiries are warmly welcome.",
    "Kontakt aufnehmen":"Get in touch", "Werke ansehen":"View works",
    // contact page
    "Auftragsarbeit, Atelier-Besuch oder Presseanfrage — ich antworte innerhalb von 2 Werktagen.":
      "Commission, studio visit or press request — I reply within 2 working days.",
    "E-Mail":"Email", "Werkstatt":"Workshop", "Social":"Social",
    "Besuche nur nach Terminvereinbarung.":"Visits by appointment only.",
    "Antwortzeit":"Response time", "~ 2 Werktage":"~ 2 working days",
    "Mo–Fr · Werkstattzeiten in der Brennphase begrenzt.":"Mon–Fri · workshop hours limited during burn phases.",
    "Nachricht senden":"Send message", "Worum geht's?":"What's it about?",
    "Anliegen":"Subject", "Shop-Frage":"Shop question",
    "Atelier-Besuch":"Studio visit", "Presse":"Press", "Sonstiges":"Other",
    "Budget (optional)":"Budget (optional)", "Noch unklar":"Not sure yet",
    "unter 250 €":"under €250", "250–500 €":"€250–500",
    "500–1.000 €":"€500–1,000", "über 1.000 €":"over €1,000",
    "Erzähl mir kurz von deiner Idee, Größe, gewünschtem Lieferzeitpunkt …":
      "Tell me briefly about your idea, size, desired delivery date …",
    "Ich habe die":"I have read the",
    "Datenschutzhinweise":"privacy notice",
    "gelesen und stimme zu.":"and agree.",
    "FAQ":"FAQ", "Häufige Fragen":"Frequent questions",
    "Wie lange dauert eine Auftragsarbeit?":"How long does a commission take?",
    "Je nach Größe und Komplexität 4–8 Wochen ab Skizzenfreigabe. Bei Lagerstücken sofortiger Versand.":
      "Depending on size and complexity, 4–8 weeks from sketch approval. In-stock pieces ship immediately.",
    "Liefert ihr international?":"Do you ship internationally?",
    "Ja, weltweit per DHL versichert. Versandkosten werden im Checkout berechnet.":
      "Yes, worldwide via DHL insured. Shipping is calculated at checkout.",
    "Kann ich die Werkstatt besuchen?":"Can I visit the workshop?",
    "Sehr gerne — nach Terminvereinbarung. Schreib mir kurz und wir finden einen Slot.":
      "Absolutely — by appointment. Drop me a line and we'll find a slot.",
    // blog page
    "Werkstatt-Tagebuch":"Workshop Diary",
    "Skizzen, Techniken, Werkstatt-Notizen und News aus dem Atelier — frisch aus dem Rauch.":
      "Sketches, techniques, workshop notes and news from the studio — fresh from the smoke.",
    "Neu":"New", "Steampunk-Edition · Vorbestellung offen":"Steampunk Edition · Pre-order open",
    "Featured":"Featured", "Weiterlesen":"Read more", "Werk in der Galerie":"Work in gallery",
    "Im Beitrag":"In this post", "Lichtführung im Nebel":"Light in the mist",
    "Hitze-Kalibrierung":"Heat calibration", "Funken-Akzente in Glut":"Spark accents in embers",
    "Versiegelung & Geduld":"Sealing & patience",
    "Alle Beiträge":"All posts", "Geschichten aus der Werkstatt":"Stories from the workshop",
    "Technik":"Technique", "News":"News", "Werkstatt":"Workshop", "Prozess":"Process",
    "Keine Beiträge in dieser Kategorie. Schau bald wieder vorbei.":
      "No posts in this category. Check back soon.",
    "Mehr laden":"Load more",
    "Newsletter":"Newsletter", "Funken im Posteingang.":"Sparks in your inbox.",
    "Ein Brief pro Monat: neue Werke, Werkstatt-Einblicke, Auftragstermine. Kein Spam, jederzeit abbestellbar.":
      "One letter per month: new works, workshop insights, commission openings. No spam, unsubscribe anytime.",
    "Abonnieren":"Subscribe", "Abonniert ✓":"Subscribed ✓",
    "Mit dem Abonnieren stimmst du der Verarbeitung deiner E-Mail zum Versand des Newsletters zu.":
      "By subscribing you agree to your email being used to send the newsletter.",
    "Lesezeit":"read",
    "Welche Holzarten verwendest du?":"Which woods do you use?",
    "Hauptsächlich Birke, Eiche und Linde aus regionaler Forstwirtschaft. Auf Wunsch auch andere Hölzer.":
      "Mainly birch, oak and lime from regional forestry. Other woods on request.",
    "Wie pflege ich ein Werk?":"How do I care for a piece?",
    "Trocken halten, nicht in direktes Sonnenlicht. Bei Bedarf 1× jährlich mit Naturöl nachpflegen — Öl liegt jedem Stück bei.":
      "Keep dry, out of direct sunlight. Re-oil once a year with natural oil if needed — oil is included with every piece."
  };
  // Build EN -> DE reverse so we can toggle back
  var REV = {};
  for (var k in DICT) REV[DICT[k]] = k;

  function nodeWalk(root, fn){
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n){
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while ((n = w.nextNode())) fn(n);
  }
  function apply(lang){
    var fwd = (lang === 'en') ? DICT : REV;
    document.documentElement.lang = (lang === 'en') ? 'en' : 'de';
    nodeWalk(document.body, function(t){
      var v = t.nodeValue;
      var trimmed = v.replace(/\s+/g,' ').trim();
      if (fwd.hasOwnProperty(trimmed)){
        t.nodeValue = v.replace(trimmed, fwd[trimmed]);
      }
    });
    // attributes
    var attrs = ['placeholder','aria-label','alt','title'];
    document.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(function(el){
      attrs.forEach(function(a){
        var v = el.getAttribute(a); if (!v) return;
        var trimmed = v.trim();
        if (fwd.hasOwnProperty(trimmed)) el.setAttribute(a, fwd[trimmed]);
      });
    });
    // <option> values
    document.querySelectorAll('option').forEach(function(o){
      var v = o.textContent.trim();
      if (fwd.hasOwnProperty(v)) o.textContent = fwd[v];
    });
  }

  function injectButton(){
    var header = document.querySelector('header .max-w-6xl'); if (!header) return;
    if (header.querySelector('.lang-toggle')) return;
    var btn = document.createElement('button');
    btn.type='button';
    btn.className='theme-toggle lang-toggle ml-2';
    btn.setAttribute('aria-label','Sprache umschalten');
    btn.style.width='auto'; btn.style.padding='0 .75rem'; btn.style.fontWeight='700'; btn.style.fontSize='13px';
    function label(){
      btn.textContent = (document.documentElement.lang === 'en') ? 'DE' : 'EN';
    }
    label();
    // insert before theme toggle if present
    var theme = header.querySelector('.theme-toggle');
    var burger = header.querySelector('#burger');
    var anchor = theme || burger;
    if (anchor) header.insertBefore(btn, anchor); else header.appendChild(btn);

    btn.addEventListener('click', function(){
      var cur = (document.documentElement.lang === 'en') ? 'en' : 'de';
      var next = (cur === 'en') ? 'de' : 'en';
      apply(next);
      try { localStorage.setItem('alita-lang', next); } catch(e){}
      label();
    });
  }

  function init(){
    injectButton();
    var saved;
    try { saved = localStorage.getItem('alita-lang'); } catch(e){}
    if (saved === 'en'){
      // wait one frame so any inline render scripts (work cards etc.) finish
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ apply('en'); var b=document.querySelector('.lang-toggle'); if (b) b.textContent='DE'; }); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
