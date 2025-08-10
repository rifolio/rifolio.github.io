import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isCI = process.env.CI === "true";
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const ciBase = repoName ? `/${repoName}/` : "/";
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
