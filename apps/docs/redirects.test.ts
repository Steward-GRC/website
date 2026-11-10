// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";

import { DOCS_MOVES, oldDocsPaths } from "./redirects.ts";

const moves = [
  { from: "/docs/setup", to: "/docs/getting-started" },
  { from: "/docs/old-guides", to: "/docs/guides" },
];

test("the template ships with no moves, so no page has an old path", () => {
  assert.deepEqual(DOCS_MOVES, []);
  assert.deepEqual(oldDocsPaths("/docs/getting-started"), []);
});

test("a moved page answers at its old path, and so does every page under a moved section", () => {
  assert.deepEqual(oldDocsPaths("/docs/getting-started", moves), [
    "/docs/setup",
  ]);
  assert.deepEqual(oldDocsPaths("/docs/guides/backups", moves), [
    "/docs/old-guides/backups",
  ]);
  assert.deepEqual(oldDocsPaths("/docs/guides", moves), ["/docs/old-guides"]);
});

test("the old path keeps the version: vNext and a cut version each redirect within themselves", () => {
  assert.deepEqual(oldDocsPaths("/docs/vnext/getting-started", moves), [
    "/docs/vnext/setup",
  ]);
  assert.deepEqual(oldDocsPaths("/docs/v1.2.0/guides/x", moves), [
    "/docs/v1.2.0/old-guides/x",
  ]);
  assert.deepEqual(oldDocsPaths("/docs/v0.1.0-rc.1/getting-started", moves), [
    "/docs/v0.1.0-rc.1/setup",
  ]);
});

test("a path that only starts with the same letters, or sits outside the docs, gets no redirect", () => {
  assert.deepEqual(oldDocsPaths("/docs/guidesx/a", moves), []);
  assert.deepEqual(oldDocsPaths("/", moves), []);
  assert.deepEqual(oldDocsPaths("/search", moves), []);
});
