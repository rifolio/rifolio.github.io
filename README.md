# Personal Website

- Local dev: `pnpm dev`
- Build: `pnpm build`
- Docker: `docker compose up -d --build` → visit http://localhost:8080

GitHub Pages

- Push to `main` and the GitHub Actions workflow deploys `dist` to Pages.
- The site base path is auto-set from `GITHUB_REPOSITORY` during CI.

## Assistant Chat

A floating assistant chat is included. It will call your backend when you provide an endpoint.

- Set the API URL via env: create a `.env` file with:

```
VITE_CHAT_API_URL=https://your-assistant-endpoint.example.com/chat
```

- The assistant sends the conversation as `{ messages: Array<{ role: "user"|"assistant", content: string }> }` via POST JSON and expects a JSON response containing one of these fields: `{ reply: string }`, `{ message: string }`, or `{ answer: string }`. Plain text responses are also supported.

- Without `VITE_CHAT_API_URL`, it returns a local fallback message so you can test the UI.
