// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  docsInstances,
  docsVersionProblem,
  docsVersions,
  readState,
  releaseVersion,
} from "./docs-version.mjs";

const releaseSource = [
  "export const release = {",
  '  version: "v1.2.3-rc.4",',
  '  kind: "prerelease" as const,',
  "};",
  "export const otherRelease = {",
  '  version: "v2.0.0",',
  "};",
].join("\n");

test("each product's release version is read from packages/frame/release.ts", () => {
  assert.equal(releaseVersion(releaseSource, "release"), "v1.2.3-rc.4");
  assert.equal(releaseVersion(releaseSource, "otherRelease"), "v2.0.0");
  assert.throws(
    () => releaseVersion("export const release = {};", "release"),
    /release/,
  );
  assert.throws(
    () => releaseVersion(releaseSource, "missingRelease"),
    /missingRelease/,
  );
});

test("the docs follow the product's release, in apps/docs/versions.json", () => {
  assert.deepEqual(
    docsInstances.map((instance) => [
      instance.id,
      instance.releaseExport,
      instance.versionsFile,
    ]),
    [["default", "release", "versions.json"]],
  );
  assert.deepEqual(
    docsInstances.map((instance) => instance.cutCommand),
    ["docs:version"],
  );
});

test("no versions file means no docs versions", () => {
  assert.deepEqual(docsVersions(), []);
  assert.throws(() => docsVersions('{"v1": true}'));
});

test("a release with no docs version can't deploy, and the message names the docs", () => {
  assert.match(
    docsVersionProblem("v0.1.0", ["v0.1.0-rc.1"], "docs"),
    /the docs have no v0\.1\.0 version/,
  );
  assert.match(
    docsVersionProblem("v0.1.0", [], "docs"),
    /the docs have no v0\.1\.0 version: run "npm run docs:version"/,
  );
});

test("the release's docs version must be the newest, so it's the default", () => {
  assert.match(
    docsVersionProblem("v0.1.0-rc.1", ["v0.1.0", "v0.1.0-rc.1"], "docs"),
    /isn't the newest/,
  );
  assert.equal(
    docsVersionProblem("v0.1.0", ["v0.1.0", "v0.1.0-rc.1"], "docs"),
    null,
  );
});

test("the repo's own release has its version cut in the docs", () => {
  const state = readState();
  assert.equal(state.length, 1);
  for (const { name, version, versions } of state) {
    assert.equal(docsVersionProblem(version, versions, name), null);
  }
});
