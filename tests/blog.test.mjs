import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../src/lib/blog.js";

const raw = `---
title: Hello World
date: 2026-05-01
tags: [meta, ai]
slug: hello-world
excerpt: First post.
---
# Body
Hello.`;

test("parseFrontmatter splits meta and body", () => {
  const { meta, body } = parseFrontmatter(raw);
  assert.equal(meta.title, "Hello World");
  assert.equal(meta.slug, "hello-world");
  assert.deepEqual(meta.tags, ["meta", "ai"]);
  assert.match(body, /# Body/);
});

test("parseFrontmatter handles missing frontmatter", () => {
  const { meta, body } = parseFrontmatter("just body");
  assert.deepEqual(meta, {});
  assert.equal(body, "just body");
});
