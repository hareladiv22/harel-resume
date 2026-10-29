// Dev-only helper: screenshot a local HTML file with the Chrome (or Edge) already installed.
// No npm packages. Used by make-og.mjs and make-icons.mjs.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
];

export function findChrome() {
  const exe = process.env.CHROME || CANDIDATES.find(p => fs.existsSync(p));
  if (!exe) throw new Error('Chrome/Edge not found. Set the CHROME environment variable to its path.');
  return exe;
}

// Renders `html` (a file path, optional ?query) at width×height CSS px into `out` (PNG).
export function shot(html, query, width, height, out) {
  const url = pathToFileURL(path.resolve(html)).href + (query || '');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'shot-'));
  execFileSync(findChrome(), [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--user-data-dir=${profile}`,
    '--allow-file-access-from-files',      // lets the page load fonts from ../public/fonts
    '--virtual-time-budget=3000',          // wait for fonts before the screenshot
    `--window-size=${width},${height}`,
    `--screenshot=${path.resolve(out)}`, url,
  ], { stdio: 'ignore' });
  fs.rmSync(profile, { recursive: true, force: true });
  return fs.statSync(out).size;
}
