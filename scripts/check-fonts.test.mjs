// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { checkFonts } from "./check-fonts.mjs";

const build = (files) => {
  const directory = mkdtempSync(path.join(tmpdir(), "check-fonts-"));
  for (const [name, body] of Object.entries(files)) {
    mkdirSync(path.join(directory, name, ".."), { recursive: true });
    writeFileSync(path.join(directory, name), body);
  }
  return directory;
};

test("a font URL under the base path that resolves to a file passes", () => {
  const directory = build({
    "assets/app.css":
      '@font-face{src:url("/sub/fonts/a.woff2") format("woff2")}',
    "fonts/a.woff2": "x",
    "index.html":
      '<link rel="preload" href="/sub/fonts/a.woff2"><style>@font-face{src:url("/sub/fonts/a.woff2")}</style>',
  });
  const result = checkFonts(directory, "/sub/");
  assert.deepEqual(result.broken, []);
  assert.equal(result.checked, 3);
});

test("a bare /fonts/ URL fails in a sub-path build", () => {
  const directory = build({
    "assets/app.css": '@font-face{src:url("/fonts/a.woff2")}',
    "fonts/a.woff2": "x",
  });
  assert.deepEqual(checkFonts(directory, "/sub/").broken, [
    {
      file: path.join("assets", "app.css"),
      url: "/fonts/a.woff2",
      why: "not under /sub/",
    },
  ]);
});

test("a font URL with no file behind it fails", () => {
  const directory = build({
    "index.html": '<link rel="preload" href="/sub/fonts/missing.woff2">',
  });
  assert.equal(checkFonts(directory, "/sub/").broken[0].why, "no such file");
});

test("a build with no font URLs at all fails, so the check can't pass by accident", () => {
  const directory = build({ "index.html": "<p>no fonts</p>" });
  assert.equal(checkFonts(directory, "/sub/").checked, 0);
});
