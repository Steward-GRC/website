// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8")) as Record<
    string,
    Record<string, unknown>
  >;
const manifest = read("../data/screenshots.json");
const capture = read("../../screenshots/slots.json");
// The working copy and every cut version hold the same guide pages.
const directories = [
  new URL("../../docs/", import.meta.url),
  ...readdirSync(new URL("../../versioned_docs/", import.meta.url)).map(
    (name) => new URL(`../../versioned_docs/${name}/`, import.meta.url),
  ),
];
const usedIn = (docs: URL) =>
  readdirSync(docs)
    .filter((name) => name.endsWith(".md"))
    .flatMap((name) =>
      [
        ...readFileSync(new URL(name, docs), "utf8").matchAll(
          /<Screenshot slot="([^"]+)"/g,
        ),
      ].map((match) => match[1]),
    );

test("the capture list and the manifest name the same slots", () => {
  assert.deepEqual(
    Object.keys(manifest).toSorted(),
    Object.keys(capture).toSorted(),
  );
});

test("every slot is used once in each version of the guide, and every use is a known slot", () => {
  for (const directory of directories) {
    assert.deepEqual(
      usedIn(directory).toSorted(),
      Object.keys(manifest).toSorted(),
      directory.pathname,
    );
  }
});

test("a slot is ready only when its picture exists, and the other way round", () => {
  for (const [slot, { ready }] of Object.entries(manifest)) {
    const file = new URL(`../../static/img/guide/${slot}.png`, import.meta.url);
    assert.equal(existsSync(file), ready === true, slot);
  }
});
