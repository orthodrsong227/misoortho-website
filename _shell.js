
const NAV = [
  ['treatments.html','Treatments'],
  ['marpe-airway.html','Airway & MARPE'],
  ['dr-richard-song.html','Dr. Song'],
  ['the-studio.html','The Studio'],
  ['results.html','Results'],
  ['fees.html','Fees'],
  ['visit.html','Visit']
];
const BIZ = {
  name: 'Miso Orthodontic Studio',
  street: '175 Newark Avenue, Suite 3A-1',
  city: 'Jersey City', region: 'NJ', zip: '07310',
  phone: '+1-201-377-3757', phoneDisplay: '(201) 377-3757',
  fax: '+1-201-377-3938',
  email: 'hello@misoortho.com',
  origin: 'https://www.misoortho.com'
};
function head(o){
  return [
'<!DOCTYPE html>',
'<html lang="en">',
'<head>',
'<meta charset="utf-8">',
'<meta name="viewport" content="width=device-width, initial-scale=1">',
'<title>' + o.title + '</title>',
'<meta name="description" content="' + o.desc + '">',
'<link rel="canonical" href="' + BIZ.origin + '/' + (o.slug === 'index' ? '' : o.slug + '.html') + '">',
'<meta property="og:title" content="' + o.title + '">',
'<meta property="og:description" content="' + o.desc + '">',
'<meta property="og:type" content="website">',
'<meta property="og:image" content="' + BIZ.origin + '/img/' + (o.og || 'reception-wide.jpg') + '">',
'<meta name="twitter:card" content="summary_large_image">',
'<meta name="theme-color" content="#14100D">',
'<link rel="preconnect" href="https://fonts.googleapis.com">',
'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
'<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..600;1,6..72,200..400&family=Jost:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">',
'<link rel="stylesheet" href="css/miso.css">',
o.schema ? '<script type="application/ld+json">' + JSON.stringify(o.schema) + '</' + 'script>' : '',
'</head>',
'<body' + (o.bodyClass ? ' class="' + o.bodyClass + '"' : '') + '>',
'<a class="skip" href="#main">Skip to content</a>',
header(o.slug),
'<main id="main">'
  ].filter(Boolean).join('\n');
}
function header(slug){
  const links = NAV.map(function(n){
    const active = (slug + '.html') === n[0];
    return '<li><a href="' + n[0] + '"' + (active ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>';
  }).join('');
  return [
'<header class="site-head">',
'  <div class="site-head__in">',
'    <a class="lockup" href="index.html" aria-label="Miso Orthodontic Studio, home">',
'      <span class="lockup__m">MISO</span>',
'      <span class="lockup__s">Orthodontic Studio</span>',
'    </a>',
'    <nav class="nav" aria-label="Primary">',
'      <ul>' + links + '</ul>',
'    </nav>',
'    <div class="head-cta">',
'      <a class="btn btn--amber btn--sm" href="consultation.html">Book a consult</a>',
'      <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span><span></span></button>',
'    </div>',
'  </div>',
'  <div class="drawer" id="drawer" hidden>',
'    <ul>' + NAV.map(function(n){return '<li><a href="' + n[0] + '">' + n[1] + '</a></li>';}).join('') + '<li><a href="journal.html">Journal</a></li></ul>',
'    <a class="btn btn--amber" href="consultation.html">Book a consultation</a>',
'    <a class="drawer__tel" href="tel:' + BIZ.phone + '">' + BIZ.phoneDisplay + '</a>',
'  </div>',
'</header>'
  ].join('\n');
}
function faq(items){
  return [
'<section class="band band--paper" id="faq">',
'  <div class="wrap wrap--split">',
'    <div class="split__aside">',
'      <p class="eyebrow">Frequently asked</p>',
'      <h2 class="h2">Straight answers.</h2>',
'      <p class="lede-sm">Written to be read by patients &mdash; and quoted accurately by search engines and AI assistants.</p>',
'    </div>',
'    <div class="split__body faq">',
items.map(function(it, i){
  return '      <details class="faq__item"' + (i === 0 ? ' open' : '') + '>\n' +
         '        <summary><span>' + it.q + '</span></summary>\n' +
         '        <div class="faq__a">' + it.a.map(function(p){return '<p>' + p + '</p>';}).join('') + '</div>\n' +
         '      </details>';
}).join('\n'),
'    </div>',
'  </div>',
'</section>'
  ].join('\n');
}
function faqSchema(items){
  return {
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity: items.map(function(it){
      return {'@type':'Question', name: it.q, acceptedAnswer:{'@type':'Answer', text: it.a.join(' ').replace(/<[^>]+>/g,'')}};
    })
  };
}
function cta(o){
  o = o || {};
  return [
'<section class="band band--ink cta-band" data-reveal>',
'  <div class="wrap cta-band__in">',
'    <div>',
'      <h2 class="h1-sm">' + (o.title || 'Come see the room.') + '</h2>',
'      <p class="lede lede--on-dark">' + (o.body || 'A first consultation takes an hour: a 3D scan, an airway analysis, and a written plan you take home. No pressure, no sales script.') + '</p>',
'    </div>',
'    <div class="cta-band__actions">',
'      <a class="btn btn--amber" href="consultation.html">Book online</a>',
'      <a class="btn btn--ghost-light" href="tel:' + BIZ.phone + '">Call ' + BIZ.phoneDisplay + '</a>',
'    </div>',
'  </div>',
'</section>'
  ].join('\n');
}
function foot(){
  return [
'</main>',
'<footer class="site-foot">',
'  <div class="wrap site-foot__in">',
'    <div class="site-foot__brand">',
'      <span class="lockup__m">MISO</span>',
'      <span class="lockup__s">Orthodontic Studio</span>',
'      <p class="mono-sm">' + BIZ.street + '<br>' + BIZ.city + ', ' + BIZ.region + ' ' + BIZ.zip + '<br><a href="tel:' + BIZ.phone + '">' + BIZ.phoneDisplay + '</a> &middot; <a href="mailto:' + BIZ.email + '">' + BIZ.email + '</a></p>',
'    </div>',
'    <div class="site-foot__cols">',
'      <div><p class="mono-label">Treatment</p><ul><li><a href="marpe-airway.html">Airway &amp; MARPE</a></li><li><a href="clear-aligners.html">Clear aligners</a></li><li><a href="early-treatment.html">Children</a></li><li><a href="tmj.html">TMJ &amp; jaw</a></li><li><a href="whitening.html">Whitening</a></li></ul></div>',
'      <div><p class="mono-label">Studio</p><ul><li><a href="dr-richard-song.html">Dr. Richard Song</a></li><li><a href="the-studio.html">The studio</a></li><li><a href="results.html">Results</a></li><li><a href="journal.html">Journal</a></li></ul></div>',
'      <div><p class="mono-label">Visit</p><ul><li><a href="consultation.html">Book a consultation</a></li><li><a href="fees.html">Fees &amp; financing</a></li><li><a href="visit.html">Directions &amp; hours</a></li></ul></div>',
'    </div>',
'  </div>',
'  <div class="wrap site-foot__legal"><span class="mono-sm">&copy; 2026 Miso Orthodontic Studio</span><span class="mono-sm">Mon&ndash;Fri 9&ndash;6 &middot; Sat by request</span></div>',
'</footer>',
'<script src="js/miso.js" defer></' + 'script>',
'<script src="js/analytics.js" defer></' + 'script>',
'</body>',
'</html>'
  ].join('\n');
}
