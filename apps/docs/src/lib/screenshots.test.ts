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
const markdownFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
const usedIn = (docs: URL) =>
  markdownFiles(docs.pathname).flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(/<Screenshot slot="([^"]+)"/g)].map(
      (match) => match[1],
    ),
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

test("the list under each picture is the slot's callouts, in order", () => {
  const BLOCK = /<Screenshot slot="([^"]+)"[^>]*\/>\n\n((?:\d+\. .*\n?)+)/g;
  for (const directory of directories) {
    for (const file of markdownFiles(directory.pathname)) {
      for (const match of readFileSync(file, "utf8").matchAll(BLOCK)) {
        const [, slot, list] = match;
        const expected = (capture[slot].callouts as unknown as string[]).map(
          (text, index) => `${index + 1}. ${text}`,
        );
        assert.deepEqual(list.trim().split("\n"), expected, `${file} ${slot}`);
      }
    }
  }
});
