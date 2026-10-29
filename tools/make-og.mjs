// Renders tools/og.html → public/assets/og.png (1200×630). Run: node tools/make-og.mjs
import { shot } from './chrome.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'public', 'assets', 'og.png');
const size = shot(path.join(here, 'og.html'), '', 1200, 630, out);
console.log(`og.png written (${Math.round(size / 1024)} KB)${size > 300 * 1024 ? '  WARNING: over 300 KB' : ''}`);
