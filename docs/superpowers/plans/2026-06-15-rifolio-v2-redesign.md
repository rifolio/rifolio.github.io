# rifolio v2 Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild rifolio.me as a "nerdy-but-professional" portfolio — an elegant dark base with deliberate 8-bit accents, a routed blog, real GitHub stats, a working contact form, and a hidden arcade easter egg.

**Architecture:** Decompose the single 1033-line `src/App.jsx` into a react-router shell plus focused section components under `src/components/sections/`. Site data (projects, experience, companies, nav, FAQ) is extracted to `src/data/`. GitHub stats use a hybrid model (build-time JSON snapshot + live browser refresh). Blog posts are Markdown files loaded via Vite glob. Contact posts to Web3Forms. An arcade easter-egg state lives in a React context, unlocked by an 8-bit OTP code. 8-bit components are installed from the 21st.dev registry per the linked sources in the spec.

**Tech Stack:** React 19, Vite, Tailwind v4, shadcn/ui, react-router-dom 7, framer-motion, sonner, react-markdown, Press Start 2P font, Web3Forms, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-06-15-rifolio-v2-redesign-design.md`

---

## Conventions for every task

- **Run dev server:** `pnpm dev` (Vite, default http://localhost:5173). Keep one instance running while iterating.
- **Build check (the main gate):** `pnpm build` must exit 0. Run before every commit that touches app code.
- **Lint:** `pnpm lint` should not introduce new errors in files you created.
- **Pure-logic tests:** Node's built-in runner — `node --test <file>` — no extra deps. Only pure functions get unit tests; React UI is verified by build + visual check.
- **Installing a 21st component:** run the `npx shadcn@latest add "<url>"` command from the component's 21st.dev page (links in the spec table). If the install fails or pulls TSX that won't resolve, build a faithful equivalent matching the linked design and note it in the commit message. After any install, run `pnpm build` to confirm it resolves.
- **Commit style:** small, frequent, conventional (`feat:`, `refactor:`, `chore:`). End commit messages with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Do NOT** delete existing assets in `src/assets/` or `public/CV.pdf`.

---

## File Structure (target)

```
src/
  main.jsx                      # wrap App in BrowserRouter (basename from import.meta.env.BASE_URL)
  App.jsx                       # route definitions only (Home, Blog, BlogPost, NotFound)
  context/
    ArcadeContext.jsx           # arcade easter-egg flag + provider + hook
  data/
    site.js                     # navItems, social links, stat copy
    projects.js                 # projects array (moved from App.jsx) + asset imports
    experience.js               # work experience timeline
    companies.js                # companies for pixel-logo-grid
    faq.js                      # FAQ / fun-facts entries
    github.json                 # build-time GitHub snapshot (generated)
  lib/
    github.js                   # pure: shapeGithubData(raw) -> snapshot shape
    blog.js                     # pure: parseFrontmatter(raw), loadPosts(), getPost(slug)
    arcade.js                   # pure: ARCADE_CODE + checkArcadeCode(value)
  hooks/
    use-github.js               # snapshot-first + live-refresh hook
  content/blog/
    2026-05-01-hello-world.md
    2026-05-20-building-with-ai.md
  components/
    layout/
      Navbar.jsx
      LoadingScreen.jsx         # uses 8bit-loading-screen
    sections/
      Hero.jsx                  # text-scramble
      About.jsx                 # 8bit-advanced1 code panel
      GithubStats.jsx           # stats + commits-grid
      Experience.jsx
      Projects.jsx              # 8bit-carousel
      Companies.jsx             # pixel-logo-grid
      Faq.jsx                   # 8bit-faq1
      Contact.jsx               # 8bit-advanced3 + Web3Forms
      CvDownload.jsx            # animated-download
      ArcadeOtp.jsx             # 8bit-input-otp easter egg
    pages/
      Home.jsx                  # composes all sections in order
      Blog.jsx                  # list + 8bit-pagination
      BlogPost.jsx              # single post via react-markdown
      NotFound.jsx              # not-found-page-1
  ui/ ...                       # existing shadcn + newly installed 8-bit components
scripts/
  fetch-github.mjs              # build-time fetch -> src/data/github.json
tests/
  github.test.mjs
  blog.test.mjs
  arcade.test.mjs
```

---

# PHASE 0 — Foundation (routing, data extraction, fonts, arcade context)

### Task 0.1: Install runtime dependencies

**Files:** Modify `package.json` (via pnpm).

- [ ] **Step 1: Add deps**

Run:
```bash
pnpm add react-markdown remark-gfm
```
(`react-router-dom`, `framer-motion`, `sonner`, `input-otp`, `embla-carousel-react` are already present.)

- [ ] **Step 2: Verify build still works**

Run: `pnpm build`
Expected: exits 0.

- [ ] **Step 3: Commit**
```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add react-markdown + remark-gfm for blog"
```

---

### Task 0.2: Add Press Start 2P pixel font + arcade CSS tokens

**Files:**
- Modify: `index.html` (font link)
- Modify: `src/App.css` (add `--font-pixel` + `.arcade` scoped styles)

- [ ] **Step 1: Add the font to `index.html`**

In the existing Google Fonts `<link href=...>`, append `&family=Press+Start+2P` before `&display=swap`. Result href:
```
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Press+Start+2P&display=swap
```

- [ ] **Step 2: Register the pixel font token in `src/App.css`**

Inside the existing `@theme inline { ... }` block, add:
```css
  --font-pixel: "Press Start 2P", "Courier New", monospace;
```

- [ ] **Step 3: Add arcade-mode styles at the end of `src/App.css`**

```css
/* Arcade easter-egg mode — applied to <html class="arcade"> */
.arcade {
  --primary: oklch(0.86 0.24 145);        /* retro green */
  --ring: oklch(0.86 0.24 145);
}
.arcade body {
  text-shadow: 0 0 2px color-mix(in oklch, var(--primary) 60%, transparent);
}
.arcade::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.12) 0 1px,
    transparent 1px 3px
  );
}
.font-pixel { font-family: var(--font-pixel); }
```

- [ ] **Step 4: Verify**

Run: `pnpm dev`, open the site, confirm it loads unchanged (no arcade class yet). Run `pnpm build` → exits 0.

- [ ] **Step 5: Commit**
```bash
git add index.html src/App.css
git commit -m "feat: add Press Start 2P pixel font and arcade-mode CSS tokens"
```

---

### Task 0.3: Arcade context + pure code-check (with test)

**Files:**
- Create: `src/lib/arcade.js`
- Create: `tests/arcade.test.mjs`
- Create: `src/context/ArcadeContext.jsx`

- [ ] **Step 1: Write the failing test** — `tests/arcade.test.mjs`

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { ARCADE_CODE, checkArcadeCode } from "../src/lib/arcade.js";

test("ARCADE_CODE is a 6-char uppercase string", () => {
  assert.equal(typeof ARCADE_CODE, "string");
  assert.equal(ARCADE_CODE.length, 6);
  assert.equal(ARCADE_CODE, ARCADE_CODE.toUpperCase());
});

test("checkArcadeCode is case-insensitive and trims", () => {
  assert.equal(checkArcadeCode("  " + ARCADE_CODE.toLowerCase() + " "), true);
  assert.equal(checkArcadeCode("WRONGY"), false);
  assert.equal(checkArcadeCode(""), false);
  assert.equal(checkArcadeCode(null), false);
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `node --test tests/arcade.test.mjs`
Expected: FAIL (cannot find module `../src/lib/arcade.js`).

- [ ] **Step 3: Implement `src/lib/arcade.js`**

```js
// The secret code that flips the site into arcade mode.
// Themed nerdy default; change freely.
export const ARCADE_CODE = "KONAMI";

export function checkArcadeCode(value) {
  if (typeof value !== "string") return false;
  return value.trim().toUpperCase() === ARCADE_CODE;
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `node --test tests/arcade.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Implement `src/context/ArcadeContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from "react";

const ArcadeContext = createContext({ arcade: false, setArcade: () => {} });

export function ArcadeProvider({ children }) {
  const [arcade, setArcade] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (arcade) root.classList.add("arcade");
    else root.classList.remove("arcade");
  }, [arcade]);

  return (
    <ArcadeContext.Provider value={{ arcade, setArcade }}>
      {children}
    </ArcadeContext.Provider>
  );
}

export function useArcade() {
  return useContext(ArcadeContext);
}
```

- [ ] **Step 6: Commit**
```bash
git add src/lib/arcade.js tests/arcade.test.mjs src/context/ArcadeContext.jsx
git commit -m "feat: arcade easter-egg context + code-check util"
```

---

### Task 0.4: Extract site data out of App.jsx

**Files:**
- Create: `src/data/projects.js`, `src/data/experience.js`, `src/data/companies.js`, `src/data/site.js`, `src/data/faq.js`
- Read (source of truth): `src/App.jsx` (current arrays: `projects` ~line 312, `navItems` ~line 206, plus stat copy and social links)

- [ ] **Step 1: Move the `projects` array verbatim into `src/data/projects.js`**

Copy the existing `projects` array and its asset imports from `App.jsx` (lines ~16-21 imports, ~312-540 array) into:
```js
import coverDeepLearning from "@/assets/DeepLearningBSc.png";
import coverFruitFlies from "@/assets/FruitFliesProject.png";
import coverBevar from "@/assets/BevarVictor.png";
import coverFocolax from "@/assets/Focolax.png";
import coverSandra from "@/assets/Sandra.png";
import coverPodcast from "@/assets/PodcastListenTime.png";

export const projects = [ /* ...exact array from App.jsx... */ ];
```
Keep every field (`title`, `company`, `coverImage`, `coverImageAlt`, etc.) identical.

- [ ] **Step 2: Move `navItems` + social links + stat copy into `src/data/site.js`**

```js
export const navItems = [ /* ...exact array from App.jsx... */ ];

export const socials = {
  github: "https://github.com/rifolio",
  linkedin: "/* existing LinkedIn URL from App.jsx */",
  email: "vladyslav.horbatenko.work@gmail.com",
  location: "Copenhagen, Denmark",
};
```

- [ ] **Step 3: Create `src/data/experience.js`**

Derive entries from the project/company data already in `App.jsx`. Shape:
```js
export const experience = [
  { company: "Novo Nordisk", role: "/* role */", period: "/* yyyy–yyyy */", summary: "/* one line */" },
  { company: "Peermind", role: "/* role */", period: "/* */", summary: "/* */" },
  { company: "Tryp.com", role: "/* role */", period: "/* */", summary: "/* */" },
  { company: "Roskilde University", role: "Teaching Assistant — Java", period: "/* */", summary: "/* */" },
  // ...fill from existing content; do not invent employers not already on the site
];
```

- [ ] **Step 4: Create `src/data/companies.js`** (for pixel-logo-grid)

Reuse the existing logo components in `src/components/ui/logos/`:
```js
export const companies = [
  { name: "Novo Nordisk", logo: "novo-nordisk" },
  { name: "Peermind", logo: "peermind" },
  { name: "Tryp", logo: "tryp" },
  { name: "Roskilde University", logo: "ruc" },
  { name: "CoreAI", logo: "coreai" },
];
```
(Map `logo` keys to the exports in `src/components/ui/logos/index.js`.)

- [ ] **Step 5: Create `src/data/faq.js`**

```js
export const faqs = [
  { q: "What do you actually do?", a: "I build human-centered AI systems — LLM apps, ML pipelines, and the glue that makes them usable." },
  { q: "What are you studying?", a: "MSc in Human-Centered AI at DTU, Copenhagen." },
  { q: "Favorite stack?", a: "Python for ML, React for the front end, and a terminal that never closes." },
  { q: "Fun fact?", a: "/* a real fun fact the owner can edit */" },
];
```

- [ ] **Step 6: Verify imports resolve**

Temporarily import each new module in `App.jsx` (or run `pnpm build`). Run: `pnpm build` → exits 0.

- [ ] **Step 7: Commit**
```bash
git add src/data/
git commit -m "refactor: extract site data (projects, nav, experience, companies, faq) from App.jsx"
```

---

### Task 0.5: Router shell + BrowserRouter

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx` (replace with route table; preserve the current page as `Home` temporarily)
- Create: `src/components/pages/Home.jsx` (temporary: render the existing markup so nothing breaks yet)

- [ ] **Step 1: Wrap the app in BrowserRouter + ArcadeProvider** — `src/main.jsx`

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ArcadeProvider } from "@/context/ArcadeContext.jsx";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <ArcadeProvider>
        <App />
      </ArcadeProvider>
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 2: Move current App body into `src/components/pages/Home.jsx`**

Cut the entire current `App()` render tree (everything it returns) into `Home.jsx` as `export default function Home() { ... }`, keeping all its imports. This is a mechanical move — no behavior change yet.

- [ ] **Step 3: Replace `src/App.jsx` with a route table**

```jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner.jsx";
import Home from "@/components/pages/Home.jsx";
import Blog from "@/components/pages/Blog.jsx";
import BlogPost from "@/components/pages/BlogPost.jsx";
import NotFound from "@/components/pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
```

- [ ] **Step 4: Create minimal placeholders** for `Blog.jsx`, `BlogPost.jsx`, `NotFound.jsx` so imports resolve

Each: `export default function X() { return <div className="p-10 font-pixel">X</div>; }` (real versions come in later phases).

- [ ] **Step 5: Add SPA fallback for GitHub Pages deep links**

Create `public/404.html` that redirects to `index.html` preserving the path (standard SPA-on-Pages trick), and add the matching redirect-restore snippet to `index.html` `<head>`. Use the well-known `spa-github-pages` single-file technique. Verify `/blog/whatever` reloads without a hard 404 in `pnpm preview`.

- [ ] **Step 6: Verify**

Run: `pnpm build` → exits 0. Run `pnpm dev`, confirm `/` renders the old page intact, `/blog` shows placeholder, unknown route shows NotFound placeholder.

- [ ] **Step 7: Commit**
```bash
git add src/main.jsx src/App.jsx src/components/pages/ public/404.html index.html
git commit -m "refactor: introduce react-router shell, ArcadeProvider, SPA 404 fallback"
```

**REVIEW CHECKPOINT — end of Phase 0.** Site is fully routed, data extracted, nothing visually changed yet.

---

# PHASE 1 — Visual scaffolding (background, loader, spinner, navbar)

### Task 1.1: Loading screen + spinner components

**Files:**
- Install: `8bit-loading-screen`, `8bit-spinner` (links in spec)
- Create: `src/components/layout/LoadingScreen.jsx`

- [ ] **Step 1:** Install both via their `npx shadcn@latest add "<url>"` commands. Run `pnpm build` → exits 0.
- [ ] **Step 2:** Wrap the loading screen in `LoadingScreen.jsx` with a minimum-display timer (e.g. 1.2s) and a fade-out, so first paint shows it then reveals the app.
- [ ] **Step 3:** Mount `LoadingScreen` in `App.jsx` above `<Routes>`, controlled by a `useState(true)` that flips after `window.load` or the timer (whichever later).
- [ ] **Step 4:** Verify in `pnpm dev` — loader shows on refresh, then fades. `pnpm build` exits 0.
- [ ] **Step 5: Commit**
```bash
git add src/components/ src/data 2>/dev/null; git add -A
git commit -m "feat: 8-bit loading screen + spinner"
```

---

### Task 1.2: Navbar extracted + wired to routes

**Files:**
- Create: `src/components/layout/Navbar.jsx`
- Modify: `src/components/pages/Home.jsx` (use shared Navbar)

- [ ] **Step 1:** Move the existing nav markup from `Home.jsx` into `Navbar.jsx`, importing `navItems` from `@/data/site.js`. In-page anchors (`#projects`, etc.) use hash links; add a `/blog` route link.
- [ ] **Step 2:** Render `<Navbar />` in `Home.jsx` and `Blog.jsx` (and `BlogPost.jsx`).
- [ ] **Step 3:** Verify nav works on every route; mobile menu still toggles. `pnpm build` exits 0.
- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "refactor: shared Navbar across routes"
```

---

# PHASE 2 — GitHub data (hybrid)

### Task 2.1: GitHub data shaper (pure, with test)

**Files:**
- Create: `src/lib/github.js`
- Create: `tests/github.test.mjs`

- [ ] **Step 1: Write the failing test** — `tests/github.test.mjs`

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { shapeGithubData } from "../src/lib/github.js";

test("shapeGithubData extracts the stat fields we render", () => {
  const raw = {
    user: { public_repos: 42, followers: 100, following: 7 },
    starsTotal: 256,
    contributions: { total: 1234, weeks: [] },
  };
  const out = shapeGithubData(raw);
  assert.equal(out.repos, 42);
  assert.equal(out.followers, 100);
  assert.equal(out.stars, 256);
  assert.equal(out.contributionsTotal, 1234);
  assert.ok(Array.isArray(out.weeks));
  assert.ok(typeof out.updatedAt === "string");
});

test("shapeGithubData is defensive against missing fields", () => {
  const out = shapeGithubData({});
  assert.equal(out.repos, 0);
  assert.equal(out.stars, 0);
  assert.deepEqual(out.weeks, []);
});
```

- [ ] **Step 2:** Run `node --test tests/github.test.mjs` → FAIL (module missing).
- [ ] **Step 3: Implement `src/lib/github.js`**

```js
export function shapeGithubData(raw = {}) {
  const user = raw.user || {};
  const contributions = raw.contributions || {};
  return {
    repos: user.public_repos ?? 0,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    stars: raw.starsTotal ?? 0,
    contributionsTotal: contributions.total ?? 0,
    weeks: Array.isArray(contributions.weeks) ? contributions.weeks : [],
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}
```

- [ ] **Step 4:** Run `node --test tests/github.test.mjs` → PASS (2 tests).
- [ ] **Step 5: Commit**
```bash
git add src/lib/github.js tests/github.test.mjs
git commit -m "feat: pure GitHub data shaper with tests"
```

---

### Task 2.2: Build-time fetch script + snapshot

**Files:**
- Create: `scripts/fetch-github.mjs`
- Create: `src/data/github.json` (generated; commit an initial snapshot)
- Modify: `package.json` (add `prebuild` + `fetch:github` scripts)

- [ ] **Step 1: Write `scripts/fetch-github.mjs`**

Fetch the public REST profile (`https://api.github.com/users/rifolio`), sum stars across repos (`/users/rifolio/repos?per_page=100`), and fetch the contribution calendar from a public contributions endpoint (e.g. `https://github-contributions-api.jogruber.de/v4/rifolio?y=last`). Use the `GITHUB_TOKEN` env var as a Bearer header when present (raises rate limit in CI). Pass the combined raw object through `shapeGithubData` (import from `../src/lib/github.js`) and write `src/data/github.json` with 2-space indentation. On any network error, log a warning and exit 0 without overwriting an existing snapshot (build must never fail on GitHub being down).

```js
import { writeFile, readFile } from "node:fs/promises";
import { shapeGithubData } from "../src/lib/github.js";

const USER = "rifolio";
const OUT = new URL("../src/data/github.json", import.meta.url);
const headers = { "User-Agent": USER, Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function main() {
  try {
    const user = await fetch(`https://api.github.com/users/${USER}`, { headers }).then((r) => r.json());
    const repos = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100`, { headers }).then((r) => r.json());
    const starsTotal = Array.isArray(repos) ? repos.reduce((n, r) => n + (r.stargazers_count || 0), 0) : 0;
    const contribRaw = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`).then((r) => r.json());
    const contributions = {
      total: contribRaw?.total ? Object.values(contribRaw.total).reduce((a, b) => a + b, 0) : 0,
      weeks: contribRaw?.contributions || [],
    };
    const shaped = shapeGithubData({ user, starsTotal, contributions, updatedAt: new Date().toISOString() });
    await writeFile(OUT, JSON.stringify(shaped, null, 2) + "\n");
    console.log("github.json updated:", shaped.repos, "repos,", shaped.stars, "stars");
  } catch (err) {
    console.warn("fetch-github failed, keeping existing snapshot:", err.message);
    try { await readFile(OUT); } catch { await writeFile(OUT, JSON.stringify(shapeGithubData({}), null, 2) + "\n"); }
  }
}
main();
```

- [ ] **Step 2: Add scripts to `package.json`**
```json
"fetch:github": "node scripts/fetch-github.mjs",
"prebuild": "node scripts/fetch-github.mjs"
```

- [ ] **Step 3: Generate the initial snapshot**

Run: `pnpm fetch:github`
Expected: `src/data/github.json` exists with real numbers (or a defensive zero snapshot if offline).

- [ ] **Step 4: Verify build runs prebuild**

Run: `pnpm build` → prebuild logs the github update, build exits 0.

- [ ] **Step 5: Commit**
```bash
git add scripts/fetch-github.mjs src/data/github.json package.json
git commit -m "feat: build-time GitHub snapshot fetch (prebuild)"
```

---

### Task 2.3: useGithub hook (snapshot-first + live refresh)

**Files:**
- Create: `src/hooks/use-github.js`

- [ ] **Step 1: Implement the hook**

```js
import { useEffect, useState } from "react";
import snapshot from "@/data/github.json";
import { shapeGithubData } from "@/lib/github.js";

const USER = "rifolio";

export function useGithub() {
  const [data, setData] = useState(snapshot);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    setRefreshing(true);
    fetch(`https://api.github.com/users/${USER}`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("rate-limited"))))
      .then((user) => {
        if (!active) return;
        // keep snapshot's stars + contributions (not in this endpoint), refresh the rest
        setData((prev) => shapeGithubData({
          user,
          starsTotal: prev.stars,
          contributions: { total: prev.contributionsTotal, weeks: prev.weeks },
          updatedAt: new Date().toISOString(),
        }));
      })
      .catch(() => {})
      .finally(() => active && setRefreshing(false));
    return () => { active = false; };
  }, []);

  return { data, refreshing };
}
```

- [ ] **Step 2:** Verify `pnpm build` exits 0 (hook compiles, JSON import works).
- [ ] **Step 3: Commit**
```bash
git add src/hooks/use-github.js
git commit -m "feat: useGithub snapshot-first hook with live refresh"
```

---

### Task 2.4: GithubStats section (stats + commits-grid)

**Files:**
- Install: `commits-grid` (link in spec)
- Create: `src/components/sections/GithubStats.jsx`

- [ ] **Step 1:** Install `commits-grid`. Run `pnpm build` → exits 0.
- [ ] **Step 2:** Build `GithubStats.jsx`: call `useGithub()`, reuse the existing `AnimatedStat` counter (move it from `Home.jsx` into this section or a shared component) for repos/followers/stars/contributions, render `commits-grid` from `data.weeks`. Show the 8bit-spinner while `refreshing` is true next to a small "syncing…" label. Map the snapshot's `weeks` shape to whatever `commits-grid` expects (adapter inline).
- [ ] **Step 3:** Verify visually in `pnpm dev`; numbers animate, grid renders. `pnpm build` exits 0.
- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "feat: GitHub stats + contributions commits-grid"
```

**REVIEW CHECKPOINT — end of Phase 2.** Real GitHub data renders.

---

# PHASE 3 — Home sections

### Task 3.1: Hero with text-scramble

**Files:**
- Install: `text-scramble` (link in spec)
- Create: `src/components/sections/Hero.jsx`

- [ ] **Step 1:** Install `text-scramble`. `pnpm build` → 0.
- [ ] **Step 2:** Build `Hero.jsx` from the existing hero markup in `Home.jsx`: name + role decode in via text-scramble; keep the existing gradient/metallic name treatment and profile picture (`@/assets/photo.jpg`); keep CTA buttons. Preserve existing framer-motion entrance.
- [ ] **Step 3:** Verify visually. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: hero section with text-scramble`

---

### Task 3.2: About / "What I build" panel (8bit-advanced1)

**Files:**
- Install: `8bit-advanced1`
- Create: `src/components/sections/About.jsx`

- [ ] **Step 1:** Install `8bit-advanced1`. `pnpm build` → 0.
- [ ] **Step 2:** Build `About.jsx`: short bio paragraph (reuse existing copy) beside the 8-bit code/terminal panel listing what you build (Python/ML, React, LLM apps). Section header uses text-scramble-on-scroll.
- [ ] **Step 3:** Verify. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: about section with 8-bit code panel`

---

### Task 3.3: Experience timeline

**Files:** Create `src/components/sections/Experience.jsx`

- [ ] **Step 1:** Render `experience` from `@/data/experience.js` as a vertical timeline (reuse existing card styling). No new component needed.
- [ ] **Step 2:** Verify. `pnpm build` → 0.
- [ ] **Step 3: Commit** `feat: experience timeline section`

---

### Task 3.4: Projects carousel (8bit-carousel)

**Files:**
- Install: `8bit-carousel`
- Create: `src/components/sections/Projects.jsx`

- [ ] **Step 1:** Install `8bit-carousel`. `pnpm build` → 0.
- [ ] **Step 2:** Build `Projects.jsx`: map `projects` from `@/data/projects.js` into carousel slides, preserving the existing project card content (cover image, title, company, description) and the existing click-to-expand detail behavior if feasible; otherwise link each slide to its detail.
- [ ] **Step 3:** Verify carousel navigates, images load. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: projects 8-bit carousel`

---

### Task 3.5: Companies pixel-logo-grid

**Files:**
- Install: `pixel-logo-grid`
- Create: `src/components/sections/Companies.jsx`

- [ ] **Step 1:** Install `pixel-logo-grid`. `pnpm build` → 0.
- [ ] **Step 2:** Build `Companies.jsx`: feed `companies` from `@/data/companies.js`, rendering the existing logo components from `@/components/ui/logos/`. Match grid styling to the linked design.
- [ ] **Step 3:** Verify. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: companies pixel logo grid`

---

### Task 3.6: FAQ / fun facts (8bit-faq1)

**Files:**
- Install: `8bit-faq1`
- Create: `src/components/sections/Faq.jsx`

- [ ] **Step 1:** Install `8bit-faq1`. `pnpm build` → 0.
- [ ] **Step 2:** Build `Faq.jsx` from `@/data/faq.js`.
- [ ] **Step 3:** Verify accordion opens. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: 8-bit FAQ / fun-facts section`

---

# PHASE 4 — Contact, CV, arcade easter egg

### Task 4.1: CV download (animated-download)

**Files:**
- Install: `animated-download`
- Create: `src/components/sections/CvDownload.jsx`

- [ ] **Step 1:** Install `animated-download`. `pnpm build` → 0.
- [ ] **Step 2:** Build `CvDownload.jsx`: the animated-download button triggers a download of `${import.meta.env.BASE_URL}CV.pdf`. Place it in About or Hero per visual fit.
- [ ] **Step 3:** Verify the file downloads in `pnpm dev`. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: animated CV download button`

---

### Task 4.2: Contact form via Web3Forms (8bit-advanced3)

**Files:**
- Install: `8bit-advanced3`
- Create: `src/components/sections/Contact.jsx`
- Modify: `.env.example` (create), document `VITE_WEB3FORMS_KEY`

- [ ] **Step 1:** Install `8bit-advanced3`. `pnpm build` → 0.
- [ ] **Step 2:** Create `.env.example` with `VITE_WEB3FORMS_KEY=your-web3forms-access-key-here` and add a one-line note in `README.md` (owner pastes their real key into `.env`, and into the repo/Actions as a secret for production).
- [ ] **Step 3:** Build `Contact.jsx`: style the 8bit-advanced3 form (name, email, message), on submit POST JSON to `https://api.web3forms.com/submit` with `access_key: import.meta.env.VITE_WEB3FORMS_KEY` plus the fields. Show `sonner` success/error toasts. Disable submit + show 8bit-spinner while pending. If the key is missing, toast a clear "contact form not configured" message instead of POSTing.
- [ ] **Step 4:** Verify happy path (with a real test key) and the missing-key path. `pnpm build` → 0.
- [ ] **Step 5: Commit** `feat: contact form wired to Web3Forms`

---

### Task 4.3: Arcade OTP easter egg (8bit-input-otp)

**Files:**
- Install: `8bit-input-otp`
- Create: `src/components/sections/ArcadeOtp.jsx`

- [ ] **Step 1:** Install `8bit-input-otp`. `pnpm build` → 0.
- [ ] **Step 2:** Build `ArcadeOtp.jsx`: a 6-slot 8-bit OTP labeled like a secret "enter access code". On complete, call `checkArcadeCode(value)` from `@/lib/arcade.js`; if true, `setArcade(true)` from `useArcade()` and fire a celebratory `sonner` toast + (optional) confetti; if false, shake/clear and toast "wrong code". Place it as a small, subtle block near the footer (a "🕹️ ???" teaser).
- [ ] **Step 3:** Verify entering `KONAMI` flips the site into arcade mode (green + scanlines), wrong code does nothing harmful. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: arcade easter-egg OTP unlock`

---

### Task 4.4: Compose Home in final order

**Files:** Modify `src/components/pages/Home.jsx`

- [ ] **Step 1:** Replace the leftover inline markup so `Home.jsx` composes sections in order: `Navbar → Hero → About → GithubStats → Experience → Projects → Companies → Faq → Contact → ArcadeOtp → FooterSection`. Remove now-dead code moved into sections.
- [ ] **Step 2:** Verify the whole homepage scrolls correctly, no duplicate sections, footer (existing `@/components/ui/footer`) renders. `pnpm build` → 0.
- [ ] **Step 3: Commit** `refactor: compose Home from extracted sections in final order`

**REVIEW CHECKPOINT — end of Phase 4.** Homepage complete.

---

# PHASE 5 — Blog

### Task 5.1: Blog loader (pure, with test)

**Files:**
- Create: `src/lib/blog.js`
- Create: `tests/blog.test.mjs`
- Create: `src/content/blog/2026-05-01-hello-world.md`, `src/content/blog/2026-05-20-building-with-ai.md`

- [ ] **Step 1: Write the failing test** — `tests/blog.test.mjs`

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../src/lib/blog.js";

const raw = `---
title: Hello World
date: 2026-05-01
tags: [meta, ai]
slug: hello-world
excerpt: First post.
---
# Body
Hello.`;

test("parseFrontmatter splits meta and body", () => {
  const { meta, body } = parseFrontmatter(raw);
  assert.equal(meta.title, "Hello World");
  assert.equal(meta.slug, "hello-world");
  assert.deepEqual(meta.tags, ["meta", "ai"]);
  assert.match(body, /# Body/);
});

test("parseFrontmatter handles missing frontmatter", () => {
  const { meta, body } = parseFrontmatter("just body");
  assert.deepEqual(meta, {});
  assert.equal(body, "just body");
});
```

- [ ] **Step 2:** Run `node --test tests/blog.test.mjs` → FAIL.
- [ ] **Step 3: Implement `src/lib/blog.js`**

Include: `parseFrontmatter(raw)` (regex split on leading `---` block; parse `key: value`, support `[a, b]` arrays and quoted strings — keep it small, no YAML dep), `loadPosts()` using `import.meta.glob("/src/content/blog/*.md", { eager: true, query: "?raw", import: "default" })` → array sorted by `date` desc, and `getPost(slug)`. Example skeleton:
```js
export function parseFrontmatter(raw) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (/^\[.*\]$/.test(val)) val = val.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    else val = val.replace(/^["']|["']$/g, "");
    meta[key] = val;
  }
  return { meta, body: raw.slice(m[0].length) };
}

export function loadPosts() {
  const mods = import.meta.glob("/src/content/blog/*.md", { eager: true, query: "?raw", import: "default" });
  return Object.values(mods)
    .map((raw) => { const { meta, body } = parseFrontmatter(raw); return { ...meta, body }; })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function getPost(slug) {
  return loadPosts().find((p) => p.slug === slug) || null;
}
```

- [ ] **Step 4:** Run `node --test tests/blog.test.mjs` → PASS (2 tests). (`loadPosts`/`getPost` rely on Vite glob and are verified in-app, not in node test.)
- [ ] **Step 5:** Write the two sample markdown posts with full frontmatter (`title`, `date`, `tags`, `slug`, `excerpt`) and a few paragraphs + a code block each.
- [ ] **Step 6: Commit**
```bash
git add src/lib/blog.js tests/blog.test.mjs src/content/blog/
git commit -m "feat: markdown blog loader + frontmatter parser with tests"
```

---

### Task 5.2: Blog list page + 8bit-pagination

**Files:**
- Install: `8bit-pagination`
- Modify: `src/components/pages/Blog.jsx`

- [ ] **Step 1:** Install `8bit-pagination`. `pnpm build` → 0.
- [ ] **Step 2:** Build `Blog.jsx`: `loadPosts()`, render post cards (reuse the existing `glass-blog-card` style if it fits) showing title/date/tags/excerpt, each linking to `/blog/:slug`. Paginate client-side (e.g. 6/page) with `8bit-pagination`. Include `<Navbar />`.
- [ ] **Step 3:** Verify list + paging in `pnpm dev`. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: blog list page with 8-bit pagination`

---

### Task 5.3: Blog post page (react-markdown)

**Files:** Modify `src/components/pages/BlogPost.jsx`

- [ ] **Step 1:** Build `BlogPost.jsx`: read `:slug` via `useParams`, `getPost(slug)`; if null, render the NotFound component. Render `body` with `react-markdown` + `remark-gfm`; style headings/code/links to match the theme (map markdown elements to themed components). Show title, date, tags header. Include `<Navbar />` and a "← all posts" link.
- [ ] **Step 2:** Verify a sample post renders with formatting + code block. `pnpm build` → 0.
- [ ] **Step 3: Commit** `feat: blog post page with react-markdown`

**REVIEW CHECKPOINT — end of Phase 5.** Blog fully works.

---

# PHASE 6 — 404, deploy pipeline, polish

### Task 6.1: Custom 404 (not-found-page-1)

**Files:**
- Install: `not-found-page-1`
- Modify: `src/components/pages/NotFound.jsx`

- [ ] **Step 1:** Install `not-found-page-1`. `pnpm build` → 0.
- [ ] **Step 2:** Customize to theme: pixel font heading, "404 — you wandered off the map", a "press start → home" button linking to `/`, on-brand colors. Reuse `bg-pattern` background.
- [ ] **Step 3:** Verify unknown route shows it; home button works. `pnpm build` → 0.
- [ ] **Step 4: Commit** `feat: custom 8-bit 404 page`

---

### Task 6.2: Deploy workflow — daily refresh + token

**Files:** Modify `.github/workflows/gh-pages.yml`

- [ ] **Step 1:** Add a `schedule:` cron (e.g. daily `0 6 * * *`) to the `on:` triggers so the snapshot refreshes daily.
- [ ] **Step 2:** Pass `GITHUB_TOKEN` to the build step env so `prebuild`'s fetch is authenticated:
```yaml
      - name: Build
        env:
          CI: true
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VITE_WEB3FORMS_KEY: ${{ secrets.WEB3FORMS_KEY }}
        run: pnpm build
```
- [ ] **Step 3:** Verify YAML is valid (`pnpm dlx yaml-lint` or a quick parse). Confirm the workflow still builds locally via `CI=true pnpm build`.
- [ ] **Step 4: Commit** `ci: daily GitHub snapshot refresh + tokens in deploy`

---

### Task 6.3: Final pass — lint, dead code, full build, all tests

**Files:** repo-wide

- [ ] **Step 1:** Remove any now-unused imports/code left in `Home.jsx`/old `App.jsx`. Run `pnpm lint` and fix new issues in created files.
- [ ] **Step 2:** Run all unit tests: `node --test tests/*.mjs` → all PASS.
- [ ] **Step 3:** Run `pnpm build` → exits 0. Run `pnpm preview`, click through `/`, `/blog`, a post, a bad URL, and the arcade unlock. Confirm each works.
- [ ] **Step 4:** Update `README.md`: note `VITE_WEB3FORMS_KEY`, the arcade code location, and the GitHub snapshot script.
- [ ] **Step 5: Commit** `chore: final lint, cleanup, docs`

**FINAL CHECKPOINT.** Full site verified end-to-end.

---

## Self-Review (against spec)

- **Concept / Direction B** → Phase 0.2 (fonts/tokens), accents threaded through Phases 1–6; arcade isolated to Task 0.3/4.3. ✓
- **Every liked component placed** → loading-screen (1.1), spinner (1.1/2.4/4.2), commits-grid (2.4), text-scramble (3.1/3.2), 8bit-advanced1 (3.2), 8bit-carousel (3.4), pixel-logo-grid (3.5), 8bit-faq1 (3.6), animated-download (4.1), 8bit-advanced3 (4.2), 8bit-input-otp (4.3), 8bit-pagination (5.2), not-found-page-1 (6.1), footer + bg-pattern (already installed, reused in 4.4/6.1). ✓
- **Routes `/ /blog /blog/:slug *`** → Task 0.5; SPA 404 fallback included. ✓
- **GitHub hybrid (snapshot + live)** → Tasks 2.1–2.4 + daily cron 6.2. ✓
- **Blog in Markdown** → Tasks 5.1–5.3. ✓
- **Contact via Web3Forms** → Task 4.2. ✓
- **Arcade easter egg via OTP** → Tasks 0.3 + 4.3. ✓
- **Reuse existing content (projects/experience/companies/CV/photo)** → Task 0.4, 3.x, 4.1. ✓
- **Out of scope respected** (no auth/db/CMS/analytics, pipeline shape kept) → only extends existing workflow. ✓
- **Placeholder scan:** `/* ... */` markers are explicit "copy exact existing content" / "owner edits" pointers tied to real source locations, not unfinished logic. Web3Forms key is an intentional user-supplied secret. No TBD/TODO logic. ✓
- **Type consistency:** `shapeGithubData` shape (`repos/followers/stars/contributionsTotal/weeks/updatedAt`) used identically in 2.1/2.2/2.3/2.4; `checkArcadeCode`/`ARCADE_CODE` consistent 0.3/4.3; `parseFrontmatter`/`loadPosts`/`getPost` consistent 5.1/5.2/5.3. ✓
