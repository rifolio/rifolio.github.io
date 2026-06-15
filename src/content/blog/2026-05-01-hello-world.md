---
title: Hello World — Why I Rebuilt My Site From Scratch
date: 2026-05-01
tags: [meta, webdev]
slug: hello-world
excerpt: After years of procrastinating, I finally rebuilt my personal site — here's what I learned and why it matters.
---

## Why Another Portfolio Rebuild?

Every developer has a graveyard of half-finished personal sites. Mine was no different — a static HTML page from 2022 that I kept meaning to "modernise" while the rest of my stack moved on without it. React 19, Vite, TypeScript strict mode, edge deployments — my portfolio didn't reflect any of it.

So I started fresh. And I documented the process here, partly as a forcing function and partly because the decisions I made are worth revisiting.

## What Changed

The previous site was a single `index.html` with inline styles and a copy-pasted template. Functional, but not exactly a conversation starter. This version is:

- Built with React 19 + Vite for fast HMR and modern ESM output
- Deployed via GitHub Pages with a CI pipeline that re-fetches live GitHub stats on every build
- Home to a Markdown-powered blog (you're reading it right now)
- Dark-mode first, with a colour palette I actually enjoy

## The Build Pipeline

One of my favourite small details is how GitHub stats get embedded at build time. A Vite plugin runs a quick API call during `pnpm build` and writes the result to `src/data/github.json`. No client-side fetching, no loading spinners — just static JSON that updates whenever I deploy.

```js
// vite-plugin-github-data.js (simplified)
export default function githubDataPlugin() {
  return {
    name: "github-data",
    async buildStart() {
      const res = await fetch("https://api.github.com/users/rifo");
      const data = await res.json();
      writeFileSync("src/data/github.json", JSON.stringify(data, null, 2));
    },
  };
}
```

Small thing, but it means my public repo count and follower stats are always accurate without any runtime cost.

## What's Next

I'll be writing about the things I'm actually building: RAG pipelines, LLM evals, agent tooling, and the occasional piece on engineering culture. If that sounds interesting, check back soon — or grab the RSS feed when I eventually add one.
