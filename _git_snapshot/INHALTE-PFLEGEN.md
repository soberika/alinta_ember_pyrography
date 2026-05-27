# Inhalte pflegen

Alle Inhalte der Website liegen als JSON-Dateien im Ordner `data/`. Du
musst kein HTML anfassen — einfach die passende Datei bearbeiten und
speichern, die Seite zeigt den neuen Stand sofort.

## Wo liegt was?

| Datei                | Steuert            |
|----------------------|--------------------|
| `data/posts.json`    | Blog & News        |
| `data/works.json`    | Galerie            |
| `data/products.json` | Shop               |

## Neuen Blog-Beitrag anlegen

Öffne `data/posts.json` und füge oben in der Liste einen neuen Eintrag
ein (neueste Beiträge oben). Vorlage:

```json
{
  "slug": "mein-neuer-beitrag",
  "category": "news",
  "categoryLabel": "News",
  "date": "27. Mai 2026",
  "readTime": "3 Min",
  "title": "Titel des Beitrags",
  "excerpt": "Ein kurzer Teaser, der in der Liste angezeigt wird.",
  "thumbnail": "illus:funke",
  "featured": false,
  "body": [
    "Erster Absatz.",
    "Zweiter Absatz.",
    "Beliebig viele Absätze."
  ]
}
```

### Felder erklärt
- **slug** — eindeutige Kennung, klein, ohne Leerzeichen (z. B. `nebelwald-2`).
- **category** — eine der Kategorien: `news`, `technik`, `werkstatt`,
  `prozess`. Steuert die Filter-Buttons.
- **categoryLabel** — Anzeigename derselben Kategorie (z. B. `News`).
- **date** — Datum als Text, frei formatierbar (z. B. `27. Mai 2026`).
- **readTime** — Lesezeit als Text (z. B. `3 Min`).
- **title** — Titel des Beitrags.
- **excerpt** — Kurzbeschreibung für die Karte.
- **thumbnail** — Vorschaubild. Zwei Möglichkeiten:
  - Foto: Pfad zum Bild, z. B. `"assets/mein-foto.jpg"`.
    (Bild vorher nach `assets/` hochladen.)
  - SVG-Illustration: einer der eingebauten Stile —
    `illus:funke`, `illus:spitzen`, `illus:edition`, `illus:holz`,
    `illus:studio`, `illus:skizze`, `illus:klang`, `illus:zahn`.
- **featured** — `true` zeigt den Beitrag als großen Hero-Block oben.
  Maximal ein Beitrag sollte `featured: true` sein.
- **body** — Liste von Absätzen, die im Detail-Modal erscheinen.

### Eintrag löschen
Einfach den ganzen `{ … }`-Block samt vorangehendem Komma entfernen.

## Neues Galerie-Werk anlegen

`data/works.json` — Vorlage:

```json
{
  "id": "mein-werk",
  "category": "natur",
  "title": "Titel",
  "image": "assets/mein-werk.jpg",
  "eyebrow": "Holzscheibe · Ø 25 cm",
  "description": "Kurze Beschreibung für das Modal.",
  "meta": [
    ["Material", "Birke"],
    ["Größe",    "25 cm Durchmesser"],
    ["Jahr",     "2026"],
    ["Auflage",  "Unikat"]
  ]
}
```

Kategorien für die Filter: `tiere`, `natur`, `steampunk`, `portrait`.

## Neues Shop-Produkt anlegen

`data/products.json` — Vorlage:

```json
{
  "id": "mein-produkt",
  "title": "Titel",
  "image": "assets/mein-produkt.jpg",
  "price": 420,
  "stock": "verfügbar",
  "tag": "Original",
  "date": "2026-05"
}
```

`date` ist das Veröffentlichungsdatum für die Sortierung "Neueste zuerst".

## JSON-Regeln (wichtig!)
- Strings immer in `"doppelte Anführungszeichen"`.
- Trenne Felder mit Komma — **außer nach dem letzten** Feld eines Eintrags.
- Trenne Einträge in einer Liste mit Komma — außer nach dem letzten.
- Wenn du Anführungszeichen im Text brauchst, schreibe `\"` (Backslash + Quote).

## Bilder hochladen
Lege neue Bilder einfach in den Ordner `assets/` ab und referenziere
sie als `assets/dateiname.jpg`. Empfohlene Größe: 1200 × 1600 px für
Werk-Bilder, 1600 × 1000 px für Blog-Thumbnails.
