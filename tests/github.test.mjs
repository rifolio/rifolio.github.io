import { test } from "node:test";
import assert from "node:assert/strict";
import { shapeGithubData } from "../src/lib/github.js";

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
