/**
 * Zweisprachigkeit DE (Standard, unter `/`) / EN (unter `/en/`).
 *
 * Bausteine:
 *  - `langFromUrl`   — Sprache aus der gerade gerenderten Route ableiten.
 *                      Die EN-Seiten unter src/pages/en/ sind dünne Wrapper,
 *                      die die DE-Seite als Komponente rendern; die Seite
 *                      selbst erkennt ihre Sprache über die URL.
 *  - `PATHS`         — lokalisierte Routen (EN nutzt englische Slugs).
 *  - `altPath`       — dieselbe Seite in der jeweils anderen Sprache
 *                      (Sprachumschalter im Header + hreflang in Base).
 *  - `UI`            — alle fest im Markup stehenden Oberflächentexte.
 *                      `en` ist über `typeof de` erzwungen deckungsgleich.
 *  - `pick`          — Inhaltsfeld wählen: EN-Feld, sonst DE-Fallback.
 *  - `localizedSingleton` — Singleton-Dokument je Sprache: EN-Variante ist
 *                      eine zweite Datei `<name>-en.json` in derselben
 *                      Collection (z. B. home.json + home-en.json).
 */

export type Lang = 'de' | 'en';

export function langFromUrl(url: URL): Lang {
  const p = url.pathname;
  return p === '/en' || p.startsWith('/en/') ? 'en' : 'de';
}

export const PATHS: Record<Lang, Record<'home' | 'galerie' | 'shop' | 'blog' | 'ueber' | 'kontakt' | 'impressum' | 'datenschutz', string>> = {
  de: { home: '/', galerie: '/galerie', shop: '/shop', blog: '/blog', ueber: '/ueber', kontakt: '/kontakt', impressum: '/impressum', datenschutz: '/datenschutz' },
  en: { home: '/en/', galerie: '/en/gallery', shop: '/en/shop', blog: '/en/blog', ueber: '/en/about', kontakt: '/en/contact', impressum: '/en/imprint', datenschutz: '/en/privacy' },
};

/**
 * Pfad derselben Seite in der anderen Sprache (Blog-Slugs sind identisch).
 * Gibt immer die Trailing-Slash-Form zurück — konsistent mit
 * `build.format: 'directory'` (wichtig für hreflang/canonical).
 */
export function altPath(pathname: string): string {
  const withSlash = (r: string) => (r.endsWith('/') ? r : r + '/');
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/en' || p.startsWith('/en/')) {
    const rest = p === '/en' ? '/' : p.slice('/en'.length);
    const rev: Record<string, string> = { '/': '/', '/gallery': '/galerie', '/about': '/ueber', '/contact': '/kontakt', '/imprint': '/impressum', '/privacy': '/datenschutz' };
    return withSlash(rev[rest] ?? rest);
  }
  const fwd: Record<string, string> = { '/': '/en/', '/galerie': '/en/gallery', '/ueber': '/en/about', '/kontakt': '/en/contact', '/impressum': '/en/imprint', '/datenschutz': '/en/privacy' };
  return withSlash(fwd[p] ?? '/en' + p);
}

/** EN-Inhaltsfeld bevorzugen, sonst deutscher Fallback. */
export function pick(lang: Lang, de?: string | null, en?: string | null): string {
  return (lang === 'en' && en) ? en : (de ?? '');
}

/** Singleton-Collections: home.json (DE) + home-en.json (EN) usw. */
export function localizedSingleton<T extends { id: string }>(entries: T[], lang: Lang): T {
  const en = entries.find((e) => e.id.endsWith('-en'));
  const de = entries.find((e) => !e.id.endsWith('-en'));
  return (lang === 'en' ? en ?? de : de) ?? entries[0];
}

export function dateLocale(lang: Lang): string {
  return lang === 'en' ? 'en-GB' : 'de-DE';
}

/** Blog-Kategorie-Labels je Sprache. */
export const POST_CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  de: { prozess: 'Prozess', technik: 'Technik', news: 'News', werkstatt: 'Werkstatt' },
  en: { prozess: 'Process', technik: 'Technique', news: 'News', werkstatt: 'Workshop' },
};

// ── Oberflächentexte ──────────────────────────────────────────────────────

const de = {
  nav: { home: 'Home', galerie: 'Galerie', shop: 'Shop', blog: 'Blog', ueber: 'Über mich', kontakt: 'Kontakt' },
  header: { menu: 'Menü', startseite: 'Startseite', switchLang: 'Read this page in English', switchLabel: 'EN' },

  meta: {
    homeTitle: 'Alinta Ember — Brandmalerei & Pyrografie-Kunst',
    homeDesc: 'Handgebrannte Brandmalerei-Unikate auf Holz und Kork — Galerie, Werkstatt-Blog und Auftragsarbeiten nach deinem Motiv. Verkauf über Etsy.',
    galerieTitle: 'Galerie — Alinta Ember',
    galerieDesc: 'Alle Brandmalerei-Werke von Alinta Ember: handgebrannte Motive auf Holz und Kork — von Anime-Portraits bis Naturmotiven, filterbar nach Art des Stücks.',
    shopTitle: 'Shop — Alinta Ember',
    shopDesc: 'Originale und Editionen von Alinta Ember — handgebrannte Brandmalerei-Unikate. Verkauf über Etsy, Auftragsarbeiten auf Anfrage.',
    blogTitle: 'Blog — Alinta Ember',
    blogDesc: 'Werkstatt-Tagebuch rund um Brandmalerei: Technik, Prozess-Einblicke und neue Werke — frisch aus dem Rauch.',
    ueberTitle: 'Über mich — Alinta Ember',
    ueberDesc: 'Wer hinter Alinta Ember steckt: mein Weg zur Pyrografie, mein Prozess vom Motiv bis zur Versiegelung — und warum kein Stück Holz dem anderen gleicht.',
    kontaktTitle: 'Kontakt — Alinta Ember',
    kontaktDesc: 'Auftragsarbeit anfragen oder einfach Hallo sagen — Brandmalerei nach deinem Motiv. Kontaktformular, FAQ und Antwort innerhalb von 2 Werktagen.',
    impressumTitle: 'Impressum — Alinta Ember',
    impressumDesc: 'Impressum und Anbieterkennzeichnung gemäß § 5 DDG für alinta-ember.com.',
    datenschutzTitle: 'Datenschutzerklärung — Alinta Ember',
    datenschutzDesc: 'Informationen zur Verarbeitung personenbezogener Daten auf alinta-ember.com nach DSGVO.',
  },

  home: {
    heroAlt: 'Alinta Ember — Pyrography-Künstler mit feurigen Goggles und brennendem Brenneisen',
    fullGallery: 'Zur vollen Galerie',
    filterByCategory: 'Nach Kategorien filtern',
    myStory: 'Meine Geschichte',
    myProcess: 'Mein Prozess im Detail',
    fullShop: 'Zum vollen Shop',
    requestCommission: 'Auftragsarbeit anfragen',
    toContactPage: 'Zur Kontaktseite',
    commission: 'Auftragsarbeit',
    formName: 'Dein Name',
    formEmail: 'Deine E-Mail',
    formMessage: 'Kurze Nachricht',
    formSend: 'Nachricht senden',
    formThanks: 'Danke — ich melde mich!',
    formSubject: 'Kurznachricht über alinta-ember.com (Startseite)',
  },

  gallery: {
    eyebrow: 'Galerie',
    title: 'Alle Werke',
    intro: 'Eine Sammlung gebrannter Stücke aus den letzten Jahren — die neuesten zuerst, filterbar nach Art des Stücks. Klicke ein Werk an, um Details zu sehen.',
    all: 'Alle',
    tags: 'Tags',
    empty: 'Keine Werke in dieser Auswahl. Schau bald wieder vorbei — die Werkstatt brennt täglich.',
    ctaHeading: 'Ein Werk soll dir gehören?',
    ctaText: 'Originale & Editionen findest du im Shop. Für eigene Motive: Auftragsarbeit.',
    toShop: 'Zum Shop',
    requestCommission: 'Auftrag anfragen',
  },

  modal: {
    work: 'Werk',
    view: 'Ansehen',
    openDetails: 'Details öffnen',
    year: 'Jahr',
    dims: 'Maße',
    requestEdition: 'Neuauflage anfragen',
    buyOnEtsy: 'Auf Etsy kaufen ↗',
    close: 'Schließen',
    tagLinkTitle: 'Alle Werke mit #{tag} in der Galerie',
    tagFilterTitle: 'Nur Werke mit #{tag} zeigen',
  },

  shop: {
    eyebrow: 'Shop',
    titleHtml: 'Originale<br/>& Editionen',
    intro: 'Jedes Werk handgebrannt, signiert und in liebevoller Verpackung versendet. Der Verkauf läuft über meinen Etsy-Shop.',
    available: 'Verfügbar',
    currentPieces: 'Aktuelle Stücke',
    sort: 'Sortierung:',
    sortFeatured: 'Empfohlen',
    sortPriceAsc: 'Preis aufsteigend',
    sortPriceDesc: 'Preis absteigend',
    sortNew: 'Neueste zuerst',
    inclVat: 'inkl. MwSt.',
    buyOnEtsy: 'Auf Etsy kaufen ↗',
    teaserEyebrow: 'Etsy',
    teaserHeading: 'Der Shop zieht gerade ein.',
    teaserText: 'Die ersten verkaufsfertigen Stücke landen nach und nach in meinem Etsy-Shop. Schau gern vorbei — oder frag direkt eine Auftragsarbeit mit deinem Wunschmotiv an.',
    toEtsy: 'Zum Etsy-Shop ↗',
    requestCommission: 'Auftrag anfragen',
    commissionEyebrow: 'Auftragsarbeit',
    commissionHeading: 'Dein Motiv. In Holz gebrannt.',
    commissionText: 'Erzähl mir, was du dir vorstellst — Tier, Portrait, Hochzeitsbild, Erinnerungsstück. Ich melde mich mit Skizze und Angebot innerhalb von 3 Werktagen.',
    startRequest: 'Anfrage starten',
    leadTime: 'Lieferzeit',
    leadTimeValue: '4–8 Wochen',
    from: 'Ab',
    sizes: 'Größen',
    shipping: 'Versand',
    worldwide: 'Weltweit',
    cardShippingTitle: 'Versand & Verpackung',
    cardShippingText: 'DHL versichert, plastikfrei verpackt in handbeschriftetem Karton. Versand innerhalb von 5–7 Werktagen nach Bestellung.',
    cardEtsyTitle: 'Kauf über Etsy',
    cardEtsyText: 'Bezahlung und Käuferschutz laufen über Etsy. Preise inkl. MwSt. — Kleinunternehmerregelung §19 UStG.',
    cardCommissionTitle: 'Auftragsarbeiten',
    cardCommissionText: 'Eigenes Motiv gewünscht? Anfrage über das Kontaktformular — ich melde mich mit Skizze und Angebot.',
  },

  blog: {
    eyebrow: 'Werkstatt-Tagebuch',
    title: 'Blog',
    intro: 'Skizzen, Techniken, Werkstatt-Notizen und News aus dem Atelier — frisch aus dem Rauch.',
    featured: 'Featured',
    readTime: 'Lesezeit',
    readMore: 'Weiterlesen',
    workInGallery: 'Werk in der Galerie',
    inThisPost: 'Im Beitrag',
    allPosts: 'Alle Beiträge',
    storiesHeading: 'Geschichten aus der Werkstatt',
    filterLabel: 'Nach Kategorien filtern',
    all: 'Alle',
    empty: 'Keine Beiträge in dieser Kategorie. Schau bald wieder vorbei.',
    loadMore: 'Mehr laden',
    newsletterEyebrow: 'Newsletter',
    newsletterHeading: 'Funken im Posteingang.',
    newsletterText: 'Ein Brief pro Monat: neue Werke, Werkstatt-Einblicke, Auftragstermine. Kein Spam, jederzeit abbestellbar.',
    newsletterPlaceholder: 'deine@e-mail.de',
    newsletterAria: 'E-Mail-Adresse',
    subscribe: 'Abonnieren',
    subscribed: 'Abonniert ✓',
    newsletterConsent: 'Mit dem Abonnieren stimmst du der Verarbeitung deiner E-Mail zum Versand des Newsletters zu.',
  },

  post: {
    breadcrumbHome: 'Startseite',
    breadcrumbBlog: 'Blog',
    readTime: 'Lesezeit',
    tags: 'Tags:',
    share: 'Teilen:',
    shareBtn: '↗ Link teilen',
    linkCopied: 'Link kopiert ✓',
    backToBlog: '← Alle Beiträge',
    viewWorks: 'Werke ansehen',
    requestCommission: 'Auftrag anfragen',
    related: 'Das könnte dich auch interessieren',
    onlyGerman: '', // Hinweis nur auf der EN-Seite nötig
  },

  about: {
    storyEyebrow: 'Meine Geschichte',
    timelineEyebrow: 'Bisher',
    getInTouch: 'Kontakt aufnehmen',
    viewWorks: 'Werke ansehen',
  },

  contact: {
    email: 'E-Mail',
    workshop: 'Werkstatt',
    social: 'Social',
    responseTime: 'Antwortzeit',
    sendMessage: 'Nachricht senden',
    formName: 'Dein Name',
    formNamePlaceholder: 'z. B. Mara',
    formEmail: 'Deine E-Mail',
    formEmailPlaceholder: 'mara@example.de',
    topic: 'Anliegen',
    topicCommission: 'Auftragsarbeit',
    topicShop: 'Shop-Frage',
    topicStudio: 'Atelier-Besuch',
    topicPress: 'Presse',
    topicOther: 'Sonstiges',
    budget: 'Budget (optional)',
    budgetUnclear: 'Noch unklar',
    budgetUnder250: 'unter 250 €',
    budget250to500: '250–500 €',
    budget500to1000: '500–1.000 €',
    budgetOver1000: 'über 1.000 €',
    message: 'Deine Nachricht',
    messagePlaceholder: 'Erzähl mir kurz von deiner Idee, Größe, gewünschtem Lieferzeitpunkt …',
    privacyPre: 'Ich habe die',
    privacyLink: 'Datenschutzhinweise',
    privacyPost: 'gelesen und stimme zu.',
    send: 'Nachricht senden',
    thanks: 'Danke — ich melde mich!',
    faq: 'FAQ',
    faqHeading: 'Häufige Fragen',
    formSubject: 'Anfrage über alinta-ember.com',
    werkRef: 'Bezug: Neuauflage von „{werk}“',
    werkMessage: 'Hallo Alinta,\n\nich interessiere mich für eine Neuauflage von „{werk}“. Ist das als Auftragsarbeit möglich? Über Größe, Holzart und gewünschten Zeitrahmen würde ich gern sprechen.',
  },

  footer: { tagline: 'Alinta Ember · Pyrography' },
};

const en: typeof de = {
  nav: { home: 'Home', galerie: 'Gallery', shop: 'Shop', blog: 'Blog', ueber: 'About', kontakt: 'Contact' },
  header: { menu: 'Menu', startseite: 'Home page', switchLang: 'Diese Seite auf Deutsch lesen', switchLabel: 'DE' },

  meta: {
    homeTitle: 'Alinta Ember — Pyrography & Wood-Burning Art',
    homeDesc: 'Hand-burned, one-of-a-kind pyrography on wood and cork — gallery, workshop blog and commissions with your own motif. Sold via Etsy.',
    galerieTitle: 'Gallery — Alinta Ember',
    galerieDesc: 'All pyrography works by Alinta Ember: hand-burned motifs on wood and cork — from anime portraits to nature scenes, filterable by type of piece.',
    shopTitle: 'Shop — Alinta Ember',
    shopDesc: 'Originals and editions by Alinta Ember — hand-burned, one-of-a-kind pyrography. Sold via Etsy, commissions on request.',
    blogTitle: 'Blog — Alinta Ember',
    blogDesc: 'Workshop diary all about pyrography: technique, process insights and new works — fresh from the smoke.',
    ueberTitle: 'About — Alinta Ember',
    ueberDesc: 'The person behind Alinta Ember: my path to pyrography, my process from motif to sealing — and why no two pieces of wood are alike.',
    kontaktTitle: 'Contact — Alinta Ember',
    kontaktDesc: 'Request a commission or just say hello — pyrography with your own motif. Contact form, FAQ, replies within 2 working days.',
    impressumTitle: 'Imprint — Alinta Ember',
    impressumDesc: 'Legal notice and provider identification pursuant to § 5 DDG for alinta-ember.com.',
    datenschutzTitle: 'Privacy Policy — Alinta Ember',
    datenschutzDesc: 'Information on the processing of personal data on alinta-ember.com under the GDPR.',
  },

  home: {
    heroAlt: 'Alinta Ember — pyrography artist with fiery goggles and a burning iron',
    fullGallery: 'View full gallery',
    filterByCategory: 'Filter by category',
    myStory: 'My story',
    myProcess: 'My process in detail',
    fullShop: 'View full shop',
    requestCommission: 'Request a commission',
    toContactPage: 'View contact page',
    commission: 'Commission',
    formName: 'Your name',
    formEmail: 'Your email',
    formMessage: 'Short message',
    formSend: 'Send message',
    formThanks: "Thanks — I'll be in touch!",
    formSubject: 'Short message via alinta-ember.com (home page)',
  },

  gallery: {
    eyebrow: 'Gallery',
    title: 'All Works',
    intro: 'A collection of burned pieces from recent years — newest first, filterable by type of piece. Click a work to see the details.',
    all: 'All',
    tags: 'Tags',
    empty: 'No works in this selection. Check back soon — the workshop burns daily.',
    ctaHeading: 'Want a piece for yourself?',
    ctaText: 'Originals & editions are in the shop. For your own motif: commission.',
    toShop: 'To the shop',
    requestCommission: 'Request commission',
  },

  modal: {
    work: 'Work',
    view: 'View',
    openDetails: 'Open details',
    year: 'Year',
    dims: 'Size',
    requestEdition: 'Request a new edition',
    buyOnEtsy: 'Buy on Etsy ↗',
    close: 'Close',
    tagLinkTitle: 'All works tagged #{tag} in the gallery',
    tagFilterTitle: 'Show only works tagged #{tag}',
  },

  shop: {
    eyebrow: 'Shop',
    titleHtml: 'Originals<br/>& Editions',
    intro: 'Every work hand-burned, signed and shipped in loving packaging. Sales run through my Etsy shop.',
    available: 'Available',
    currentPieces: 'Current pieces',
    sort: 'Sort:',
    sortFeatured: 'Featured',
    sortPriceAsc: 'Price ascending',
    sortPriceDesc: 'Price descending',
    sortNew: 'Newest first',
    inclVat: 'incl. VAT',
    buyOnEtsy: 'Buy on Etsy ↗',
    teaserEyebrow: 'Etsy',
    teaserHeading: 'The shop is moving in.',
    teaserText: 'The first pieces ready for sale are arriving in my Etsy shop bit by bit. Have a look — or request a commission with your own motif right away.',
    toEtsy: 'Visit the Etsy shop ↗',
    requestCommission: 'Request commission',
    commissionEyebrow: 'Commission',
    commissionHeading: 'Your motif. Burned in wood.',
    commissionText: "Tell me what you have in mind — animal, portrait, wedding piece, keepsake. I'll reply with a sketch and quote within 3 working days.",
    startRequest: 'Start a request',
    leadTime: 'Lead time',
    leadTimeValue: '4–8 weeks',
    from: 'From',
    sizes: 'Sizes',
    shipping: 'Shipping',
    worldwide: 'Worldwide',
    cardShippingTitle: 'Shipping & packaging',
    cardShippingText: 'DHL insured, plastic-free packaging in a hand-labeled box. Dispatch within 5–7 working days of your order.',
    cardEtsyTitle: 'Buying via Etsy',
    cardEtsyText: 'Payment and buyer protection run through Etsy. Prices incl. VAT — German small business rule §19 UStG.',
    cardCommissionTitle: 'Commissions',
    cardCommissionText: "Want your own motif? Send a request via the contact form — I'll reply with a sketch and quote.",
  },

  blog: {
    eyebrow: 'Workshop Diary',
    title: 'Blog',
    intro: 'Sketches, techniques, workshop notes and news from the studio — fresh from the smoke.',
    featured: 'Featured',
    readTime: 'read',
    readMore: 'Read more',
    workInGallery: 'Work in the gallery',
    inThisPost: 'In this post',
    allPosts: 'All posts',
    storiesHeading: 'Stories from the workshop',
    filterLabel: 'Filter by category',
    all: 'All',
    empty: 'No posts in this category. Check back soon.',
    loadMore: 'Load more',
    newsletterEyebrow: 'Newsletter',
    newsletterHeading: 'Sparks in your inbox.',
    newsletterText: 'One letter per month: new works, workshop insights, commission openings. No spam, unsubscribe anytime.',
    newsletterPlaceholder: 'your@email.com',
    newsletterAria: 'Email address',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed ✓',
    newsletterConsent: 'By subscribing you agree to your email being used to send the newsletter.',
  },

  post: {
    breadcrumbHome: 'Home',
    breadcrumbBlog: 'Blog',
    readTime: 'read',
    tags: 'Tags:',
    share: 'Share:',
    shareBtn: '↗ Share link',
    linkCopied: 'Link copied ✓',
    backToBlog: '← All posts',
    viewWorks: 'View works',
    requestCommission: 'Request commission',
    related: 'You might also like',
    onlyGerman: 'This post is currently only available in German.',
  },

  about: {
    storyEyebrow: 'My story',
    timelineEyebrow: 'So far',
    getInTouch: 'Get in touch',
    viewWorks: 'View works',
  },

  contact: {
    email: 'Email',
    workshop: 'Workshop',
    social: 'Social',
    responseTime: 'Response time',
    sendMessage: 'Send a message',
    formName: 'Your name',
    formNamePlaceholder: 'e.g. Mara',
    formEmail: 'Your email',
    formEmailPlaceholder: 'mara@example.com',
    topic: 'Subject',
    topicCommission: 'Commission',
    topicShop: 'Shop question',
    topicStudio: 'Studio visit',
    topicPress: 'Press',
    topicOther: 'Other',
    budget: 'Budget (optional)',
    budgetUnclear: 'Not sure yet',
    budgetUnder250: 'under €250',
    budget250to500: '€250–500',
    budget500to1000: '€500–1,000',
    budgetOver1000: 'over €1,000',
    message: 'Your message',
    messagePlaceholder: 'Tell me briefly about your idea, size, desired delivery date …',
    privacyPre: 'I have read the',
    privacyLink: 'privacy notice',
    privacyPost: 'and agree.',
    send: 'Send message',
    thanks: "Thanks — I'll be in touch!",
    faq: 'FAQ',
    faqHeading: 'Frequent questions',
    formSubject: 'Inquiry via alinta-ember.com (EN)',
    werkRef: 'Regarding: new edition of “{werk}”',
    werkMessage: 'Hi Alinta,\n\nI\'m interested in a new edition of “{werk}”. Would that be possible as a commission? I\'d love to talk about size, wood type and timeframe.',
  },

  footer: { tagline: 'Alinta Ember · Pyrography' },
};

export const UI: Record<Lang, typeof de> = { de, en };
