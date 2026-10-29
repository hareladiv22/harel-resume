// Renders tools/icon.html → public/apple-touch-icon.png (180) and public/favicon.ico (32 + 16).
// Run: node tools/make-icons.mjs   (public/icon.svg is hand-written, same design)
import { shot } from './chrome.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, '..', 'public');
const html = path.join(here, 'icon.html');

// Headless Chrome won't open tiny windows, so render a larger window and crop the top-left square.
function render(size) {
  const tmp = path.join(os.tmpdir(), `icon-${size}.png`);
  shot(html, `?s=${size}`, Math.max(size, 200), Math.max(size, 200), tmp);
  return cropPng(fs.readFileSync(tmp), size);
}

fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), render(180));

// .ico = small header + directory, each entry holding a PNG (supported by all current browsers).
const pngs = [32, 16].map(s => [s, render(s)]);
const head = Buffer.alloc(6 + 16 * pngs.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
let offset = head.length;
pngs.forEach(([s, png], k) => {
  const e = 6 + 16 * k;
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(png.length, e + 8); head.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat([head, ...pngs.map(p => p[1])]));
console.log('apple-touch-icon.png and favicon.ico written');

// --- minimal PNG crop (RGBA/RGB, 8-bit, non-interlaced), Node built-ins only ---
import zlib from 'node:zlib';
function cropPng(buf, size) {
  let p = 8, w, h, type, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), t = buf.toString('ascii', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); type = d[9]; }
    if (t === 'IDAT') idat.push(d);
    p += 12 + len;
  }
  const bpp = type === 6 ? 4 : 3, raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * bpp;
  const rows = []; let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {           // undo PNG row filters
    const f = raw[y * (stride + 1)], line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? line[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
      const paeth = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      line[x] = (line[x] + [0, a, b, (a + b) >> 1, paeth][f]) & 255;
    }
    rows.push(line); prev = line;
  }
  const out = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const s = rows[y].subarray(x * bpp, x * bpp + bpp), o = y * (size * 4 + 1) + 1 + x * 4;
    out[o] = s[0]; out[o + 1] = s[1]; out[o + 2] = s[2]; out[o + 3] = bpp === 4 ? s[3] : 255;
  }
  const chunk = (t, d) => { const c = Buffer.alloc(12 + d.length); c.writeUInt32BE(d.length, 0); c.write(t, 4, 'ascii'); d.copy(c, 8); c.writeUInt32BE(crc(Buffer.concat([Buffer.from(t), d])), 8 + d.length); return c; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([buf.subarray(0, 8), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(out)), chunk('IEND', Buffer.alloc(0))]);
}
function crc(b) { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); } return ~c >>> 0; }
