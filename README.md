# Miso Orthodontic Studio — website

A complete, hand-built static site. No framework, no build step, no dependencies.
Open `index.html` in a browser and it works.

## Run it locally

Because the pages link to each other with relative paths, you can just double-click
`index.html`. For a proper local server (recommended, so that `robots.txt`,
`sitemap.xml` and absolute-root behaviour match production):

```bash
cd site
python3 -m http.server 8080     # then visit http://localhost:8080
# or
npx serve .
```

## Deploy it

Drag the `site` folder onto Netlify, Vercel, Cloudflare Pages or any static host.
Nothing needs compiling. Point the domain at it, enable HTTPS, done.

## Structure

```
site/
  index.html               Home
  treatments.html          Treatment overview (hub)
  marpe-airway.html        Signature page — the deepest content on the site
  clear-aligners.html
  early-treatment.html
  tmj.html
  whitening.html
  dr-richard-song.html     Doctor / E-E-A-T page
  the-studio.html          Space gallery
  results.html             Before & after
  consultation.html        Booking — scheduler embed goes here
  fees.html                Published fee ranges
  journal.html             Editorial index
  visit.html               Address, hours, parking, map
  css/miso.css             The whole design system, one file, commented
  js/miso.js               ~30 lines: mobile menu + scroll reveal. Nothing depends on it.
  img/                     Interior renders (replace with photography later)
  robots.txt  sitemap.xml  llms.txt
  _shell.js                Generator partials used to author the pages (not served)
```

## Design system (in `css/miso.css`)

- **Colour** — `--ink #14100D`, `--walnut #2E1E14`, `--amber #C98A4B` (the cove
  lighting: hairlines, hovers, primary buttons), `--celadon #7E9AA2` (airway and
  wellness content only), `--hanji #F4EFE6`, `--paper #FAF8F3`, `--travertine #E2D7C6`.
  Two accents, never both in one component.
- **Type** — Newsreader (display + body, weights 200–300, large and quiet),
  Jost (nav, buttons, labels — wide tracking echoes the signage lockup),
  IBM Plex Mono (micro-labels only, 9–11px).
- **Motif** — the arch. `--arch: 999px 999px 4px 4px` is used on hero images,
  gallery crops and portraits. One radius token, reused everywhere.
- **Sections** — every page is a stack of `.band` elements, alternating
  `--paper`, `--hanji` and `--ink`. Never more than two backgrounds in view.
- **Responsive** — breakpoints at 1080px (nav collapses to the drawer), 820px
  (two-column layouts stack) and 520px. Tap targets are 44px minimum.
- **Motion** — hero type rises once on load; sections fade up via
  `[data-reveal]`. All of it is disabled under `prefers-reduced-motion`.

## Before launch — replace these

1. **NAP data.** Address, phone, email and geo coordinates appear in the footer of
   every page, in the JSON-LD on the homepage, and in `llms.txt`. They must match
   the Google Business Profile character for character. Search for `0000`.
2. **Credentials** on `dr-richard-song.html` — exact degrees, universities, years,
   licence number, board status. These lines are what establishes authority.
3. **Fee ranges** on `fees.html`.
4. **Scheduler embed** on `consultation.html` (marked with a developer note).
   Load the third-party script on interaction, not on page load.
5. **Map embed** on `visit.html`, lazy-loaded.
6. **Photography.** The interior images are 3D renders. Re-shoot at the same crops
   and keep the warm, dark grade — do not brighten to "clinical". Placeholders
   marked in travertine stripes show exactly what is still needed: doctor and team
   portraits, and paired before/after cases.
7. **Journal articles.** The index is real; the six posts are titles. Each article
   needs `Article` schema, Dr. Song as named author, and internal links to the
   relevant treatment page.

## SEO / AEO notes already built in

- One `<h1>` per page, ordered headings, semantic landmarks, skip link.
- Answer-first structure: each key H2 is a question, answered in one sentence
  (`.answer`) before any detail. That sentence is what an AI assistant quotes.
- FAQ on every page as native `<details>` — accessible, indexable with JS off —
  mirrored in `FAQPage` JSON-LD.
- JSON-LD per page: `Dentist`/`MedicalClinic` + `Physician` (home),
  `MedicalProcedure` (treatments), `BreadcrumbList`, `FAQPage`.
- `llms.txt` gives AI crawlers a clean summary and citation guidance;
  `robots.txt` explicitly welcomes GPTBot, ClaudeBot and PerplexityBot.
- Images have descriptive alt text and intrinsic `width`/`height`; below-the-fold
  images are lazy. The hero has `fetchpriority="high"`.
- Add before launch: convert `img/` to AVIF/WebP with `<picture>`, add
  `Review`/`AggregateRating` schema once real reviews exist, and submit
  `sitemap.xml` in Search Console.

## Analytics — what we measure and why

`js/analytics.js` is provider-agnostic: it fires the same event names into
whichever tool is loaded (Vercel Web Analytics, GA4, Plausible, Fathom, Clarity).
With nothing connected it logs to the console — open the site locally, or add
`?debug=1` in production, and watch the events in devtools.

### Turning it on with Vercel
1. Deploy the `site` folder to Vercel (`vercel.json` is already here: clean URLs,
   long-lived image caching, basic security headers).
2. Project → **Analytics** → Enable. Vercel injects its script on the deployed
   domain; `window.va` appears and our custom events start flowing. No key needed.
3. Project → **Speed Insights** → Enable, for real-world Core Web Vitals.
4. Optional but recommended: create a free **Microsoft Clarity** project and paste
   its ID into `CLARITY_ID` at the top of `js/analytics.js`. Clarity gives you
   heatmaps and session replays — literally watching where people stop and what
   they click. GA4 goes in `GA4_ID` on the same lines if you also want it.

### Events collected
| Event | Answers |
| --- | --- |
| `booking_cta_click` | Which Book button converts — hero, treatment page, or closing band |
| `call_click` / `email_click` | How many people phone instead of booking online |
| `treatment_click` | Which of the five treatments people actually care about |
| `faq_open` (with the question text) | The real questions patients have — feed these back into copy and new pages |
| `scroll_depth` (25/50/75/90%) | Whether the page is too long |
| `section_view` / `section_dwell` | Which sections get reached, and which hold attention |
| `page_exit` (seconds, last section, max depth) | **Where people drop off** |
| `nav_click` / `nav_mobile` / `footer_click` | How people navigate, desktop vs phone |

### Reading it after a month
- If `page_exit.last_section` clusters on one section, that section is the leak — rewrite or move it.
- The top three `faq_open` questions should be promoted into headings, or into their own page.
- If `booking_cta_click` fires mostly from the closing band, the hero CTA is being ignored — change its wording.
- `call_click` beating `booking_cta_click` means the scheduler is too much friction.

### Privacy
No cookies, no personal data, no cross-site identifiers in our own layer — event
names and labels only. Vercel Analytics and Plausible are cookieless by design;
GA4 and Clarity are not, so if you add either, add a cookie notice and a privacy
policy page, and check HIPAA implications before putting any tracking on pages
where a patient submits information. Never place analytics on a page that
collects health details or inside the scheduler iframe.
