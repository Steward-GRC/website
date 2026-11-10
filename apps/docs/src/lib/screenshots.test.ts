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
const docs = new URL("../../docs/", import.meta.url);

const used = readdirSync(docs)
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

test("every slot is used on exactly one page, and every use is a known slot", () => {
  assert.deepEqual([...used].toSorted(), Object.keys(manifest).toSorted());
});

test("a slot is ready only when its picture exists, and the other way round", () => {
  for (const [slot, { ready }] of Object.entries(manifest)) {
    const file = new URL(`../../static/img/guide/${slot}.png`, import.meta.url);
    assert.equal(existsSync(file), ready === true, slot);
  }
});
