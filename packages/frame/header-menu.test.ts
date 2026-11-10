// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";

import { HEADER_MENU_BREAKPOINT, nextMenuState } from "./header-menu-config.ts";

test("the header switches to the menu under 1050px, where all the links still fit a nav gap clear of the wordmark", () => {
  assert.equal(HEADER_MENU_BREAKPOINT, 1050);
});

test("the menu opens on the button and closes on the button, Escape, a link or a click outside", () => {
  assert.equal(nextMenuState(false, "toggle"), true);
  assert.equal(nextMenuState(true, "toggle"), false);
  for (const event of ["escape", "link", "outside"] as const) {
    assert.equal(nextMenuState(true, event), false, event);
    assert.equal(nextMenuState(false, event), false, event);
  }
});
