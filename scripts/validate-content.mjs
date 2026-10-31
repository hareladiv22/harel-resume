// Validates public/content.json (and the static copies of its data) before every deploy.
// Vercel runs it as the build step (`npm run build`); locally: `npm run check`.
// Any error → exit code 1 → Vercel fails the build and the previous version stays live.
// Node built-ins only.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const read = f => fs.readFileSync(path.join(PUB, f), 'utf8');
const errors = [];
const fail = (where, problem, value) => errors.push({ where, problem, value });

// ---------- 1. Parse ----------
const raw = read('content.json').replace(/^﻿/, '');
let C;
try {
  C = JSON.parse(raw);
} catch (e) {
  // Turn the character position from the parser into line:column.
  const m = /position (\d+)/.exec(e.message);
  const pos = m ? +m[1] : null;
  let where = '';
  if (pos !== null) {
    const before = raw.slice(0, pos).split('\n');
    const line = before.length, col = before.at(-1).length + 1;
    where = ` at line ${line}, column ${col}`;
    console.error(`\n  ${line} | ${raw.split('\n')[line - 1]}\n  ${' '.repeat(String(line).length)} | ${' '.repeat(col - 1)}^`);
  }
  console.error(`\n✗ content.json is not valid JSON${where}.\n  ${e.message}`);
  console.error('  Hint: check for a missing comma, an extra comma after the last item, or an unescaped quote (write \\" inside text).');
  console.error(`  רמז: בדוק אם חסר פסיק, אם יש פסיק מיותר אחרי הפריט האחרון, או מירכאה בתוך טקסט (כותבים \\").${where ? ` המיקום: שורה ${where.match(/line (\d+)/)[1]}.` : ''}`);
  console.error('\nBuild stopped. The live site was not changed. / הפרסום נעצר. האתר החי לא השתנה.\n');
  process.exit(1);
}

// ---------- helpers ----------
const plainLen = s => [...s.replace(/<\/?em>|<br>/g, '')].length;   // tags don't count toward limits
const excerpt = s => (typeof s === 'string' ? `"${s.length > 60 ? s.slice(0, 57) + '…' : s}"` : JSON.stringify(s));
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

// Text field: required/optional, max length, and only <em>…</em> / <br> as markup (rich) or none (plain).
function text(obj, key, where, { max, optional = false, rich = true } = {}) {
  const v = obj[key], p = `${where}.${key}`;
  if (v === undefined || v === '') { if (!optional) fail(p, 'missing (required)'); return; }
  if (typeof v !== 'string') return fail(p, 'must be text in "quotes"', v);
  const rest = rich ? v.replace(/<\/?em>|<br>/g, '') : v;
  if (rest.includes('<') || rest.includes('>')) fail(p, rich ? 'only <em>…</em> and <br> are allowed as markup' : 'no markup allowed here', v);
  if (rich && (v.match(/<em>/g) || []).length !== (v.match(/<\/em>/g) || []).length) fail(p, '<em> and </em> must come in pairs', v);
  if (max && plainLen(v) > max) fail(p, `too long (${plainLen(v)} > ${max} characters)`, v);
}
function list(obj, key, where, min, max) {
  const v = obj[key], p = `${where}.${key}`;
  if (!Array.isArray(v)) { fail(p, 'missing list [ … ]'); return []; }
  if (v.length < min || v.length > max) fail(p, min === max ? `needs exactly ${min} items (has ${v.length})` : `needs ${min}–${max} items (has ${v.length})`);
  return v;
}
function onlyKeys(obj, allowed, where) {
  for (const k of Object.keys(obj)) if (!allowed.includes(k)) fail(`${where}.${k}`, `unknown field (allowed: ${allowed.join(', ')}). Typo?`);
}

// ---------- 2. meta ----------
const META_KEYS = ['name', 'title', 'tagline', 'siteUrl', 'email', 'phone', 'phoneDisplay', 'whatsapp', 'linkedin', 'cv', 'cvFileName'];
const M = isObj(C.meta) ? C.meta : (fail('meta', 'missing { … } block'), {});
onlyKeys(M, META_KEYS, 'meta');
for (const k of META_KEYS) text(M, k, 'meta', { rich: false, max: k === 'tagline' ? 90 : undefined });
const check = (k, ok, problem) => { if (typeof M[k] === 'string' && M[k] && !ok(M[k])) fail(`meta.${k}`, problem, M[k]); };
check('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'not a valid email address');
check('phone', v => /^\+\d{8,15}$/.test(v), 'digits only, starting with + (e.g. +972524034600)');
check('whatsapp', v => /^\d{8,15}$/.test(v), 'digits only, no + (e.g. 972524034600)');
check('linkedin', v => v.startsWith('https://www.linkedin.com/in/'), 'must start with https://www.linkedin.com/in/');
check('siteUrl', v => /^https:\/\/\S+[^/]$/.test(v), 'must start with https:// and have no / at the end');
check('cv', v => v.startsWith('/') && fs.existsSync(path.join(PUB, v)), 'file not found under public/ (path must start with /)');
check('cvFileName', v => /^[\w.-]+\.pdf$/i.test(v), 'must be a file name ending in .pdf, no spaces');

// ---------- 3. slides ----------
const TYPES = {
  hero: ['lines', 'sub', 'cta'],
  words: ['items'],
  stats: ['h', 'items'],
  timeline: ['h', 'items'],
  cards: ['h', 'items'],
  contact: ['h', 'sub', 'privacyNote'],
};
const S = Array.isArray(C.slides) ? C.slides : (fail('slides', 'missing list [ … ]'), []);
S.forEach((s, i) => {
  const w = `slides[${i}]`;
  if (!isObj(s)) return fail(w, 'each slide must be { … }');
  if (!TYPES[s.type]) return fail(`${w}.type`, `must be one of: ${Object.keys(TYPES).join(', ')}`, s.type);
  onlyKeys(s, ['type', 'theme', 'light', 'd', ...TYPES[s.type]], w);
  if (!/^t[1-7]$/.test(s.theme)) fail(`${w}.theme`, 'must be t1 … t7', s.theme);
  if (typeof s.light !== 'boolean') fail(`${w}.light`, 'must be true or false (no quotes)', s.light);
  if (!Number.isInteger(s.d) || s.d < 4 || s.d > 15) fail(`${w}.d`, 'seconds on screen: a whole number 4–15', s.d);
  if (s.type !== 'hero' && s.type !== 'words') text(s, 'h', w, { max: 30 });
  switch (s.type) {
    case 'hero':
      list(s, 'lines', w, 2, 4).forEach((l, j) => text(s.lines, j, `${w}.lines`, { max: 12 }));
      text(s, 'sub', w, { max: 90 }); text(s, 'cta', w, { max: 24 });
      break;
    case 'words':
      list(s, 'items', w, 3, 3).forEach((o, j) => { const p = `${w}.items[${j}]`; if (!isObj(o)) return fail(p, 'must be { … }'); onlyKeys(o, ['w', 't'], p); text(o, 'w', p, { max: 6 }); text(o, 't', p, { max: 60 }); });
      break;
    case 'stats':
      list(s, 'items', w, 3, 4).forEach((o, j) => {
        const p = `${w}.items[${j}]`; if (!isObj(o)) return fail(p, 'must be { … }');
        onlyKeys(o, ['pre', 'n', 'dec', 'suf', 'l', 's'], p);
        if (typeof o.n !== 'number' || o.n < 0) fail(`${p}.n`, 'must be a number ≥ 0 (no quotes)', o.n);
        if (!Number.isInteger(o.dec) || o.dec < 0 || o.dec > 2) fail(`${p}.dec`, 'decimals: 0, 1 or 2', o.dec);
        for (const k of ['pre', 'suf']) if (typeof o[k] !== 'string' || [...o[k]].length > 2) fail(`${p}.${k}`, 'text of at most 2 characters ("" if none)', o[k]);
        text(o, 'l', p, { max: 50 }); text(o, 's', p, { max: 45, optional: true });
      });
      break;
    case 'timeline':
      list(s, 'items', w, 2, 5).forEach((o, j) => { const p = `${w}.items[${j}]`; if (!isObj(o)) return fail(p, 'must be { … }'); onlyKeys(o, ['when', 'name', 'text'], p); text(o, 'when', p, { max: 16 }); text(o, 'name', p, { max: 36 }); text(o, 'text', p, { max: 140 }); });
      break;
    case 'cards':
      list(s, 'items', w, 2, 4).forEach((o, j) => { const p = `${w}.items[${j}]`; if (!isObj(o)) return fail(p, 'must be { … }'); onlyKeys(o, ['tag', 'title', 'text', 'big'], p); text(o, 'tag', p, { max: 28 }); text(o, 'title', p, { max: 40 }); text(o, 'text', p, { max: 120, optional: true }); text(o, 'big', p, { max: 12, optional: true }); });
      break;
    case 'contact':
      text(s, 'sub', w, { max: 90 }); text(s, 'privacyNote', w, { max: 50 });
      break;
  }
});
const types = S.map(s => s && s.type);
if (types.filter(t => t === 'hero').length !== 1 || types[0] !== 'hero') fail('slides', 'needs exactly one "hero" slide, and it must be first');
if (types.filter(t => t === 'contact').length !== 1 || types.at(-1) !== 'contact') fail('slides', 'needs exactly one "contact" slide, and it must be last');

// Contact details live only in meta (the contact slide is built from it).
const slidesText = JSON.stringify(S).toLowerCase();
for (const k of ['email', 'phoneDisplay', 'linkedin']) if (M[k] && slidesText.includes(String(M[k]).toLowerCase().replace(/\/$/, ''))) fail('slides', `contact data (${k}) belongs only in meta, not in slide text`);
if (M.whatsapp && slidesText.includes(M.whatsapp)) fail('slides', 'phone number belongs only in meta, not in slide text');

// ---------- 4. placeholders anywhere in content.json ----------
(function walk(v, p) {
  if (typeof v === 'string') {
    if (/TODO/i.test(v)) fail(p, 'placeholder "TODO" must be replaced', v);
    if (/your-handle|example\.com/i.test(v)) fail(p, 'placeholder value must be replaced', v);
    if (/\[[^\]]*\]/.test(v)) fail(p, '[…] placeholder must be replaced', v);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`));
  else if (isObj(v)) for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k);
})(C, '');

// ---------- 5. static copies must match meta (crawlers and the no-JS fallback don't read content.json) ----------
if (errors.length === 0) {
  const html = read('index.html');
  const fb = (html.match(/<section class="fallback"[\s\S]*?<\/section>/) || [''])[0];
  const esc = s => s.replace(/&/g, '&amp;');
  const need = (file, src, snippet, what) => { if (!src.includes(snippet)) fail(file, `${what} must be: ${snippet}`); };
  const titleLine = esc(`${M.name} · ${M.title}`);
  need('index.html', html, `<title>${titleLine}</title>`, '<title>');
  need('index.html', html, `<meta property="og:title" content="${titleLine}">`, 'og:title');
  need('index.html', html, `<meta name="description" content="${esc(M.tagline)}">`, 'description');
  need('index.html', html, `<meta property="og:description" content="${esc(M.tagline)}">`, 'og:description');
  need('index.html', html, `<link rel="canonical" href="${M.siteUrl}/">`, 'canonical');
  need('index.html', html, `<meta property="og:url" content="${M.siteUrl}/">`, 'og:url');
  need('index.html', html, `<meta property="og:image" content="${M.siteUrl}/assets/og.png">`, 'og:image');
  need('index.html (fallback)', fb, `<h1>${esc(M.name)}</h1>`, 'name');
  need('index.html (fallback)', fb, `<p class="fb-title">${esc(M.title)}</p>`, 'title');
  need('index.html (fallback)', fb, `<p class="fb-tag">${esc(M.tagline)}</p>`, 'tagline');
  need('index.html (fallback)', fb, `href="${M.cv}" download="${M.cvFileName}"`, 'CV link');
  need('index.html (fallback)', fb, `<a href="mailto:${M.email}">${M.email}</a>`, 'email');
  need('index.html (fallback)', fb, `<a href="tel:${M.phone}">${M.phoneDisplay}</a>`, 'phone');
  need('index.html (fallback)', fb, `href="https://wa.me/${M.whatsapp}"`, 'WhatsApp link');
  need('index.html (fallback)', fb, `href="${M.linkedin}"`, 'LinkedIn link');
  need('robots.txt', read('robots.txt'), `Sitemap: ${M.siteUrl}/sitemap.xml`, 'sitemap line');
  need('sitemap.xml', read('sitemap.xml'), `<loc>${M.siteUrl}/</loc>`, 'URL');
}

// No "TODO" left in any text file that gets published.
(function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) scan(f);
    else if (/\.(html|css|js|json|txt|xml|svg)$/.test(e.name) && !/^OFL/.test(e.name) && /TODO/.test(fs.readFileSync(f, 'utf8')))
      fail(path.relative(ROOT, f).replace(/\\/g, '/'), 'contains "TODO"');
  }
})(PUB);

// ---------- report ----------
if (errors.length) {
  console.error(`\n✗ Found ${errors.length} problem${errors.length > 1 ? 's' : ''}. / נמצאו ${errors.length} בעיות.\n`);
  for (const e of errors) console.error(`  • ${e.where}: ${e.problem}${e.value !== undefined ? `\n      value: ${excerpt(e.value)}` : ''}`);
  console.error('\nBuild stopped. The live site was not changed. / הפרסום נעצר. האתר החי לא השתנה.\n');
  process.exit(1);
}
console.log(`✓ content.json OK (${S.length} slides). Static copies match.`);
