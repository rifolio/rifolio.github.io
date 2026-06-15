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
