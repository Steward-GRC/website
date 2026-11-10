// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";

import { stripEmoji } from "./emoji.ts";

test("a leading emoji and its space come off a label", () => {
  assert.equal(stripEmoji("\u{1F510} What is Example?"), "What is Example?");
  assert.equal(stripEmoji("\u{270B} Approving requests"), "Approving requests");
});

test("emoji with a variation selector, a modifier or a joiner come off whole", () => {
  assert.equal(
    stripEmoji("\u{2638}\u{FE0F} Deploy with Helm"),
    "Deploy with Helm",
  );
  assert.equal(stripEmoji("\u{1F5A5}\u{FE0F} The web UI"), "The web UI");
  assert.equal(stripEmoji("\u{1F44B}\u{1F3FD} Hello"), "Hello");
  assert.equal(
    stripEmoji("\u{1F9D1}\u{200D}\u{1F4BB} Contributing"),
    "Contributing",
  );
  assert.equal(stripEmoji("Keys \u{1F511} stay put"), "Keys stay put");
});

test("text symbols that only look like emoji stay", () => {
  assert.equal(
    stripEmoji("Example\u{2122} and \u{A9}, \u{AE}"),
    "Example\u{2122} and \u{A9}, \u{AE}",
  );
  assert.equal(
    stripEmoji("A \u{2194} B, step 1 \u{2192} 2"),
    "A \u{2194} B, step 1 \u{2192} 2",
  );
  assert.equal(stripEmoji("RFC 5280 #1"), "RFC 5280 #1");
});

test("markup in a heading survives", () => {
  assert.equal(
    stripEmoji("\u{1F4C4} Config: <code>config.yaml</code>"),
    "Config: <code>config.yaml</code>",
  );
});
