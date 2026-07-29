import { test } from "node:test";
import assert from "node:assert/strict";
import { shapeGithubData, isStale, GITHUB_TTL_MS } from "../src/lib/github.js";

test("isStale gates refetching to once an hour", () => {
  const now = Date.parse("2026-07-29T12:00:00.000Z");
  const at = (msAgo) => ({ updatedAt: new Date(now - msAgo).toISOString() });
  assert.equal(isStale(at(0), now), false);
  assert.equal(isStale(at(GITHUB_TTL_MS - 1000), now), false);
  assert.equal(isStale(at(GITHUB_TTL_MS + 1000), now), true);
  assert.equal(isStale({}, now), true); // no timestamp → fetch
  assert.equal(isStale({ updatedAt: "garbage" }, now), true);
});

test("shapeGithubData extracts the stat fields we render", () => {
  const raw = {
    user: { public_repos: 42, followers: 100, following: 7 },
    starsTotal: 256,
    contributions: { total: 1234, weeks: [] },
  };
  const out = shapeGithubData(raw);
  assert.equal(out.repos, 42);
  assert.equal(out.followers, 100);
  assert.equal(out.stars, 256);
  assert.equal(out.contributionsTotal, 1234);
  assert.ok(Array.isArray(out.weeks));
  assert.ok(typeof out.updatedAt === "string");
});

test("shapeGithubData is defensive against missing fields", () => {
  const out = shapeGithubData({});
  assert.equal(out.repos, 0);
  assert.equal(out.stars, 0);
  assert.deepEqual(out.weeks, []);
});
