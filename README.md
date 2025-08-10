# Personal Website

- Local dev: `pnpm dev`
- Build: `pnpm build`
- Docker: `docker compose up -d --build` → visit http://localhost:8080

GitHub Pages

- Push to `main` and the GitHub Actions workflow deploys `dist` to Pages.
- The site base path is auto-set from `GITHUB_REPOSITORY` during CI.
