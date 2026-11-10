// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";

import { foldedTitle, nextFold, visibleCrumbs } from "./breadcrumb-fold.ts";

test("a trail that fits doesn't fold", () => {
  assert.equal(
    nextFold({ count: 4, cut: false, folded: 0, overflows: false }),
    0,
  );
});

test("a trail that overflows, or cuts the page's name, folds one more crumb, oldest first", () => {
  assert.equal(
    nextFold({ count: 4, cut: false, folded: 0, overflows: true }),
    1,
  );
  assert.equal(
    nextFold({ count: 4, cut: true, folded: 1, overflows: false }),
    2,
  );
});

test("the current page never folds; past that its name ends in an ellipsis instead", () => {
  assert.equal(
    nextFold({ count: 4, cut: true, folded: 3, overflows: true }),
    3,
  );
  assert.equal(
    nextFold({ count: 1, cut: true, folded: 0, overflows: true }),
    0,
  );
});

test("the folded crumbs show as one … item whose title names them", () => {
  const labels = [
    "Admin guide",
    "Targets and connections",
    "Windows Domain Account",
  ];
  assert.deepEqual(
    visibleCrumbs(labels, 0),
    labels.map((label) => ({ index: labels.indexOf(label), label })),
  );
  assert.deepEqual(visibleCrumbs(labels, 2), [
    { index: -1, label: "…" },
    { index: 2, label: "Windows Domain Account" },
  ]);
  assert.equal(foldedTitle(labels, 2), "Admin guide › Targets and connections");
  assert.equal(foldedTitle(labels, 0), "");
});
