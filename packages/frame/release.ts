// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// The current release, the one version both sites show: the site's release
// strip and Releases page read it, and it is the docs version a release
// deploys, so apps/docs/versions.json must list it before a release can go
// out (scripts/check-docs-version.mjs). `upcoming` is the release being
// built, named on every vNext docs page.
export const release = {
  kind: "release" as "prerelease" | "release",
  publishedOn: "2026-11-10",
  upcoming: "v1.0.0",
  version: "v0.1.0",
};
