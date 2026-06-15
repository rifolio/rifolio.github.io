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
