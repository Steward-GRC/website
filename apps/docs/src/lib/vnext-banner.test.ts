// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import { release } from "@product/frame/release";
import assert from "node:assert/strict";
import { test } from "node:test";

import { vnextBannerText } from "./vnext-banner.ts";

test("the vNext banner names the upcoming and the current release", () => {
  assert.equal(
    vnextBannerText({ upcoming: "v1.1.0", version: "v1.0.0" }),
    "This page describes planned work, or work that may ship soon in v1.1.0. The current release is v1.0.0.",
  );
});

test("the banner reads the versions from packages/frame/release.ts", () => {
  assert.match(
    vnextBannerText(release),
    new RegExp(
      `soon in ${release.upcoming}\\. The current release is ${release.version}\\.$`,
    ),
  );
});
