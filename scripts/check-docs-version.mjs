// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Fails unless the docs have a version cut for the product's current release
// (packages/frame/release.ts), as the newest one. The deploy
// workflow runs it before building either site, so a release can't go out
// with docs that are missing its version.
import { docsVersionProblem, readState } from "./docs-version.mjs";

let failed = false;
for (const { name, version, versions } of readState()) {
  console.log(
    `${name}: release ${version}; docs versions: ${versions.join(", ") || "none"}`,
  );
  const problem = docsVersionProblem(version, versions, name);
  if (problem) {
    console.error(`docs version check failed: ${problem}`);
    failed = true;
  } else {
    console.log(
      `docs version check passed: ${version} is the default ${name} version`,
    );
  }
}
if (failed) process.exit(1);
