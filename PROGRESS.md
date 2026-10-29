# Progress

Agent: tick a task when its acceptance criteria pass. Add one line under "Log" per task: date, task, what changed, anything left open.

## Phase 0: Environment & inputs
- [x] P0.0 Bootstrap files from PLAN.md
- [x] P0.1 Check environment (OS, git, node, gh, ANTHROPIC_API_KEY)
- [x] P0.2 Collect inputs from Harel

## Phase 1: Repo & first deploy
- [x] P1.1 Restructure into target tree
- [x] P1.2 404.html
- [x] P1.3 Git init + GitHub repo
- [x] P1.4 Connect Vercel
- [x] ⏸ STOP 1

## Phase 2: Robust engine & UX
- [x] P2.1 Autoplay policy
- [x] P2.2 Pause/resume with remaining time
- [x] P2.3 URL state & deep links
- [x] P2.4 Keyboard
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
| LinkedIn URL | received | https://www.linkedin.com/in/harel-adiv-054680234/ |
| Corrected CV PDF | received | Harel approved `HarelcvH.pdf` as is; copied to public/assets/cv/Harel-Adiv-CV.pdf. Note: file still reads "Senior Maneger", "Im", "Linkdin" (flagged to Harel) |
| "4+ years" confirmed | received | yes |
| Vercel project name | received | harel-resume (Harel created it with this name, not harel-adiv) |
| Repo visibility | received | public |
| Production URL | received | https://harel-resume.vercel.app |
| PostHog project key | waiting | |
| OG image approved | waiting | |
| Hobbies (optional) | received | Card approved: tag "Hobbies", title "Basketball & surfing" (no text) |
| Tools approved (fontsource, qrcode, playwright) | waiting | |

## Log
- 2026-10-29 P0.0: created all Appendix A files, .gitignore, CLAUDE.md, PROGRESS.md, public/assets/cv/.gitkeep. Open: `node --check` AC pending until Node is installed (P0.1); visual AC needs Harel (Live Server).
- 2026-10-29 P0.1 (partial): Windows 11. ANTHROPIC_API_KEY not set (OK). git, node, npm, gh all missing → waiting for Harel to install (guide §12.1, §12.2).
- 2026-10-29 P0.1 done: installed via winget at Harel's request: Node v26.13.0 (LTS), npm 11.20.0, Git 2.56.0. `node --check` passes for app.js and content.js (P0.0 AC). Then: git identity set globally (Harel Adiv / Hareladiv@gmail.com, default branch main); gh 2.103.3 installed. Open: Harel runs `gh auth login`.
- 2026-10-29 P0.2 (partial): got LinkedIn, 4+ years OK, name harel-adiv, public repo, hobbies. LinkedIn filled in content.js. Open: corrected CV PDF, hobbies card copy.
- 2026-10-29 P1.1 (files only): package.json (no-op build), vercel.json, Hebrew README.md. Not committed yet (git missing; first commit is P1.3). Open: Live Server visual check by Harel.
- 2026-10-29 P1.2 (files only): public/404.html + public/css/404.css (external CSS so CSP in P2.13 won't block it). Added /HarelcvH.pdf to .gitignore (public repo; draft CV stays local). Open: verify on Vercel in P1.4.
- 2026-10-29 P1.3: git init, .gitattributes (LF in repo), first commit de1b473, public repo https://github.com/hareladiv22/harel-resume created and pushed with Harel's OK; default branch main.
- 2026-10-29 P1.4: Vercel project harel-resume (team harelboostapp-1849s-projects). Production https://harel-resume.vercel.app: / 200, /nope 404 with 404.html, all vercel.json headers present, CV PDF served. Branch phase-2 pushed -> preview built OK, behind Vercel login (Standard Protection), X-Robots-Tag: noindex present. P1.1/P1.2 ticked: production serves them correctly; Harel confirms visually at STOP 1.
- 2026-10-29 P0.2 done: hobbies card added to 'Off the clock' slide (3 cards now). STOP 1 approved by Harel.
- 2026-10-29 P2.1: autoplay only until first manual action (tap zone, swipe, key, bar); then no timers, bars 'still' (current filled, past dimmed). Reduced motion = no autoplay. Tested headless: auto-advance at 6s, tap stops it (12s no move), reduced motion stays on 1. Deep-link condition comes with P2.3.
- 2026-10-29 P2.2: pause reasons (hold/hidden/space) with remaining time; animations incl. bar freeze together; pointercancel + lostpointercapture end a hold; hold never navigates. Tested headless: hold 5s on d=6 -> timer fires with bar end (~10.5s), 20s hidden -> resumes with remaining time, cancel clears hold. Real iOS gesture check: Harel (P6.1).
- 2026-10-29 P2.3: hash = slide number via replaceState; valid deep link opens slide with autoplay off; invalid (#0,#99,#abc,#2.5) -> slide 1, hash #1; hashchange navigates (manual). Tested headless incl. refresh on 5. Note: refresh on #1 also counts as deep link (no autoplay), by design.
- 2026-10-29 P2.4: key map per spec (arrows, PageUp/Down, Home/End, Space = pause toggle while autoplay else next); modifiers ignored; Space/Enter on focused a/button/input untouched; preventDefault only on handled keys. Tested headless. Open: Space on CV link (an <a>) must open it -> handled when CV buttons are built (P2.5/P3.1).
