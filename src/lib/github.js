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
