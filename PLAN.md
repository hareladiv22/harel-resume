# Harel Adiv: Interactive Resume. Complete Build Spec

> **Who reads this:** Claude Code (or another AI coding agent), working in this folder on Harel's computer.
> **Who owns the project:** Harel Adiv. Beginner in JavaScript, speaks Hebrew, reviews every phase.
> **This one file is the whole project.** It holds the full spec, the complete starting code (Appendix A), and the templates for `CLAUDE.md` and `PROGRESS.md` (Appendices B and C). Nothing else is needed.
> **Goal:** take the site from the starting code to a launched, robust, free-to-run v1, **without guessing**. When you need something only Harel can give or do, stop and ask him using the protocol in §1.
>
> **להראל:** שמים את הקובץ הזה בתיקייה ריקה (למשל `harel-resume`), פותחים אותה ב-VS Code, מפעילים Claude Code וכותבים: `קרא את PLAN.md והתחל`.
> **Target:** launch within 1–2 weeks.
> **Spec date:** 2026-10-29. Prices and third-party details in §3 were verified on this date.

---

## Contents

1. How to work with Harel (protocol, stop points)
2. Working rules
3. Zero-cost policy
4. What we're building (goal, scope, decisions)
5. Source facts (the only facts you may use)
6. Current state of the code
7. Design system (keep it consistent)
8. Target architecture (files, configs, content.json)
9. Phases & tasks (with acceptance criteria and stop points)
10. Edge-case matrix
11. Content length limits
12. Owner guides in Hebrew (send these to Harel at the right moment)
13. Definition of done
14. Later (v2)
15. Appendix A: starting code
16. Appendix B: CLAUDE.md
17. Appendix C: PROGRESS.md

---

## 1. How to work with Harel

### 1.1 Language
- **Talk to Harel in Hebrew.** Short, plain sentences. No jargon without a one-line explanation.
- **Code, comments, commit messages, file names, and this spec stay in English.**

### 1.2 Session start
**Very first session:** if `public/index.html` doesn't exist, the folder holds only this file. Do **P0.0 (bootstrap)** first.

Every session:
1. Read `PLAN.md` (this file) and `PROGRESS.md`.
2. Find the first unchecked task in `PROGRESS.md`.
3. Tell Harel in Hebrew, in 2–3 lines: where we are, what you'll do now, and whether you need anything from him.

### 1.3 When you need Harel: the `NEEDS HAREL` block
Stop and write exactly this structure (Hebrew inside):

```
🛑 NEEDS HAREL: <short title in Hebrew>
למה: <one sentence: why you can't continue without him>
מה לעשות:
1. ...
2. ...
מה לשלוח לי: <exactly what to reply with, e.g. "את הלינק המלא ללינקדאין">
בינתיים אני: <what you'll work on meanwhile, or "ממתין">
```

Rules:
- One block per need. Don't bury questions inside long text.
- Use the ready-made guides in §12 for the "מה לעשות" steps when one exists.
- If other tasks don't depend on the answer, continue with them meanwhile and say which.
- Never guess facts, copy, URLs or keys to avoid asking.

### 1.4 Decide yourself vs. ask

| Decide yourself (then mention it in the summary) | Always ask Harel first |
|---|---|
| Code structure, naming, refactors inside the spec | Any change to resume copy or numbers |
| Pixel spacing, sizes, z-index, small visual details that follow §7 | Adding any dependency, tool or third-party script |
| Order of sub-steps within a task | Anything that could cost money (§3) |
| Fixing bugs you find (log them in PROGRESS.md) | Creating accounts, connecting services, pushing to GitHub the first time |
| Wording of code comments and README technical parts | Merging to `main` (= publishing to production) |
| | Deleting files Harel created |
| | Anything this spec doesn't cover, or where it conflicts with reality |

### 1.5 Stop points (mandatory)
Each phase ends with a **STOP**: summarize in Hebrew, give Harel the preview link or local steps to look, list anything you need, and wait for approval before merging or starting the next phase. Stop points are marked `⏸ STOP` in §9.

### 1.6 After each task
1. Commit (see §2).
2. Tick the task in `PROGRESS.md`, add a one-line note (date, what changed, anything left open).
3. Tell Harel in Hebrew, 2–4 lines: what changed and how to see it.

---

## 2. Working rules

1. Follow the phases and tasks **in order**. Don't skip acceptance criteria (AC).
2. **Stack is fixed:** plain HTML, CSS and JavaScript (ES modules allowed in tooling only). No frameworks, bundlers or TypeScript.
3. **The deployed site has zero npm dependencies.** The root `package.json` has **no** `dependencies` or `devDependencies`. Optional dev tools live in `tools/` with their own `package.json` (§8.1), are never installed on Vercel, and each one needs Harel's approval.
4. **Never change resume copy** on your own. If a task needs new copy, insert a `TODO:` placeholder (validation will block deploy until it's replaced) and ask Harel.
5. **Never commit secrets.** The PostHog project API key (`phc_...`) is a public client key and is fine in client code. Nothing else secret exists in this project.
6. **Don't copy code or design from `resume-wrapped.pages.dev`** or any other site. Original implementation only.
7. **Cross-platform:** Harel may be on Windows or macOS. Detect the OS at the first session. All scripts are Node (`.mjs`), not bash. Give Harel commands for his OS.
8. **Git:**
   - Default branch `main` = production. Never push to `main` without Harel's OK at a stop point.
   - One branch per phase: `phase-1`, `phase-2`, … Each push creates a Vercel Preview (after P1.4).
   - One commit per task: `P2.3: short summary`.
9. Keep the site working at the end of every task (no half-broken commits).
10. Comment non-obvious code in one or two lines. Harel must be able to follow it.
11. Accessibility and `prefers-reduced-motion` support must never regress.
12. Before declaring a task done, run its AC yourself where possible (local server, Node scripts, optional Playwright in §8.1). List the AC you could **not** check (e.g. real devices) so Harel checks them.

---

## 3. Zero-cost policy (hard requirement)

**Verified 2026-10-29. Re-check before launch (P6.4).**

| Service / tool | Plan | Cost | At the limit | Rules |
|---|---|---|---|---|
| GitHub | Free | $0 | n/a | No paid add-ons |
| Vercel | **Hobby** | $0, no card | Usage over free limits is **paused**, not billed | See below |
| PostHog | **Free plan** | $0, no card | Events over 1M/month are **dropped**, not billed | See below |
| Fonts: Fraunces, Space Grotesk | SIL OFL | $0 | n/a | License files in `public/fonts/` |
| Node.js, Git, VS Code, Live Server | Free | $0 | n/a | |
| Dev tools in `tools/` (optional) | Open source (MIT / Apache-2.0 / OFL) | $0 | n/a | Approval per tool |
| LinkedIn Post Inspector, opengraph.xyz, Lighthouse | Free | $0 | n/a | |

### Vercel Hobby rules
- Hobby is for **non-commercial, personal use only**. Vercel counts advertising the sale of a product or service as commercial use. A job-search resume fits Hobby. Therefore:
  - No offering services on the site: no "hire me for marketing", no prices, packages, client sign-ups, ads, affiliate or payment links.
  - The freelance work (H.A Digital Marketing) appears **only** as a resume entry.
  - If Harel asks for something that might be commercial, warn him and suggest he checks with Vercel Support before publishing.
- Never upgrade, start a Pro trial, or add a payment method.
- Don't enable Vercel Web Analytics, Speed Insights, Password Protection, or buy a domain. Not needed.
- No serverless functions, no Vercel Image Optimization. Static files only.

### PostHog free plan rules
- Free plan, **no credit card**. Without a card, usage stops at the limit: no surprise charges.
- Free plan includes **1 project**: use it for this site only.
- `autocapture: false`, `disable_session_recording: true`. About 12 events per visit, so 1M events ≈ 80,000 visits/month.

### The AI coding tool
- Claude Code is part of paid Claude plans (Pro / Max). If Harel already pays, this project adds no cost, provided:
  - When a usage limit is hit, **decline** any offer to continue with API credits; wait for the reset.
  - No `ANTHROPIC_API_KEY` environment variable is set (it switches billing to the API).
- **Agent: at the first session, check whether `ANTHROPIC_API_KEY` is set** (`node -e "console.log(!!process.env.ANTHROPIC_API_KEY)"`). If `true`, stop and warn Harel in Hebrew before doing anything else.

### Paid things that are out of scope
Custom domain (registrar fee, v2), any paid tier of any service, paid fonts/images/templates.

---

## 4. What we're building

### 4.1 Product
A story-style, tap-through interactive resume: one idea per full-screen slide, portrait 1080×1920 stage scaled to the screen.

- **Audience:** recruiters and hiring managers. They often open the link on **desktop**, from LinkedIn, email or WhatsApp, and skim.
- **Primary conversions:** CV download; contact (email, phone, WhatsApp, LinkedIn).
- **Secondary:** a memorable, professional impression.

### 4.2 Success criteria
- From **any slide**, on mobile and desktop, the CV is at most **one click** away.
- Every contact method opens correctly **and** can be copied.
- Harel can change any text by editing **one JSON file in the GitHub web UI**, and **a broken edit never takes the live site down**.
- Harel can see: visits, traffic source, how far people get, CV downloads, contact clicks.
- Total running cost: **$0**.

### 4.3 Non-goals (v1)
Hebrew or RTL; multiple languages; admin panel with login; backend, database or contact form; custom domain; print stylesheet.

### 4.4 Locked decisions

| Topic | Decision |
|---|---|
| Language | English only |
| Hosting | GitHub repo → Vercel Hobby, auto-deploy from `main`, previews from branches |
| URL | `https://<project-name>.vercel.app` (name chosen in P1.3) |
| Content editing | `public/content.json`, edited in GitHub web UI; validated on every deploy |
| Analytics | PostHog free, EU cloud, cookieless (`persistence: 'memory'`), no banner |
| Desktop | Centered portrait stage + side rails with navigation, CV and contact |
| Autoplay | Runs until the first manual interaction, then manual only for the visit |
| Fonts | Self-hosted |
| Phone number | Shown publicly (Harel's decision, spam risk accepted) |

---

## 5. Source facts

**These are the only facts you may use.** Source: Harel's CV PDF (2026) and his answers in chat. Anything else needs Harel.

- **Name:** Harel Adiv. **Title:** Product Manager.
- **Contact (public, approved):** email `Hareladiv@gmail.com`; phone `+972 52-403-4600` (`+972524034600`); WhatsApp same number. LinkedIn: **unknown → ask (blocker)**.
- **Experience:**
  - Oct 2025 – present: **Freelance, H.A Digital Marketing.** 10+ B2B/B2C clients; brand growth and ROI.
  - 2023 – 2025: **Product Manager, Boostapp.**
    - +30% new customer acquisition QoQ, by turning market research and direct user feedback into KPI-driven UX improvements, B2B and B2C.
    - +25% user satisfaction, by pivoting products on data-driven insights, optimizing roadmaps, applying Agile.
    - Strategic partnerships with competitive companies and industry-leading organizations (brand reputation, market engagement).
    - Go-to-market and product launches through cross-functional work with development, design, marketing, sales, customer support.
  - 2022 – 2023: **Senior Manager, Tic Tac Eilat Ltd.** Head of marketing; inventory management; international procurement; operational and strategic decisions; customer relationships; logistics; hands-on daily operations.
- **Education:** BBA in Management Information Systems, The College of Academic Studies, 2025 – 2028 (in progress). Courses: Product Management PM101 (Give & Tech); Front-End Development (Tapuach Organization); Google PPC & SEO (Udemy).
- **Volunteering:** Course instructor, Tapuach Organization. Taught teens web development (HTML, CSS, JavaScript) plus personal guidance and social development.
- **Skills:** AI (Claude, GPT and more), Python, HTML, CSS, JavaScript, SQL, Google Ads, GA4 & GTM, Excel, PMO, CSM. Agile and Scrum.
- **Languages:** Hebrew (native), English (fluent).
- **No NDA restrictions** on company names.
- **Not yet confirmed by Harel:** the "4+ years" figure (derived from 2022 → now). Ask in P0.

---

## 6. Starting code

The complete starting code is in **Appendix A**, already at its final paths. After P0.0 the folder looks like this:

```
public/index.html       shell: #stage, #bars, #slides, #prev, #next, #wipe, #live
public/css/styles.css   design tokens, themes t1–t7, slide styles, animations, reduced-motion
public/js/content.js    const NAME, const S = [...9 slides]  (replaced by content.json in P5)
public/js/app.js        renderers + navigation engine
public/assets/cv/       empty until Harel provides the CV
PLAN.md                 this file
CLAUDE.md               from Appendix B
PROGRESS.md             from Appendix C
.vscode/settings.json   Live Server root = /public
.vscode/extensions.json recommends Live Server
.gitignore              from §8.5
```

### 6.1 How the engine works today
- `fit()` scales the 1080×1920 `#stage` to `min(innerWidth/1080, innerHeight/1920)`, centered.
- Renderers `R.hero|words|stats|timeline|cards|contact` build each slide's HTML **with template strings and `innerHTML`** (content is not escaped).
- `show(n)`: toggles `.on` and `inert`, starts number count-up, updates `#live`, rebuilds progress bars (CSS animation `bar` for the current one, duration `--d`), starts `setTimeout` for autoplay.
- `go(n)`: plays the circular `#wipe`, then `show(n)` after 300 ms (`busy` guard).
- Input: tap zones `#prev` (left 35%) / `#next` (right 65%) starting 120px from top; arrow keys and Space; clicking bars; hold ≥300 ms pauses all animations via `document.getAnimations()`; horizontal swipe > 40px.
- Reduced motion: no autoplay, no wipe, everything visible.

### 6.2 Known defects (each is fixed by a task)

| Defect | Fixed in |
|---|---|
| Content in JS, not JSON; contact data duplicated | P5 |
| Content strings inserted unescaped | P2.12 |
| After hold-pause, timer restarts at a fixed 3 s; bar and timer disagree | P2.2 |
| Timers run in background tabs | P2.2 |
| `pointercancel` not handled: hold can stay paused (e.g. iOS system gesture) | P2.2 |
| Pointer-down on a link starts hold/swipe | P2.6 |
| Space always means "next", even on focused buttons; no modifier check | P2.4 |
| No URL state (refresh → slide 1, no deep links) | P2.3 |
| `viewport-fit=cover` without safe-area padding (notch overlap risk) | P2.7 |
| No desktop navigation hints, no CV button anywhere | P2.5, P3.1 |
| No WhatsApp link, no copy buttons | P2.9 |
| No no-JS / error fallback | P2.10 |
| Google Fonts from CDN | P2.11 |
| No OG tags, favicon, robots, sitemap, 404 | P1.2, P3 |
| `resize` only; iOS toolbar and rotation changes can mis-scale | P2.7 |
| LinkedIn URL placeholder | P0 (Harel) |
| No overflow protection for long text | P5.3, P5.4 |

---

## 7. Design system

Keep the existing look. New UI (rails, buttons, overlay, fallback, 404, OG image) must reuse these tokens.

- **Colors** (`:root`): `--navy #14123A`, `--vio #6C4BFF`, `--coral #FF6B57`, `--lime #D6FF5C`, `--cream #FFF6E8`. Page background outside the stage: `#07061c`.
- **Themes:** `t1` navy/violet/lime, `t2` cream/lime/violet (light), `t3` lime/coral/violet (light), `t4` violet/navy/lime, `t5` navy/coral/lime, `t6` cream/violet/coral (light), `t7` coral/cream/navy (light). Each sets `--a` (decor) and `--hi` (accent).
- **Fonts:** Fraunces 600 (headings), Fraunces 500 italic (emphasis, sub lines), Space Grotesk 500/700 (UI and body).
- **Motion:** easing `--e: cubic-bezier(.16,1,.3,1)`, pop `--pop: cubic-bezier(.34,1.56,.64,1)`. Entrance `rise` 0.85 s with stagger `var(--i)*.14s`. Animate only `transform` and `opacity`.
- **Shapes:** cards radius 40px (stage px); pills fully rounded; focus outline `4px solid var(--lime)`, offset 6px.
- **New controls outside the stage** (desktop rails): CSS px (not stage px), min hit area 44×44, cream text on the dark page background, accent `--lime`.

---

## 8. Target architecture

### 8.1 File tree (end state)

```
/
├─ public/                      ← everything Vercel serves
│  ├─ index.html
│  ├─ 404.html
│  ├─ content.json              ← the ONLY file Harel edits for text
│  ├─ robots.txt
│  ├─ sitemap.xml
│  ├─ favicon.ico, icon.svg, apple-touch-icon.png
│  ├─ css/styles.css
│  ├─ js/app.js                 ← engine (loads content.json)
│  ├─ js/analytics.js           ← PostHog loader + track() wrapper
│  ├─ fonts/*.woff2 + OFL.txt files
│  └─ assets/
│     ├─ cv/Harel-Adiv-CV.pdf
│     ├─ og.png                 (1200×630)
│     ├─ qr.png, qr.svg
├─ scripts/
│  └─ validate-content.mjs      ← Vercel build step; Node built-ins only
├─ tools/                       ← optional dev-only helpers, never deployed
│  ├─ package.json              (devDependencies, each approved by Harel)
│  ├─ copy-fonts.mjs
│  ├─ make-qr.mjs
│  ├─ make-og.mjs
│  ├─ og.html                   (1200×630 template for the OG image)
│  └─ screenshots.mjs           (Playwright checks)
├─ package.json                 ← no dependencies
├─ vercel.json
├─ README.md                    ← Hebrew owner guide (§12 content)
├─ PLAN.md, PROGRESS.md, CLAUDE.md
├─ .vscode/settings.json, .vscode/extensions.json
└─ .gitignore
```

### 8.2 `package.json` (root)

```json
{
  "name": "harel-resume",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/validate-content.mjs",
    "check": "node scripts/validate-content.mjs"
  }
}
```

### 8.3 `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    },
    {
      "source": "/assets/cv/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    },
    {
      "source": "/content.json",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    }
  ]
}
```
CSP is added in P2.13 after everything else works. Verify all keys against Vercel docs when implementing; fix if the schema changed.

### 8.4 `.vscode/settings.json`

```json
{ "liveServer.settings.root": "/public" }
```
Reason: `fetch('/content.json')` and absolute asset paths only work when the server root is `public/`. Opening `index.html` by double-click (`file://`) won't work after P5; README must say so.

### 8.5 `.gitignore`

```
.DS_Store
Thumbs.db
node_modules/
tools/node_modules/
tools/out/
.vercel
```

### 8.6 `public/content.json` (target, complete)

This is the current content converted to the new schema. Use it **as is**. `TODO` values are intentional: validation blocks deploy until Harel replaces them.

```json
{
  "meta": {
    "name": "Harel Adiv",
    "title": "Product Manager",
    "tagline": "Product Manager. Agile, data-driven, and hands-on with AI.",
    "siteUrl": "TODO: https://<project-name>.vercel.app",
    "email": "Hareladiv@gmail.com",
    "phone": "+972524034600",
    "phoneDisplay": "+972 52-403-4600",
    "whatsapp": "972524034600",
    "linkedin": "TODO: https://www.linkedin.com/in/...",
    "cv": "/assets/cv/Harel-Adiv-CV.pdf",
    "cvFileName": "Harel-Adiv-CV.pdf"
  },
  "slides": [
    {
      "type": "hero", "theme": "t1", "light": false, "d": 6,
      "lines": ["Hi, I’m", "<em>Harel</em>", "<em>Adiv.</em>"],
      "sub": "Product Manager. Agile, data-driven, and hands-on with AI.",
      "cta": "Tap to explore →"
    },
    {
      "type": "words", "theme": "t2", "light": true, "d": 10,
      "items": [
        { "w": "Think", "t": "Market research and user feedback come first." },
        { "w": "Build", "t": "Roadmaps shaped by data, shipped with Agile." },
        { "w": "Grow", "t": "Go-to-market, partnerships and ROI." }
      ]
    },
    {
      "type": "stats", "theme": "t3", "light": true, "d": 8,
      "h": "By the<br><em>numbers.</em>",
      "items": [
        { "pre": "+", "n": 30, "dec": 0, "suf": "%", "l": "New customer acquisition, quarter over quarter", "s": "Boostapp · B2B and B2C" },
        { "pre": "+", "n": 25, "dec": 0, "suf": "%", "l": "User satisfaction", "s": "Boostapp · data-driven product pivots" },
        { "pre": "", "n": 10, "dec": 0, "suf": "+", "l": "B2B and B2C clients managed", "s": "Freelance digital marketing" },
        { "pre": "", "n": 4, "dec": 0, "suf": "+", "l": "Years across product, marketing and operations", "s": "2022 – now" }
      ]
    },
    {
      "type": "timeline", "theme": "t4", "light": false, "d": 11,
      "h": "The <em>path.</em>",
      "items": [
        { "when": "2022 – 2023", "name": "Tic Tac Eilat Ltd", "text": "Senior Manager. Marketing, inventory, international procurement and logistics, plus hands-on support for daily operations." },
        { "when": "2023 – 2025", "name": "Boostapp", "text": "Product Manager. Turned research and user feedback into KPI-driven UX improvements and ran go-to-market across teams." },
        { "when": "Oct 2025 – now", "name": "H.A Digital Marketing", "text": "Freelance. A portfolio of 10+ B2B and B2C clients, driving brand growth and ROI." },
        { "when": "2025 – 2028", "name": "BBA, Management Information Systems", "text": "The College of Academic Studies." }
      ]
    },
    {
      "type": "cards", "theme": "t5", "light": false, "d": 11,
      "h": "Three <em>moments.</em>",
      "items": [
        { "tag": "Boostapp", "title": "Growing new customers", "text": "Turned market research and direct user feedback into KPI-driven UX improvements for B2B and B2C.", "big": "+30% QoQ" },
        { "tag": "Boostapp", "title": "Raising user satisfaction", "text": "Pivoted products based on data-driven insights and kept the roadmap tight with Agile.", "big": "+25%" },
        { "tag": "Freelance", "title": "Serving many clients at once", "text": "Managing a diverse B2B and B2C portfolio, focused on brand growth and ROI.", "big": "10+ clients" }
      ]
    },
    {
      "type": "cards", "theme": "t6", "light": true, "d": 10,
      "h": "Always<br><em>learning.</em>",
      "items": [
        { "tag": "2025 – 2028 · Degree", "title": "BBA, Management Information Systems", "text": "The College of Academic Studies" },
        { "tag": "Course", "title": "Product Management (PM101)", "text": "Give & Tech" },
        { "tag": "Course", "title": "Front-End Development", "text": "Tapuach Organization" },
        { "tag": "Course", "title": "Google PPC & SEO", "text": "Udemy" }
      ]
    },
    {
      "type": "cards", "theme": "t1", "light": false, "d": 10,
      "h": "What I <em>bring.</em>",
      "items": [
        { "tag": "Product", "title": "Roadmaps · Agile · Scrum · PMO", "text": "Boostapp, Product Manager" },
        { "tag": "Data", "title": "SQL · Excel · GA4 & GTM", "text": "KPI-driven decisions" },
        { "tag": "Growth", "title": "Google Ads · PPC & SEO · CSM", "text": "Freelance, 10+ clients" },
        { "tag": "AI & code", "title": "Claude · GPT · Python · HTML, CSS, JS", "text": "Hands-on with AI tools and front-end code" }
      ]
    },
    {
      "type": "cards", "theme": "t7", "light": true, "d": 8,
      "h": "Off the clock,<br><em>still curious.</em>",
      "items": [
        { "tag": "Volunteering", "title": "Teaching teens to code", "text": "Course instructor at Tapuach Organization: web development (HTML, CSS, JavaScript) plus personal guidance." },
        { "tag": "Languages", "title": "Hebrew & English", "text": "Hebrew native, English fluent." }
      ]
    },
    {
      "type": "contact", "theme": "t4", "light": false, "d": 8,
      "h": "Let’s <em>talk.</em>",
      "sub": "Hiring, collaborating, or just curious? My inbox is open.",
      "privacyNote": "Anonymous, cookie-free analytics."
    }
  ]
}
```

**Schema rules** (enforced by `validate-content.mjs`, P5.3):
- `meta`: all fields required. `email` valid; `phone` digits with leading `+`; `whatsapp` digits only, no `+`; `linkedin` starts with `https://www.linkedin.com/in/`; `siteUrl` starts with `https://`, no trailing slash; `cv` file exists under `public/`.
- `slides[]`: `type` ∈ {hero, words, stats, timeline, cards, contact}; `theme` ∈ t1–t7; `light` boolean; `d` integer 4–15.
- Exactly one `hero` (first) and one `contact` (last).
- Per-type fields and item counts: §11.
- Allowed inline markup in text: `<em>…</em>` and `<br>` only.
- Forbidden anywhere: `TODO`, `your-handle`, `example.com`, `[`…`]` placeholders, `<` other than allowed tags.
- The contact slide's rows (email, phone, WhatsApp, LinkedIn) are generated from `meta`; contact data must not appear elsewhere in `slides`.

---

## 9. Phases & tasks

Dependency overview:

```
P0 (setup, Harel inputs) → P1 (repo, first deploy) → P2 (engine & UX) → P3 (CV & sharing)
                                                          ↘ P4 (analytics, needs PostHog key)
P5 (JSON + validation) can start after P2.12 (safe rendering) → P6 (QA, launch)
If time runs short: launch after P3, continue P4–P6 on the live site.
```

---

### Phase 0: Environment & inputs (Day 1, ~1 hour)

**P0.0 Bootstrap (first session only).** The folder starts with only `PLAN.md`.
1. Create every file in **Appendix A** at the exact path shown, with the exact content. Copy byte for byte: don't reformat, rename or "improve" anything yet.
2. Create `.gitignore` from §8.5, `CLAUDE.md` from **Appendix B**, `PROGRESS.md` from **Appendix C**.
3. Create `public/assets/cv/.gitkeep` (empty).
4. Tell Harel in Hebrew how to preview: install the recommended **Live Server** extension, then right-click `public/index.html` → **Open with Live Server** (or click **Go Live** in the status bar).
- AC: `node --check public/js/app.js` and `node --check public/js/content.js` pass (if Node isn't installed yet, do this right after P0.1).
- AC: The preview shows 9 slides with Harel's content; tap, swipe, arrows, hold-to-pause and autoplay work; no console errors.

**P0.1 Check the environment.** Detect OS. Check `git --version`, `node -v` (need ≥ 18), `npm -v`, and whether `gh` (GitHub CLI) exists and is logged in (`gh auth status`). Check `ANTHROPIC_API_KEY` (§3).
- Missing Node or Git → `NEEDS HAREL` with guide §12.1.
- `gh` is optional (free). If missing, offer it once (guide §12.2); if Harel declines, use the GitHub web route.

**P0.2 Collect inputs from Harel.** One `NEEDS HAREL` block asking for all of these at once:
1. **LinkedIn URL** (full). Blocker for launch.
2. **Corrected CV PDF** saved as `Harel-Adiv-CV.pdf`, then put into `public/assets/cv/` (or tell you its path). Ask him to fix first: `Senior Maneger` → `Senior Manager`, `Im` → `I'm`, `Linkdin` → `LinkedIn` with a real link. Blocker for P3.1.
3. **Confirm the "4+ years" stat** (or give the number he wants).
4. **Vercel project name** → becomes the URL `https://<name>.vercel.app`. Suggest `harel-adiv`. Explain: hard to change later (printed QR, shared links).
5. **GitHub repo visibility:** private (recommended) or public.
6. Optional: 1–2 personal hobbies for "Off the clock".

Continue with P1.1 while waiting.

---

### Phase 1: Repo & first deploy (Day 1)

**P1.1 Project scaffolding (§8.1).**
- Add root `package.json` (§8.2), but with `"build": "node -e \"process.exit(0)\""` until P5.3 (cross-platform; no `echo`).
- Add `vercel.json` (§8.3).
- Write `README.md` in Hebrew from §12 (local preview, structure, editing, deploy). Keep it short and extend it as features land.
- AC: Live Server still shows the site exactly as after P0.0. No console errors.

**P1.2 `404.html`.** Site colors and fonts, message "This page doesn't exist." and a link back to `/`. Self-contained (inline CSS ok).
- AC: Opening `/nope` locally with Live Server isn't representative; verify on Vercel preview in P1.4.

**P1.3 Git init and first commit** on `main` with everything from P1.1–P1.2. Then create the GitHub repo:
- With `gh` and Harel's OK: `gh repo create <name> --private|--public --source . --push`.
- Without `gh`: `NEEDS HAREL`, guide §12.3; then `git remote add origin …` and `git push -u origin main` (Harel may need to sign in once; guide covers it).
- AC: Repo on GitHub contains the files; `main` is default.

**P1.4 Connect Vercel.** `NEEDS HAREL`, guide §12.4 (Hobby, no card, import repo, project name from P0.2, framework "Other", leave settings from `vercel.json`).
- AC: Production URL loads the site. A push to a branch creates a Preview URL. Preview responses include `X-Robots-Tag: noindex` (check with `curl -I <preview-url>`; if absent, note it in PROGRESS and continue: `robots` meta on previews is v2).
- AC: `/nope` on production shows `404.html`.
- Record the production URL in `content.js` (temporary) and later in `meta.siteUrl`.

⏸ **STOP 1:** Harel opens the production URL on his phone and computer. Approve → start Phase 2 on branch `phase-2`.

---

### Phase 2: Robust engine & UX (Days 2–4)

Implement in `public/js/app.js` and `public/css/styles.css` unless stated. Keep the existing visual design.

**P2.1 Autoplay policy.**
- Autoplay at load **only if**: not `prefers-reduced-motion`, and not opened with a deep link (P2.3).
- **First manual interaction** (tap zone, swipe, key, bar click, rail buttons) sets `autoplay = false` for the rest of the visit (in memory, no storage).
- When autoplay is off: no timers; bars show past = filled, current = filled with a subtle highlight (no running animation), future = empty.
- Last slide never auto-advances.
- AC: Load and wait → slides advance. Tap once → no auto-advance ever after, even after 30 s.

**P2.2 Pause/resume with remaining time.**
- Track `slideStart` and `elapsed` per slide. Pause = `clearTimeout`, pause animations (`document.getAnimations()`), store elapsed. Resume = timer for `d − elapsed`, play animations.
- Pause triggers: hold ≥ 300 ms (pointer), `visibilitychange` → hidden, Space while autoplay is on (P2.4). Resume: release, visible again, Space.
- Handle `pointercancel` and `lostpointercapture` like release. A hold never also navigates on release.
- If autoplay is off, pausing still freezes animations, but there's no timer.
- AC: `d=8`, hold at 3 s for 5 s, release → advances ~5 s later; bar end and advance coincide (±150 ms).
- AC: Switch tabs for 20 s, return → same slide, resumes from where it was.

**P2.3 URL state & deep links.**
- On slide change: `history.replaceState(null, '', location.pathname + location.search + '#' + (index + 1))`. Not `pushState` (Back must leave the site, not step through slides).
- On load: `#1`…`#N` → open that slide, autoplay off. Invalid (`#0`, `#99`, `#abc`, `#2.5`) → slide 1, clean the hash.
- `hashchange` → navigate (counts as manual).
- AC: Refresh on slide 5 stays on 5. `/#99` → slide 1, hash `#1`. `/#4` → slide 4, no autoplay.

**P2.4 Keyboard.**

| Key | Action |
|---|---|
| `→`, `PageDown` | next |
| `←`, `PageUp` | previous |
| `Home` / `End` | first / last |
| `Space` | autoplay on → toggle pause; autoplay off → next |

- Ignore if `ctrlKey`, `metaKey` or `altKey`.
- If focus is on `a`, `button`, `input`, `textarea` or `[contenteditable]`, do nothing for `Space`/`Enter` (native activation).
- `preventDefault` only on handled keys.
- AC: Tab to a CV button + Space → PDF opens, slide unchanged. `Cmd/Ctrl + →` → browser default.

**P2.5 Desktop rails.**
- Condition: `(orientation: landscape)` and each free side area (`(innerWidth − stageWidth) / 2`) ≥ 220 px. Recompute on resize.
- Rails are **outside** `#stage` (fixed elements in `body`, not scaled):
  - **Left rail:** "Previous" button (←), slide counter `3 / 9`, hint "Use ← → keys".
  - **Right rail:** "Next" button (→), **Download CV** (primary, lime), **Email** (mailto + copy), **LinkedIn**.
- Vertically centered, 44×44 min hit areas, design per §7. Rail buttons count as manual interaction.
- When rails are hidden (mobile, narrow windows): a **CV icon button** inside the stage, top-right under the progress bars, above the tap zones (z-index), on every slide except the contact slide (which has its own CV button).
- AC (screenshots): 1440×900, 1280×720, 1920×1080, 1024×768, 390×844, 360×740, 820×1180. Nothing overlaps the stage; nothing is cut; CV reachable in one click everywhere.

**P2.6 Interactive elements beat tap zones.**
- Links and buttons inside slides sit above `#prev/#next` (z-index) and are fully clickable.
- `pointerdown` whose target is inside `a, button` doesn't start hold or swipe tracking.
- Clicking the stage itself (not a link) still uses the tap zones.
- AC: Every link on every slide works on first tap, mobile and desktop.

**P2.7 Viewport, touch and safe areas.**
- Remove `viewport-fit=cover` from the viewport meta (simplest way to avoid notch overlap), **or** keep it and pad with `env(safe-area-inset-*)`. Choose one; document why.
- Re-fit on `resize`, `orientationchange`, and `visualViewport` `resize` (iOS toolbars).
- `touch-action: manipulation` on the stage; `-webkit-touch-callout: none; user-select: none` on the stage **except** contact values (`user-select: text`).
- Swipe: |dx| > 40 and |dx| > |dy|. Vertical gestures do nothing. Keep `overscroll-behavior: none`.
- AC: No content under the notch or home indicator (iPhone, Safari and in-app). Quick double-tap advances two slides without zoom. Long-press on contact values allows selection.

**P2.8 Small landscape phones.**
- If `(pointer: coarse)` and `innerHeight < 500` and landscape: overlay "Rotate your phone for the best view" + **Continue anyway** button (dismisses for the visit). Rotating to portrait removes it.
- AC: iPhone landscape shows it; Continue hides it; portrait never shows it.

**P2.9 Contact slide & copy.**
- Contact rows built from `meta` (in P5; until then from `content.js`): Email (`mailto:`), Phone (`tel:`), WhatsApp (`https://wa.me/<whatsapp>`), LinkedIn. Each row: open link + **Copy** button.
- Copy: `navigator.clipboard.writeText` with fallback (hidden textarea + `document.execCommand('copy')`). Button shows "Copied" for 2 s; announce via `#live`.
- Contact slide also has a large **Download CV** button and the `privacyNote` line (small, 60% opacity).
- `mailto:` and `tel:` links without `target="_blank"`; external links with `target="_blank" rel="noopener"`.
- AC: Desktop Chrome: Copy email → clipboard has `Hareladiv@gmail.com`. WhatsApp opens chat with the right number.

**P2.10 No-JS and error fallback.**
- `<noscript>` and a hidden `#fallback` section in `index.html`: name, title, tagline, email, phone, WhatsApp, LinkedIn, CV link. Simple, readable, styled with site tokens, works without JS.
- Show `#fallback` (and hide the stage) if the engine throws during init or `content.json` fails (P5.2). **Never a blank page.**
- These static values duplicate `meta` → validation checks they match (P5.3).
- AC: JS disabled → fallback. Engine forced to throw → fallback.

**P2.11 Self-hosted fonts.**
- Get Fraunces (600 normal, 500 italic) and Space Grotesk (500, 700) as Latin `woff2` from the Fontsource packages (`@fontsource/fraunces`, `@fontsource/space-grotesk`, OFL) via `tools/copy-fonts.mjs` (**ask Harel to approve** `tools/` devDependencies first). Verify file names after install. Copy the OFL license files too. Commit the font files; the deployed site never installs packages.
- `@font-face` in `styles.css` with `font-display: swap`; keep fallbacks (`Georgia, serif` / `system-ui, sans-serif`); add `size-adjust` or fallback metrics if text visibly jumps.
- Remove Google Fonts `<link>` and `preconnect`.
- Fallback if Harel declines tools: download the same files manually from the official Google Fonts download (both fonts are OFL) — give him guide steps.
- AC: No requests to Google domains. No visible layout jump.

**P2.12 Safe rendering.**
- A small `escapeHTML()` plus `richText()` that escapes everything, then re-allows only `<em>`, `</em>`, `<br>`.
- URLs only from `meta` and only `https:`, `mailto:`, `tel:`.
- Replace inline `style="--i:…"` attributes with setting `el.style.setProperty('--i', …)` after render (needed for CSP in P2.13).
- AC: Content `<img src=x onerror=alert(1)>` shows as text; no alert.

**P2.13 Content Security Policy.**
- Add to `vercel.json` headers for `/(.*)`:
  `default-src 'self'; script-src 'self' https://eu-assets.i.posthog.com; connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com; img-src 'self' data:; style-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'`
- Adjust only if something breaks, and explain why (e.g. if PostHog needs another host, take it from the console error).
- AC: Preview deploy, full click-through: zero CSP violations in the console (with and without analytics).

⏸ **STOP 2:** Preview URL to Harel with a Hebrew test list (autoplay stops after tap; pause; refresh keeps slide; desktop rails; copy buttons; WhatsApp). Approve → merge `phase-2` to `main`.

---

### Phase 3: CV & sharing (Days 4–5)

**P3.1 CV download everywhere.**
- Buttons: hero slide (secondary style, under the CTA), contact slide (primary), desktop rail, mobile icon (P2.5).
- `href=meta.cv`, `download=meta.cvFileName`, `target="_blank" rel="noopener"`.
- iOS Safari and in-app browsers may open the PDF inline instead of downloading: acceptable.
- Replacing the PDF: same file name; headers (§8.3) make the new version appear after deploy.
- AC: CV opens or downloads on every device in P6.1. After replacing the file and redeploying, a normal reload shows the new one.

**P3.2 Meta tags, Open Graph, icons.** In `index.html` (static: crawlers don't run JS):
- `<html lang="en">`, `<title>Harel Adiv · Product Manager</title>`, description (tagline), `<link rel="canonical" href="{siteUrl}/">`, `theme-color #14123A`.
- `og:title`, `og:description`, `og:url`, `og:type=website`, `og:image={siteUrl}/assets/og.png` (**absolute**), `og:image:width 1200`, `og:image:height 630`, `og:image:alt`, `twitter:card=summary_large_image`.
- Icons: `favicon.ico` (32), `icon.svg`, `apple-touch-icon.png` (180). Design: Harel's initials "HA" in Fraunces on navy with a lime dot.
- **OG image** `public/assets/og.png`, 1200×630, < 300 KB: navy background, "Harel Adiv" (Fraunces 600), "Product Manager" (Space Grotesk), lime accent shape, nothing within 60 px of the edges.
  - Preferred: `tools/og.html` + `tools/make-og.mjs` rendering it with Playwright (Apache-2.0, dev-only; **ask Harel**, Chromium download ~150 MB).
  - Fallback: Harel opens `tools/og.html` in Chrome and captures a screenshot (guide §12.8).
- Harel approves the OG image before merge.
- AC: Correct preview on LinkedIn Post Inspector, in a WhatsApp message to himself, and on opengraph.xyz.

**P3.3 Traffic-source links.**
- `?ref=` values: `linkedin`, `cv`, `whatsapp`, `email`, `qr`. Unknown values → `other`.
- On load: read `ref`, store in memory for analytics, remove it from the URL with `replaceState` (keep the hash).
- README: table of which link to use where (§12.9).
- AC: `/?ref=linkedin#3` → URL becomes `/#3`, `deck_view` carries `ref: "linkedin"`.

**P3.4 QR code.**
- `tools/make-qr.mjs` using the `qrcode` package (MIT, dev-only, **ask Harel**) → `public/assets/qr.svg` and `qr.png` (1024 px, error correction M) for `{siteUrl}/?ref=qr`. The QR must encode the site URL directly (no third-party redirect service).
- Warn Harel (Hebrew): print the QR only once the URL is final; never rename the Vercel project after printing.
- AC: Phone camera scans `qr.png` and opens the site.

**P3.5 Search engines.**
- `robots.txt`: allow all, `Sitemap: {siteUrl}/sitemap.xml`. `sitemap.xml` with one URL.
- AC: Both return 200 on production.

⏸ **STOP 3:** Harel approves OG image and checks previews in LinkedIn and WhatsApp (guide §12.7). Merge → **the site is launchable here** if time runs short.

---

### Phase 4: Analytics (Days 6–7). Needs PostHog key.

**P4.0** `NEEDS HAREL`: PostHog account and project key (guide §12.5). Meanwhile build P4.1–P4.3 with the key as an empty constant (analytics inert when empty).

**P4.1 `public/js/analytics.js`.**
- Load PostHog with the **official HTML snippet copied from PostHog's current docs** (not from memory), adapted into this file (no inline `<script>`).
- Load only if: key not empty, `location.hostname` equals the production host, not `notrack` (P4.3).
- Config: `api_host: 'https://eu.i.posthog.com'`, `persistence: 'memory'`, `autocapture: false`, `capture_pageview: false`, `capture_pageleave: false`, `disable_session_recording: true`. Check current option names in PostHog docs.
- Export `track(name, props)`: no-op if not loaded; wrapped in try/catch. The site must behave identically when PostHog is blocked or fails.
- AC: Ad blocker on → site works, no uncaught errors. Localhost and preview → no PostHog requests.

**P4.2 Events.** No personal data (never email, phone or IP-derived info) in properties.

| Event | Properties | When |
|---|---|---|
| `deck_view` | `ref`, `device` (`mobile` if `(pointer: coarse)` else `desktop`), `start_slide` | once on load |
| `slide_view` | `index` (1-based), `type`, `mode` (`auto`/`manual`) | each slide shown |
| `deck_complete` | `total_ms` | first time the last slide shows |
| `cv_download` | `source` (`hero`/`contact`/`rail`/`icon`/`fallback`) | CV click |
| `contact_click` | `type` (`email`/`phone`/`whatsapp`/`linkedin`), `action` (`open`/`copy`), `source` (`contact`/`rail`/`fallback`) | contact click or copy |
| `deck_exit` | `last_index`, `total_ms` | `pagehide`; use PostHog's beacon transport option if available (check docs) |

**P4.3 Exclude Harel.** `/?notrack=1` → `localStorage.ha_notrack = '1'`; `/?notrack=0` → remove. Wrap storage in try/catch. Remove the param from the URL after reading. When set, analytics doesn't load.
- AC: With the flag, zero PostHog requests.

**P4.4 Optional proxy (ad blockers).** Only if < 1 hour and Harel agrees: `vercel.json` rewrite `/ingest/:path*` → `https://eu.i.posthog.com/:path*` and `/ingest/static/:path*` → `https://eu-assets.i.posthog.com/static/:path*` (check PostHog's current Vercel proxy guide), set `api_host: '/ingest'`, and tighten CSP to `'self'`. No functions; stays within Hobby. Otherwise → v2.

**P4.5 Owner dashboard.** Give Harel guide §12.6 (funnel, CV downloads by `ref`, contact by `type`). Add the steps to README.

⏸ **STOP 4:** Harel sets `notrack` on his devices; you send a test visit from another device (or Harel asks a friend); confirm events arrive in PostHog Activity.

---

### Phase 5: Content as JSON & safe editing (Days 7–9)

**P5.1 Move content to `public/content.json`** exactly as §8.6 (with `siteUrl` filled from P1.4 and LinkedIn from P0.2 if received). Delete `js/content.js`. Engine reads `theme`, boolean `light`; contact rows from `meta`.

**P5.2 Loading.** `fetch('/content.json', { cache: 'no-cache' })` → parse → render. Network or parse error → fallback (P2.10) and `console.error` with the reason.
- AC: Rename the file locally → fallback, not blank.

**P5.3 `scripts/validate-content.mjs`** (Node built-ins only), runs as the Vercel build:
- Parse JSON; on error print **line and column** and a Hebrew + English hint ("check for a missing comma or an unescaped quote").
- All schema rules in §8.6 and limits in §11. Each error: path (`slides[4].items[2].text`), problem, value excerpt.
- Cross-checks: `index.html` static values (canonical, OG URL/image, fallback email/phone/WhatsApp/LinkedIn/CV) equal `meta`; `robots.txt` and `sitemap.xml` use `meta.siteUrl`; `meta.cv` exists; no `TODO` anywhere in `public/` text files.
- Exit code 1 on any error, 0 otherwise. Vercel fails the build → **previous production stays live**.
- Update root `package.json` scripts to §8.2.
- AC: Missing comma → build fails with line/column; production unchanged. Text over limit → clear error. Fix → deploy succeeds.

**P5.4 Runtime overflow guard.** After rendering a slide, if its content's `scrollHeight` > available height, add `fit-1` then `fit-2` classes (each ~10% smaller type). Still overflowing → `console.warn('overflow', index)`.
- AC: A 300-char card text (local test only) stays on screen.

**P5.5 Owner editing guide.** README section from §12.10 (edit on GitHub, JSON rules, watching the deploy, reading errors, rolling back).

⏸ **STOP 5:** Harel makes one real edit in the GitHub web UI himself, following the guide, and one intentionally broken edit to see the build fail safely. Then merge.

---

### Phase 6: QA & launch (Days 9–10)

**P6.1 Device matrix** (Harel does real devices; you prepare a Hebrew checklist and do everything you can locally with Playwright if approved).

| Device | Browsers |
|---|---|
| iPhone | Safari, LinkedIn in-app, WhatsApp in-app |
| Android | Chrome, LinkedIn in-app, WhatsApp in-app |
| Desktop | Chrome, Edge, Firefox, Safari (Mac, if available) |

Per row: all slides render; nothing cut; tap / swipe / keys; pause; CV; each contact link and copy; `/#5`; refresh keeps slide; reduced motion (OS setting); rails (desktop).

**P6.2 Accessibility.** Keyboard-only run with visible focus; screen reader announces "Slide X of N" and reads content; hidden slides `inert`; contrast ≥ 4.5:1 body, ≥ 3:1 large text in **every theme** (check accents on cream and lime; adjust tokens if needed and tell Harel); reduced motion: no autoplay, no wipe.

**P6.3 Performance.** Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Page weight < 500 KB excluding the PDF. CLS ≈ 0.

**P6.4 Pre-launch checklist.**
- [ ] `npm run check` passes; no `TODO`.
- [ ] CV is the corrected latest PDF.
- [ ] Email, phone, WhatsApp, LinkedIn correct (open + copy).
- [ ] OG previews correct on LinkedIn and WhatsApp.
- [ ] PostHog receives events; Harel's devices excluded.
- [ ] 404, robots, sitemap OK.
- [ ] README up to date.
- [ ] **Cost audit:** Vercel Hobby, no payment method; PostHog free, no payment method; no paid add-ons; §3 re-checked against current pricing pages.
- [ ] **Commercial-use check:** no service offers, prices, ads or payment links.

**P6.5 Launch (Harel, guide §12.9).** LinkedIn Featured + profile link with `?ref=linkedin`; email signature with `?ref=email`; add the URL to the CV PDF with `?ref=cv`; QR only when URL is final.

⏸ **STOP 6:** Launch done. Write a final Hebrew summary: what's live, how to edit, how to check stats, what's in v2.

---

## 10. Edge-case matrix

| Scenario | Expected | Task |
|---|---|---|
| Recruiter taps once, reads slowly | Autoplay off for the visit | P2.1 |
| Background tab mid-slide | Paused; resumes with remaining time | P2.2 |
| Hold, then iOS system gesture cancels pointer | Resumes; no stuck pause | P2.2 |
| Hold then release | No accidental navigation | P2.2 |
| Refresh on slide 6 | Stays on 6 | P2.3 |
| `/#99`, `/#abc`, `/#0` | Slide 1, hash cleaned | P2.3 |
| Browser Back | Leaves the site (no slide history) | P2.3 |
| Space on focused button | Button activates; slide unchanged | P2.4 |
| Ctrl/Cmd + arrow | Browser default | P2.4 |
| Desktop 1920×1080 | Rails with nav, CV, contact | P2.5 |
| Narrow desktop window | Rails hidden, mobile CV icon | P2.5 |
| Tap on a link in a slide | Link opens; no slide change | P2.6 |
| iPhone with notch / home indicator | Nothing hidden | P2.7 |
| iOS toolbar collapses / rotation | Stage re-fits | P2.7 |
| Phone landscape | Rotate hint, Continue anyway | P2.8 |
| Desktop without mail app | Copy email works | P2.9 |
| `tel:` on desktop | Copy phone works | P2.9 |
| JS disabled | Readable fallback with CV & contact | P2.10 |
| Engine error / JSON fails | Fallback, never blank | P2.10, P5.2 |
| Network blocks Google Fonts | Irrelevant (self-hosted) | P2.11 |
| HTML in content | Shown as text | P2.12 |
| Injected third-party script | Blocked by CSP | P2.13 |
| `download` ignored (iOS, in-app) | PDF opens inline | P3.1 |
| PDF replaced, same name | New version after deploy | P3.1 |
| LinkedIn shows old preview | Re-scrape (guide §12.7) | P3.2 |
| Forwarded `?ref=` link | `ref` already stripped | P3.3 |
| URL changes after QR printed | Prevented: print only when final | P3.4 |
| Ad blocker blocks PostHog | Site unaffected; stats undercount | P4.1, P4.4 |
| Harel visits his own site | Not counted | P4.3 |
| Localhost / preview visits | Not counted | P4.1 |
| Storage blocked (private mode) | `notrack` silently ignored; site works | P4.3 |
| Invalid JSON committed | Build fails; previous site stays live | P5.3 |
| Placeholder left in content | Build fails with clear message | P5.3 |
| Static HTML and `meta` drift | Build fails | P5.3 |
| Text too long | Build error; runtime shrink as backup | P5.3, P5.4 |
| Site and PDF disagree | Harel updates both the same day (README rule) | P5.5 |
| `prefers-reduced-motion` | No autoplay, no wipe, all visible | P2.1, P6.2 |
| Vercel free limit exceeded | Paused temporarily; no bill | §3 |
| PostHog over 1M events | Extra events dropped; no bill | §3 |
| Claude Code usage limit | Wait for reset; decline API credits | §3 |
| `ANTHROPIC_API_KEY` set | Agent warns Harel before working | §3 |

---

## 11. Content length limits

Initial values. In P5.3, render each field at its limit with wide text (`W`/`M`) at 1080×1920 (Playwright if approved, otherwise manual check) and tune. Report changes to Harel. Current content fits all limits.

| Field | Max chars (tags excluded) | Count rule |
|---|---|---|
| `hero.lines[]` each | 12 | 2–4 lines |
| `hero.sub` | 90 | |
| `hero.cta` | 24 | |
| `words.items[].w` | 6 | exactly 3 items |
| `words.items[].t` | 60 | |
| `stats.items[].l` | 50 | 3–4 items; `n` number ≥ 0; `dec` 0–2; `pre`, `suf` ≤ 2 chars |
| `stats.items[].s` (optional) | 45 | |
| `timeline.items[].when` | 16 | 2–5 items |
| `timeline.items[].name` | 36 | |
| `timeline.items[].text` | 140 | |
| `cards.items[].tag` | 28 | 2–4 items |
| `cards.items[].title` | 40 | |
| `cards.items[].text` (optional) | 120 | |
| `cards.items[].big` (optional) | 12 | |
| slide `h` | 30 | required on stats, timeline, cards, contact |
| `contact.sub` | 90 | |
| `contact.privacyNote` | 50 | |
| `meta.tagline` | 90 | |

---

## 12. Owner guides (Hebrew)

Send the relevant guide inside a `NEEDS HAREL` block. Adjust for Harel's OS. Verify each external UI step against the current site if anything looks different, and tell Harel if it changed.

### 12.1 התקנת Node ו-Git
1. Node.js: נכנסים ל-nodejs.org ומורידים את גרסת **LTS**. מתקינים עם הגדרות ברירת המחדל.
2. Git: נכנסים ל-git-scm.com ומורידים לפי מערכת ההפעלה. מתקינים עם הגדרות ברירת המחדל.
3. סוגרים ופותחים מחדש את VS Code, ואומרים לי "הותקן".

### 12.2 GitHub CLI (אופציונלי, חינמי, חוסך עבודה)
1. נכנסים ל-cli.github.com ומתקינים.
2. בטרמינל של VS Code מריצים: `gh auth login` ובוחרים GitHub.com → HTTPS → Login with a web browser.
3. מאשרים בדפדפן, ואומרים לי "מחובר".

### 12.3 יצירת ריפו ב-GitHub (בלי CLI)
1. נכנסים ל-github.com → **New repository**.
2. שם: `<name>`. בוחרים **Private**. **לא** מסמנים README או .gitignore.
3. לוחצים **Create repository** ושולחים לי את הכתובת שמופיעה (מסתיימת ב-`.git`).
4. כשאריץ `git push`, ייתכן שתיפתח בקשת התחברות ל-GitHub. מאשרים.

### 12.4 חיבור ל-Vercel
1. נכנסים ל-vercel.com → **Sign Up** → **Continue with GitHub**. בוחרים **Hobby**. **לא** מזינים כרטיס אשראי ולא מפעילים ניסיון Pro.
2. **Add New → Project** → אם הריפו לא מופיע, לוחצים על ההגדרה שמאפשרת ל-Vercel לגשת לריפו ובוחרים רק אותו.
3. **Import**. שם הפרויקט: `<name>` (קובע את הכתובת).
4. Framework Preset: **Other**. את שאר ההגדרות לא משנים (הן בקובץ `vercel.json`).
5. **Deploy**. בסוף שולחים לי את הכתובת שמתקבלת.
6. ב-Settings לא מפעילים Analytics ולא Speed Insights.

### 12.5 PostHog
1. נכנסים ל-posthog.com → **Get started**. בוחרים **EU Cloud**. תוכנית חינמית, **בלי כרטיס אשראי**.
2. כשמבקשים לבחור פלטפורמה, אפשר לדלג (אני מחבר את הקוד).
3. ב-Project settings: מפעילים **Discard client IP data**.
4. מעתיקים את **Project API Key** (מתחיל ב-`phc_`) ושולחים לי. זה מפתח ציבורי, מותר לשלוח.
5. בכל דפדפן ומכשיר שלך, פותחים פעם אחת את האתר עם `?notrack=1` בסוף הכתובת, כדי שהביקורים שלך לא ייספרו.

### 12.6 לוח סטטיסטיקות ב-PostHog
1. **Insights → New → Funnel**: `deck_view` → `slide_view` (index = 3) → `deck_complete`. שומרים.
2. **Insights → New → Trends**: `cv_download`, פירוק לפי `ref`. שומרים.
3. **Trends**: `contact_click`, פירוק לפי `type`. שומרים.
4. **Dashboards → New**: מוסיפים את שלושתם.

### 12.7 בדיקת התצוגה המקדימה של הלינק
1. LinkedIn: נכנסים ל-linkedin.com/post-inspector, מדביקים את כתובת האתר, **Inspect**. אחרי כל שינוי בתמונה או בכותרת, לוחצים שוב כדי לרענן את המטמון.
2. WhatsApp: שולחים לעצמך את הלינק ובודקים שמופיעה תמונה, שם ותפקיד. (וואטסאפ שומר במטמון; בדיקה חוזרת עדיף לעשות עם `?v=2` בסוף הכתובת.)

### 12.8 צילום תמונת התצוגה המקדימה ידנית (רק אם לא התקנו את כלי הצילום)
1. פותחים את `tools/og.html` ב-Chrome.
2. F12 → Ctrl+Shift+P (במק Cmd+Shift+P) → מקלידים **Capture node screenshot** כשהאלמנט הראשי מסומן.
3. שומרים בשם `og.png` ושולחים לי, או שמים ב-`public/assets/`.

### 12.9 איזה לינק לשים איפה
| איפה | לינק |
|---|---|
| פרופיל ו-Featured בלינקדאין | `<siteUrl>/?ref=linkedin` |
| בתוך קובץ הקו"ח | `<siteUrl>/?ref=cv` |
| חתימת מייל | `<siteUrl>/?ref=email` |
| הודעות וואטסאפ | `<siteUrl>/?ref=whatsapp` |
| QR מודפס | `<siteUrl>/?ref=qr` (רק כשהכתובת סופית) |

### 12.10 עריכת תוכן באתר
1. ב-GitHub נכנסים לריפו → `public/content.json` → אייקון העיפרון.
2. משנים רק את הטקסט שבין המירכאות.
3. כללים: מירכאות כפולות ישרות `"`; מירכאה בתוך טקסט נכתבת `\"`; פסיק בין פריטים, בלי פסיק אחרי האחרון; `<em>` להדגשה ו-`<br>` לשבירת שורה, ותו לא.
4. **Commit changes** → בוחרים commit ישירות ל-`main`.
5. ב-Vercel → Deployments רואים אם הפרסום הצליח (Ready) או נכשל (Error). אם נכשל, האתר הקודם נשאר באוויר. לוחצים על הפרסום הכושל וקוראים את ההודעה: היא אומרת איפה הבעיה.
6. לחזור אחורה: ב-GitHub → History של הקובץ → Revert, **או** ב-Vercel → Deployments → פרסום קודם → **Promote to Production**.
7. כשמעדכנים את קובץ הקו"ח, מעדכנים את `content.json` באותו יום, ולהפך.
8. החלפת קו"ח: מעלים קובץ חדש **באותו שם** ל-`public/assets/cv/` (Add file → Upload files, Commit).

---

## 13. Definition of done (v1)

- All tasks P0–P6 ticked in `PROGRESS.md`, every AC passed or explicitly checked by Harel.
- `npm run check` passes on `main`; production deploy is green.
- Harel has: production URL, edited content once himself, seen his PostHog dashboard, set `notrack`.
- Cost audit passed (§3).
- README (Hebrew) matches reality.

---

## 14. Later (v2)

- **(Paid)** Custom domain, redirect from `vercel.app`, then print QR.
- Form-based admin (Decap or Sveltia CMS) + GitHub OAuth proxy. Verify the proxy host's free tier and no-card requirement first.
- Print stylesheet (Ctrl+P → one-page summary).
- PostHog proxy if skipped.
- `noindex` meta for previews if Vercel's header is missing.
- Hebrew version.

---

## 15. Appendix A: starting code

Create these files exactly. Paths are relative to the project folder.

### A.1 `public/index.html`

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Harel Adiv · Product Manager</title>
<meta name="description" content="Harel Adiv, Product Manager. Agile, data-driven, hands-on with AI. Interactive resume.">
<meta name="theme-color" content="#14123A">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,500&family=Space+Grotesk:wght@500;700&display=swap">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<main id="stage" aria-label="Interactive resume">
  <div class="bars" id="bars" aria-hidden="true"></div>
  <div id="slides"></div>
  <button class="nav" id="prev" aria-label="Previous slide"></button>
  <button class="nav" id="next" aria-label="Next slide"></button>
  <div id="wipe"></div>
  <div class="sr" id="live" aria-live="polite"></div>
</main>
<script src="js/content.js"></script>
<script src="js/app.js"></script>
</body>
</html>
```

### A.2 `public/css/styles.css`

```css
:root{--navy:#14123A;--vio:#6C4BFF;--coral:#FF6B57;--lime:#D6FF5C;--cream:#FFF6E8;--e:cubic-bezier(.16,1,.3,1);--pop:cubic-bezier(.34,1.56,.64,1)}
*{box-sizing:border-box;margin:0}
html,body{height:100%;background:#07061c;overflow:hidden;overscroll-behavior:none}
#stage{position:absolute;left:50%;top:50%;width:1080px;height:1920px;transform-origin:center;overflow:hidden;font-family:"Space Grotesk",system-ui,sans-serif;color:var(--cream)}
.slide{position:absolute;inset:0;display:none;padding:170px 72px 160px;overflow:hidden}
.slide.on{display:flex;flex-direction:column;justify-content:center;gap:30px}
.slide::before{content:"";position:absolute;width:640px;height:640px;border-radius:50%;background:var(--a);right:-260px;top:180px;animation:drift 7s ease-in-out infinite alternate}
.slide::after{content:"";position:absolute;width:260px;height:260px;border-radius:44px;background:var(--a);opacity:.5;left:-90px;bottom:260px;animation:drift 5s ease-in-out infinite alternate-reverse}
.slide>*:not(.brand){position:relative;z-index:1}
@keyframes drift{to{translate:-40px 60px}}
.t1{background:var(--navy);--a:var(--vio);--hi:var(--lime)}
.t2{background:var(--cream);--a:var(--lime);--hi:var(--vio);color:var(--navy)}
.t3{background:var(--lime);--a:var(--coral);--hi:var(--vio);color:var(--navy)}
.t4{background:var(--vio);--a:var(--navy);--hi:var(--lime)}
.t5{background:var(--navy);--a:var(--coral);--hi:var(--lime)}
.t6{background:var(--cream);--a:var(--vio);--hi:var(--coral);color:var(--navy)}
.t7{background:var(--coral);--a:var(--cream);--hi:var(--navy);color:var(--navy)}
.brand{position:absolute;bottom:70px;left:72px;font:600 40px Fraunces,Georgia,serif;z-index:2}
.bars{position:absolute;top:48px;left:48px;right:48px;display:flex;gap:10px;z-index:20;color:var(--cream)}
.bars.light{color:var(--navy)}
.bars i{flex:1;height:8px;border-radius:4px;background:rgba(255,255,255,.28);overflow:hidden;cursor:pointer}
.bars.light i{background:rgba(20,18,58,.18)}
.bars b{display:block;height:100%;width:0;background:currentColor}
.bars i.done b{width:100%}
.bars i.cur b{animation:bar var(--d) linear forwards}
@keyframes bar{to{width:100%}}
/* motion */
.rise{opacity:0}
.on .rise{animation:rise .85s var(--e) forwards;animation-delay:calc(var(--i,0)*.14s + .15s)}
@keyframes rise{from{opacity:0;transform:translateY(48px) scale(.97)}to{opacity:1;transform:none}}
.ln{display:block;overflow:hidden;padding-bottom:.1em}
.ln b{display:inline-block;transform:translateY(115%);font-weight:inherit}
.on .ln b{animation:up .9s var(--e) forwards;animation-delay:calc(var(--i)*.12s + .1s)}
@keyframes up{to{transform:none}}
.big{font:600 150px/.95 Fraunces,Georgia,serif;letter-spacing:-4px}
.big em,.hd em{font-style:italic;color:var(--hi)}
.hd{font:600 92px/1 Fraunces,Georgia,serif;letter-spacing:-2px;margin-bottom:14px}
.sub{font:italic 500 46px/1.25 Fraunces,Georgia,serif;opacity:.9;max-width:880px}
.pill{align-self:flex-start;margin-top:30px;padding:26px 46px;border-radius:999px;background:var(--hi);color:var(--navy);font:700 38px "Space Grotesk",sans-serif}
.t2 .pill,.t3 .pill,.t6 .pill{color:var(--cream);background:var(--navy)}
/* words */
.w{font:600 230px/1 Fraunces,Georgia,serif;letter-spacing:-8px;color:transparent;-webkit-text-stroke:3px currentColor}
.on .w{animation:fill .6s forwards;animation-delay:calc(1s + var(--i)*1.5s)}
@keyframes fill{to{color:var(--hi);-webkit-text-stroke-color:var(--hi);translate:24px 0}}
.wt{font:italic 500 46px/1.2 Fraunces,Georgia,serif;margin:-6px 0 34px;max-width:860px}
/* cards */
.cards{display:flex;flex-direction:column;gap:26px}
.c{border-radius:40px;padding:36px 46px;background:rgba(255,255,255,.1)}
.light .c,.t2 .c,.t3 .c,.t6 .c,.t7 .c{background:rgba(20,18,58,.08)}
.tag{font:700 24px "Space Grotesk",sans-serif;letter-spacing:5px;text-transform:uppercase;color:var(--hi);margin-bottom:12px}
.ct{font:700 50px/1.1 "Space Grotesk",sans-serif;letter-spacing:-1px}
.cx{font:italic 500 33px/1.3 Fraunces,Georgia,serif;margin-top:12px;opacity:.88}
.cb{font:600 78px/1 Fraunces,Georgia,serif;color:var(--hi);margin-top:16px;letter-spacing:-2px}
/* stats */
.sc{display:flex;align-items:center;gap:36px}
.num{font:600 130px/1 Fraunces,Georgia,serif;letter-spacing:-4px;min-width:330px;color:var(--hi)}
.sl{font:700 34px/1.25 "Space Grotesk",sans-serif}
.sl i{display:block;font:italic 500 30px Fraunces,Georgia,serif;opacity:.8;margin-top:6px}
/* timeline */
.tl{position:relative;padding-left:74px;display:flex;flex-direction:column;gap:46px}
.tl::before{content:"";position:absolute;left:16px;top:10px;bottom:10px;width:5px;border-radius:3px;background:var(--hi);transform-origin:top;transform:scaleY(0)}
.on .tl::before{animation:grow 3.4s var(--e) .2s forwards}
@keyframes grow{to{transform:none}}
.it{position:relative}
.it::before{content:"";position:absolute;left:-68px;top:6px;width:36px;height:36px;border-radius:50%;background:var(--hi);box-shadow:0 0 0 8px rgba(255,255,255,.15)}
.when{font:700 26px "Space Grotesk",sans-serif;letter-spacing:4px;text-transform:uppercase;color:var(--hi)}
.nm{font:700 56px/1.1 "Space Grotesk",sans-serif;margin:6px 0 8px;letter-spacing:-1px}
.tx{font:italic 500 33px/1.3 Fraunces,Georgia,serif;opacity:.9}
/* contact */
.row{padding:26px 0;border-top:2px solid rgba(255,255,255,.25)}
.row a{color:inherit;text-decoration:none;font:700 54px/1.1 "Space Grotesk",sans-serif;letter-spacing:-1px;word-break:break-word}
.row a:focus-visible,.nav:focus-visible{outline:4px solid var(--lime);outline-offset:6px}
/* nav + wipe */
.nav{position:absolute;top:120px;bottom:0;border:0;background:none;cursor:pointer;z-index:10}
#prev{left:0;width:35%}#next{right:0;width:65%}
#stage.last #next{display:none}#stage.last #prev{width:6%}
#wipe{position:absolute;z-index:30;left:480px;top:900px;width:120px;height:120px;border-radius:50%;background:var(--lime);transform:scale(0);pointer-events:none}
#wipe.go{animation:wipe .75s var(--e) forwards}
@keyframes wipe{0%{transform:scale(0)}55%{transform:scale(40)}100%{transform:scale(40);opacity:0}}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){
 *,*::before,*::after{animation:none!important;transition:none!important}
 .rise{opacity:1}.ln b{transform:none}.w{color:var(--hi);-webkit-text-stroke-color:var(--hi)}.tl::before{transform:none}#wipe{display:none}
}
```

### A.3 `public/js/content.js`

```js
/* ============================================================
   CONTENT: this is the only file you need to edit to change text.
   Each object in S is one slide. Keep the commas and quotes.
   Slide types: hero, words, stats, timeline, cards, contact
   Colors: t1..t7 (see css/styles.css). light:1 = dark text on light bg.
   d = seconds before auto-advance.
   ============================================================ */
const NAME = "Harel Adiv";
const S = [
 {type:"hero", t:"t1", d:6, lines:["Hi, I’m","<em>Harel</em>","<em>Adiv.</em>"], sub:"Product Manager. Agile, data-driven, and hands-on with AI.", cta:"Tap to explore →"},
 {type:"words", t:"t2", d:10, light:1, items:[
  {w:"Think", t:"Market research and user feedback come first."},
  {w:"Build", t:"Roadmaps shaped by data, shipped with Agile."},
  {w:"Grow", t:"Go-to-market, partnerships and ROI."}]},
 {type:"stats", t:"t3", d:8, light:1, h:"By the<br><em>numbers.</em>", items:[
  {pre:"+", n:30, dec:0, suf:"%", l:"New customer acquisition, quarter over quarter", s:"Boostapp · B2B and B2C"},
  {pre:"+", n:25, dec:0, suf:"%", l:"User satisfaction", s:"Boostapp · data-driven product pivots"},
  {pre:"", n:10, dec:0, suf:"+", l:"B2B and B2C clients managed", s:"Freelance digital marketing"},
  {pre:"", n:4, dec:0, suf:"+", l:"Years across product, marketing and operations", s:"2022 – now"}]},
 {type:"timeline", t:"t4", d:11, h:"The <em>path.</em>", items:[
  {when:"2022 – 2023", name:"Tic Tac Eilat Ltd", text:"Senior Manager. Marketing, inventory, international procurement and logistics, plus hands-on support for daily operations."},
  {when:"2023 – 2025", name:"Boostapp", text:"Product Manager. Turned research and user feedback into KPI-driven UX improvements and ran go-to-market across teams."},
  {when:"Oct 2025 – now", name:"H.A Digital Marketing", text:"Freelance. A portfolio of 10+ B2B and B2C clients, driving brand growth and ROI."},
  {when:"2025 – 2028", name:"BBA, Management Information Systems", text:"The College of Academic Studies."}]},
 {type:"cards", t:"t5", d:11, h:"Three <em>moments.</em>", items:[
  {tag:"Boostapp", title:"Growing new customers", text:"Turned market research and direct user feedback into KPI-driven UX improvements for B2B and B2C.", big:"+30% QoQ"},
  {tag:"Boostapp", title:"Raising user satisfaction", text:"Pivoted products based on data-driven insights and kept the roadmap tight with Agile.", big:"+25%"},
  {tag:"Freelance", title:"Serving many clients at once", text:"Managing a diverse B2B and B2C portfolio, focused on brand growth and ROI.", big:"10+ clients"}]},
 {type:"cards", t:"t6", d:10, light:1, h:"Always<br><em>learning.</em>", items:[
  {tag:"2025 – 2028 · Degree", title:"BBA, Management Information Systems", text:"The College of Academic Studies"},
  {tag:"Course", title:"Product Management (PM101)", text:"Give & Tech"},
  {tag:"Course", title:"Front-End Development", text:"Tapuach Organization"},
  {tag:"Course", title:"Google PPC & SEO", text:"Udemy"}]},
 {type:"cards", t:"t1", d:10, h:"What I <em>bring.</em>", items:[
  {tag:"Product", title:"Roadmaps · Agile · Scrum · PMO", text:"Boostapp, Product Manager"},
  {tag:"Data", title:"SQL · Excel · GA4 & GTM", text:"KPI-driven decisions"},
  {tag:"Growth", title:"Google Ads · PPC & SEO · CSM", text:"Freelance, 10+ clients"},
  {tag:"AI & code", title:"Claude · GPT · Python · HTML, CSS, JS", text:"Hands-on with AI tools and front-end code"}]},
 {type:"cards", t:"t7", d:8, light:1, h:"Off the clock,<br><em>still curious.</em>", items:[
  {tag:"Volunteering", title:"Teaching teens to code", text:"Course instructor at Tapuach Organization: web development (HTML, CSS, JavaScript) plus personal guidance."},
  {tag:"Languages", title:"Hebrew & English", text:"Hebrew native, English fluent."}]},
 {type:"contact", t:"t4", d:8, h:"Let’s <em>talk.</em>", sub:"Hiring, collaborating, or just curious? My inbox is open.", items:[
  {k:"Email", v:"Hareladiv@gmail.com", href:"mailto:Hareladiv@gmail.com"},
  {k:"Phone", v:"+972 52-403-4600", href:"tel:+972524034600"},
  {k:"LinkedIn", v:"linkedin.com/in/your-handle", href:"https://www.linkedin.com/in/your-handle"}]}
];
```

### A.4 `public/js/app.js`

```js
/* ============================================================
   ENGINE: renders slides from CONTENT (js/content.js) and handles
   navigation, timers, progress bars, swipe, hold-to-pause.
   Loaded after content.js, so NAME and S are available here.
   ============================================================ */
/* ===== ENGINE (no need to edit) ===== */
const R={
 hero:s=>`<h1 class="big">${s.lines.map((l,i)=>`<span class="ln"><b style="--i:${i}">${l}</b></span>`).join("")}</h1><p class="sub rise" style="--i:5">${s.sub}</p><span class="pill rise" style="--i:7">${s.cta}</span>`,
 words:s=>s.items.map((o,i)=>`<div class="w" style="--i:${i}">${o.w}</div><div class="wt rise" style="--i:${i*3+1}">${o.t}</div>`).join(""),
 stats:s=>`<h2 class="hd rise">${s.h}</h2><div class="cards">${s.items.map((o,i)=>`<div class="c sc rise" style="--i:${i+1}"><div class="num">${o.pre}<span data-n="${o.n}" data-dec="${o.dec}">0</span>${o.suf}</div><div class="sl">${o.l}${o.s?`<i>${o.s}</i>`:""}</div></div>`).join("")}</div>`,
 timeline:s=>`<h2 class="hd rise">${s.h}</h2><div class="tl">${s.items.map((o,i)=>`<div class="it rise" style="--i:${i*3+2}"><div class="when">${o.when}</div><div class="nm">${o.name}</div><div class="tx">${o.text}</div></div>`).join("")}</div>`,
 cards:s=>`<h2 class="hd rise">${s.h}</h2><div class="cards">${s.items.map((o,i)=>`<div class="c rise" style="--i:${i+1}"><div class="tag">${o.tag}</div><div class="ct">${o.title}</div>${o.text?`<div class="cx">${o.text}</div>`:""}${o.big?`<div class="cb">${o.big}</div>`:""}</div>`).join("")}</div>`,
 contact:s=>`<h2 class="hd rise">${s.h}</h2><p class="sub rise" style="--i:1">${s.sub}</p><div>${s.items.map((o,i)=>`<div class="row rise" style="--i:${i+2}"><div class="tag">${o.k}</div><a href="${o.href}" target="_blank" rel="noopener">${o.v}</a></div>`).join("")}</div>`
};
const $=q=>document.querySelector(q), stage=$("#stage"), reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
$("#slides").innerHTML=S.map((s,i)=>`<section class="slide ${s.t}" role="group" aria-label="Slide ${i+1} of ${S.length}">${R[s.type](s)}<div class="brand">${NAME}</div></section>`).join("");
const els=[...document.querySelectorAll(".slide")];
let cur=-1,timer,busy=false;
function fit(){stage.style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/1080,innerHeight/1920)})`}
addEventListener("resize",fit);fit();
function count(el){el.querySelectorAll("[data-n]").forEach(n=>{const to=+n.dataset.n,dec=+n.dataset.dec;if(reduce){n.textContent=to.toFixed(dec);return}
 const t0=performance.now()+400;(function f(t){const p=Math.min(Math.max((t-t0)/1500,0),1);n.textContent=(to*(1-Math.pow(1-p,3))).toFixed(dec);if(p<1)requestAnimationFrame(f)})(performance.now())})}
function show(n){
 clearTimeout(timer);cur=n;
 els.forEach(e=>{e.classList.remove("on");e.inert=true});
 const e=els[n];e.inert=false;void e.offsetWidth;e.classList.add("on");count(e);
 $("#live").textContent=`Slide ${n+1} of ${S.length}`;
 const last=n===S.length-1;stage.classList.toggle("last",last);
 const b=$("#bars");b.classList.toggle("light",!!S[n].light);
 b.innerHTML=S.map((s,i)=>`<i class="${i<n||(last&&i===n)?"done":i===n?"cur":""}" style="--d:${s.d}s" data-i="${i}"></i>`.replace("></i>","><b></b></i>")).join("");
 if(!last&&!reduce)timer=setTimeout(()=>go(cur+1),S[n].d*1000);
}
function go(n){
 n=Math.max(0,Math.min(S.length-1,n));if(n===cur||busy)return;busy=true;
 const w=$("#wipe");w.classList.remove("go");void w.offsetWidth;w.classList.add("go");
 setTimeout(()=>{show(n);busy=false},reduce?0:300);
}
let skip=false;
$("#next").onclick=()=>{if(!skip)go(cur+1)};$("#prev").onclick=()=>{if(!skip)go(cur-1)};
$("#bars").onclick=e=>{const i=e.target.closest("i");if(i)go(+i.dataset.i)};
addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key===" ")go(cur+1);if(e.key==="ArrowLeft")go(cur-1)});
/* hold to pause + swipe */
let hold,paused=false,x0=null,y0=0;
stage.addEventListener("pointerdown",e=>{x0=e.clientX;y0=e.clientY;hold=setTimeout(()=>{paused=true;clearTimeout(timer);document.getAnimations().forEach(a=>a.pause())},300)});
stage.addEventListener("pointerup",e=>{
 clearTimeout(hold);
 if(paused){paused=false;skip=true;setTimeout(()=>skip=false,60);document.getAnimations().forEach(a=>a.play());
  if(cur<S.length-1&&!reduce)timer=setTimeout(()=>go(cur+1),3000)}
 else if(x0!==null){const dx=e.clientX-x0,dy=e.clientY-y0;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){skip=true;setTimeout(()=>skip=false,60);go(cur+(dx<0?1:-1))}}
 x0=null});
show(0);
```

### A.5 `.vscode/settings.json`

```json
{ "liveServer.settings.root": "/public" }
```

### A.6 `.vscode/extensions.json`

```json
{
  "recommendations": ["ritwickdey.LiveServer"]
}
```

---

## 16. Appendix B: `CLAUDE.md`

Create `CLAUDE.md` in the project root with exactly this content (Claude Code loads it automatically every session):

````markdown
# CLAUDE.md

This project is Harel Adiv's interactive resume site.

**Before anything else, every session:**
1. Read `PLAN.md` fully. It is the complete spec and the source of truth.
2. Read `PROGRESS.md` and continue from the first unchecked task.
3. Follow PLAN.md §1 (how to work with Harel) and §2 (working rules).

**Non-negotiables (details in PLAN.md):**
- Talk to Harel in **Hebrew**; code, comments and commits in English.
- When you need Harel, stop and use the `NEEDS HAREL` block (PLAN.md §1.3). Never guess facts, copy, URLs or keys.
- **Zero cost** (PLAN.md §3): nothing that costs money or needs a credit card. At the first session, check that `ANTHROPIC_API_KEY` is not set.
- Never change resume copy without Harel. Only use facts from PLAN.md §5.
- Plain HTML/CSS/JS; the deployed site has no npm dependencies.
- One branch per phase, one commit per task, stop at every `⏸ STOP` and wait for Harel's approval before merging to `main`.
- Update `PROGRESS.md` after every task.
````

---

## 17. Appendix C: `PROGRESS.md`

Create `PROGRESS.md` in the project root with exactly this content:

````markdown
# Progress

Agent: tick a task when its acceptance criteria pass. Add one line under "Log" per task: date, task, what changed, anything left open.

## Phase 0: Environment & inputs
- [ ] P0.0 Bootstrap files from PLAN.md
- [ ] P0.1 Check environment (OS, git, node, gh, ANTHROPIC_API_KEY)
- [ ] P0.2 Collect inputs from Harel

## Phase 1: Repo & first deploy
- [ ] P1.1 Restructure into target tree
- [ ] P1.2 404.html
- [ ] P1.3 Git init + GitHub repo
- [ ] P1.4 Connect Vercel
- [ ] ⏸ STOP 1

## Phase 2: Robust engine & UX
- [ ] P2.1 Autoplay policy
- [ ] P2.2 Pause/resume with remaining time
- [ ] P2.3 URL state & deep links
- [ ] P2.4 Keyboard
- [ ] P2.5 Desktop rails
- [ ] P2.6 Interactive elements beat tap zones
- [ ] P2.7 Viewport, touch, safe areas
- [ ] P2.8 Small landscape phones
- [ ] P2.9 Contact slide & copy
- [ ] P2.10 No-JS and error fallback
- [ ] P2.11 Self-hosted fonts
- [ ] P2.12 Safe rendering
- [ ] P2.13 Content Security Policy
- [ ] ⏸ STOP 2

## Phase 3: CV & sharing
- [ ] P3.1 CV download everywhere
- [ ] P3.2 Meta, Open Graph, icons
- [ ] P3.3 Traffic-source links
- [ ] P3.4 QR code
- [ ] P3.5 robots.txt, sitemap.xml
- [ ] ⏸ STOP 3

## Phase 4: Analytics
- [ ] P4.0 PostHog key from Harel
- [ ] P4.1 analytics.js
- [ ] P4.2 Events
- [ ] P4.3 Exclude Harel (notrack)
- [ ] P4.4 Optional proxy
- [ ] P4.5 Owner dashboard guide
- [ ] ⏸ STOP 4

## Phase 5: Content as JSON
- [ ] P5.1 content.json
- [ ] P5.2 Loading + fallback
- [ ] P5.3 validate-content.mjs as build
- [ ] P5.4 Runtime overflow guard
- [ ] P5.5 Owner editing guide
- [ ] ⏸ STOP 5

## Phase 6: QA & launch
- [ ] P6.1 Device matrix
- [ ] P6.2 Accessibility
- [ ] P6.3 Performance
- [ ] P6.4 Pre-launch checklist
- [ ] P6.5 Launch
- [ ] ⏸ STOP 6

## Inputs from Harel
| Item | Status | Value / note |
|---|---|---|
| LinkedIn URL | waiting | |
| Corrected CV PDF | waiting | |
| "4+ years" confirmed | waiting | |
| Vercel project name | waiting | suggested: harel-adiv |
| Repo visibility | waiting | suggested: private |
| Production URL | waiting | |
| PostHog project key | waiting | |
| OG image approved | waiting | |
| Hobbies (optional) | waiting | |
| Tools approved (fontsource, qrcode, playwright) | waiting | |

## Log
- (first entry after P0.0)
````
