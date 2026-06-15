# rifolio v2 — "nerdy, professional, pixel-accented" redesign

**Date:** 2026-06-15
**Site:** rifolio.me (GitHub Pages, repo `rifolio/rifolio.github.io`)
**Owner:** Vladyslav Horbatenko — AI engineer, MSc Human-Centered AI at DTU
**Stack:** React 19 + Vite + Tailwind v4 + shadcn/ui (existing)

## Concept & art direction (Direction B — "Clean + Pixel Accents")

Keep the existing elegant base — dark theme, Bricolage Grotesque (display) + IBM Plex
Sans (body), violet accent, `bg-pattern` grid with fade mask. Layer 8-bit in as
deliberate *moments*, never the whole page. One pixel font (**Press Start 2P**) used
sparingly: loader, FAQ, OTP, pagination, 404, small labels. A hidden **arcade mode**
(unlocked via the OTP code) is the single place the site goes full retro
(green-on-black, scanlines) — a reward, not the default.

Rejected alternatives: **A — Full Arcade** (everything pixelated; reads as a gimmick,
weakens "hire-me" signal) and **C — Two-Mode Toggle** (sitewide arcade switch; more
build effort than warranted).

## Liked components → placement (with source links)

Every component below is one the owner picked from 21st.dev. Install via the shadcn
registry command on each component's page (`npx shadcn@latest add "<url>"`); adapt TSX
to drop into this Vite project (TSX already coexists here, e.g.
`src/components/ui/glass-blog-card-shadcnui.tsx`). If a fetch/install fails, build a
faithful equivalent matching the linked design.

| Component | Source link | Lands as |
|---|---|---|
| text-scramble | https://21st.dev/community/components/jatin-yadav05/text-scramble/default | Hero name + role decode-in; section headers scramble on scroll |
| 8bit-loading-screen | https://21st.dev/community/components/OrcDev/8bit-loading-screen/default | First-paint load screen |
| 8bit-spinner | https://21st.dev/community/components/theorcdev/8bit-spinner/default | All loading states (no skeletons), e.g. GitHub refresh |
| commits-grid | https://21st.dev/community/components/gonzalochale/commits-grid/default | GitHub contributions heatmap |
| 8bit-carousel | https://21st.dev/community/components/OrcDev/8bit-carousel/default | Featured projects showcase |
| 8bit-advanced1 | https://21st.dev/community/components/OrcDev/8bit-advanced1/default | "What I build" code/terminal panel in About |
| pixel-logo-grid | https://21st.dev/community/components/smammar100/pixel-logo-grid/default | Companies I've worked at |
| 8bit-faq1 | https://21st.dev/community/components/OrcDev/8bit-faq1/default | FAQ / fun-facts section |
| animated-download | https://21st.dev/community/components/isaiahbjork/animated-download/default | CV download button |
| 8bit-input-otp | https://21st.dev/community/components/theorcdev/8bit-input-otp/default | Easter-egg "enter access code" → unlocks arcade mode |
| 8bit-pagination | https://21st.dev/community/components/theorcdev/8bit-pagination/default | Blog list paging |
| 8bit-advanced3 | https://21st.dev/community/components/OrcDev/8bit-advanced3/default | Contact form shell (wired to Web3Forms) |
| footer (tailark) | https://21st.dev/community/components/tailark/footer/default | Footer — **already installed** (`src/components/ui/footer.jsx`) |
| bg-pattern | https://21st.dev/community/components/efferd/bg-pattern/default | Page background — **already installed** (`src/components/ui/bg-pattern.jsx`) |
| not-found-page-1 | https://21st.dev/community/components/efferd/not-found-page-1/default | Custom-themed 404 |

## Architecture & routes

- Decompose the single 1033-line `src/App.jsx` into a **router shell** + focused
  section components under `src/components/sections/`. This is the only refactor in
  scope; the file is too large to safely extend. Each section is independently
  understandable and testable.
- Routes (react-router-dom, already installed):
  - `/` — scroll home
  - `/blog` — list + 8bit pagination
  - `/blog/:slug` — post page
  - `*` — 8bit 404
- Home section order:
  **Hero → About / "What I build" → GitHub stats + commits grid → Experience timeline
  → Projects carousel → Companies pixel-grid → FAQ → Contact → Footer.**

## Data flow

### GitHub (Hybrid: build-time snapshot + live refresh)
- New `scripts/fetch-github.mjs` runs in the deploy Action → writes
  `src/data/github.json` (profile stats: repos/followers/stars/etc. + contribution
  calendar). Baked at build → instant, no visitor rate limits, no flicker.
- `useGithub` hook renders the snapshot immediately, then attempts a live REST refresh
  for the numeric stats (contribution calendar stays snapshot-sourced, since it isn't
  in the official REST API). 8bit-spinner shows during refresh.
- Add a daily scheduled rebuild (cron in the Action) to keep the snapshot fresh.

### Blog (Markdown in repo)
- Posts live in `src/content/blog/*.md` with frontmatter: `title`, `date`, `tags`,
  `slug`, `excerpt`, optional `cover`.
- Loaded via Vite `import.meta.glob`; rendered with a markdown library (code blocks,
  images supported). Pagination is client-side over the sorted post list.
- Seed **2 sample posts** so the section is real; owner replaces content later.

### Contact (Web3Forms)
- Form POSTs to Web3Forms with an access key in `VITE_WEB3FORMS_KEY`. Success/fail via
  existing `sonner` toasts. Owner obtains a free key from web3forms.com; spec/code
  leaves a clearly-marked placeholder.

### Arcade easter egg
- OTP value checked client-side against a constant code. Correct → sets an `arcade`
  flag in React context → scanlines + pixel palette + fun message. No backend.

## Content sources
- Profile picture, projects, experience, companies, and stat copy are **reused from
  the current `App.jsx`** — nothing is lost in the migration.
- CV stays at `public/CV.pdf` (served by the animated-download button).

## Out of scope (YAGNI)
- No accounts/auth, no database, no CMS, no analytics.
- No sitewide arcade toggle (rejected option C).
- Keep the existing GitHub Pages deploy pipeline (`.github/workflows/gh-pages.yml`),
  extended only to run `fetch-github.mjs` and a daily cron.

## Success criteria
- Site builds and deploys to rifolio.me unchanged in pipeline shape.
- Home tells the owner's story in one scroll; blog has real deep-linkable posts.
- Every liked component appears in its mapped placement.
- GitHub stats + commits render instantly from snapshot and refresh live where possible.
- Contact form delivers a real email via Web3Forms.
- OTP code unlocks arcade mode; wrong codes do nothing harmful.
- Professional first impression preserved; 8-bit reads as intentional accent.
