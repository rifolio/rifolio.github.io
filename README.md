# Personal Website

- Local dev: `pnpm dev`
- Build: `pnpm build`
- Docker: `docker compose up -d --build` → visit http://localhost:8080

GitHub Pages

- Push to `main` and the GitHub Actions workflow deploys `dist` to Pages.
- The site base path is auto-set from `GITHUB_REPOSITORY` during CI.

## GitHub Stats Snapshot

`src/data/github.json` holds a cached snapshot of GitHub activity (repos, stars, followers, contributions). Regenerate it with:

```
pnpm fetch:github
```

This also runs automatically via the `prebuild` hook (before every `pnpm build`) and is refreshed daily by a CI cron job.
