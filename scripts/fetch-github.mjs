import { writeFile, readFile } from "node:fs/promises";
import { fetchGithub, shapeGithubData } from "../src/lib/github.js";

const USER = "rifolio";
const OUT = new URL("../src/data/github.json", import.meta.url);
const headers = { "User-Agent": USER };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

try {
  const shaped = await fetchGithub(USER, headers);
  await writeFile(OUT, JSON.stringify(shaped, null, 2) + "\n");
  console.log("github.json updated:", shaped.repos, "repos,", shaped.stars, "stars");
} catch (err) {
  console.warn("fetch-github failed, keeping existing snapshot:", err.message);
  try { await readFile(OUT); } catch { await writeFile(OUT, JSON.stringify(shapeGithubData({}), null, 2) + "\n"); }
}
