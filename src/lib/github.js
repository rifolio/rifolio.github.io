export const GITHUB_TTL_MS = 60 * 60 * 1000; // refetch at most once an hour

/** Stale when the snapshot is older than the TTL, or has no usable timestamp. */
export function isStale(data, now = Date.now()) {
  return !(now - new Date(data?.updatedAt ?? "").getTime() < GITHUB_TTL_MS);
}

const json = (r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${r.url}`)));

/** Shared by the prebuild script and the browser hook. Rejects if any source fails. */
export async function fetchGithub(user, headers = {}) {
  const gh = { Accept: "application/vnd.github+json", ...headers };
  const [profile, repos, contrib] = await Promise.all([
    fetch(`https://api.github.com/users/${user}`, { headers: gh }).then(json),
    fetch(`https://api.github.com/users/${user}/repos?per_page=100`, { headers: gh }).then(json),
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`).then(json),
  ]);
  return shapeGithubData({
    user: profile,
    starsTotal: repos.reduce((n, r) => n + (r.stargazers_count || 0), 0),
    contributions: {
      total: Object.values(contrib?.total || {}).reduce((a, b) => a + b, 0),
      weeks: contrib?.contributions || [],
    },
    updatedAt: new Date().toISOString(),
  });
}

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
