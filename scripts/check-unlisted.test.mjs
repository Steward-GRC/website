// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { check, robotsMeta, robotsProblems } from "./check-unlisted.mjs";

const GOOD_ROBOTS =
  "User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nDisallow: /\n";
const META = '<meta name="robots" content="noindex, nofollow, noarchive">';

const build = ({
  extra = {},
  headers = "X-Robots-Tag: noindex",
  page = META,
  robots = GOOD_ROBOTS,
} = {}) => {
  const directory = mkdtempSync(path.join(tmpdir(), "unlisted-"));
  mkdirSync(path.join(directory, "docs"));
  writeFileSync(
    path.join(directory, "docs", "index.html"),
    `<html><head>${page}</head></html>`,
  );
  if (robots !== null)
    writeFileSync(path.join(directory, "robots.txt"), robots);
  if (headers !== null)
    writeFileSync(path.join(directory, "_headers"), headers);
  for (const [name, text] of Object.entries(extra))
    writeFileSync(path.join(directory, name), text);
  return directory;
};

test("a build that is unlisted everywhere passes", () => {
  assert.deepEqual(check(build()), []);
});

test("a missing robots.txt, header, meta or a sitemap each fail", () => {
  assert.ok(check(build({ robots: null })).includes("no robots.txt"));
  assert.ok(
    check(build({ headers: null })).some((p) => p.includes("X-Robots-Tag")),
  );
  assert.ok(check(build({ page: "" })).some((p) => p.includes("robots meta")));
  assert.ok(
    check(build({ extra: { "sitemap.xml": "<urlset/>" } })).some((p) =>
      p.includes("sitemap.xml"),
    ),
  );
});

test("robots.txt must disallow every group and have no Allow", () => {
  assert.deepEqual(robotsProblems(GOOD_ROBOTS), []);
  assert.ok(robotsProblems("User-agent: *\nAllow: /\n").length > 0);
  assert.ok(robotsProblems("User-agent: GPTBot\nDisallow: /\n").length > 0);
});

test("robotsMeta reads the content of the robots meta only", () => {
  assert.deepEqual(robotsMeta(`${META}<meta name="viewport" content="x">`), [
    "noindex, nofollow, noarchive",
  ]);
});
