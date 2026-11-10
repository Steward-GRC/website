// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const file = (name: string) =>
  readFileSync(new URL(`public/${name}`, import.meta.url));

test("the apple-touch-icon is a 180x180 PNG", () => {
  const png = file("apple-touch-icon.png");
  assert.equal(png.subarray(1, 4).toString("latin1"), "PNG", "not a PNG");
  assert.equal(png.readUInt32BE(16), 180, "width");
  assert.equal(png.readUInt32BE(20), 180, "height");
});

test("the light and dark marks and the favicon are SVGs", () => {
  for (const name of [
    "favicon.svg",
    "img/brand/mark-light.svg",
    "img/brand/mark-dark.svg",
  ]) {
    assert.match(
      file(name).toString("utf8"),
      /<svg[\s>]/,
      `${name} is not an SVG`,
    );
  }
});

test("the link-preview card is a 1200x630 PNG", () => {
  const png = file("img/brand/og-card.png");
  assert.equal(png.subarray(1, 4).toString("latin1"), "PNG", "not a PNG");
  assert.equal(png.readUInt32BE(16), 1200, "width");
  assert.equal(png.readUInt32BE(20), 630, "height");
});
