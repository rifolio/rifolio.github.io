import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(() => {
  const isCI = process.env.CI === "true";
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const isUserOrgPages = repoName?.endsWith(".github.io");
  const ciBase = isUserOrgPages ? "/" : repoName ? `/${repoName}/` : "/";
  return {
    plugins: [react(), tailwindcss()],
    base: isCI ? ciBase : "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
