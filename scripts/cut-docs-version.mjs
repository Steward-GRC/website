// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Cuts the docs version for the current release: snapshots vNext
// (apps/docs/docs) under the version in packages/frame/release.ts. Run it
// in the release's own PR, after the version bump, and commit what it writes.
import { execFileSync } from "node:child_process";

import { readState } from "./docs-version.mjs";

for (const {
  cutCommand,
  name,
  version,
  versions,
  versionsFile,
} of readState()) {
  if (versions.includes(version)) {
    console.log(
      `${name} docs version ${version} is already cut; nothing to do`,
    );
    continue;
  }
  console.log(
    `cutting ${name} docs version ${version} (existing: ${versions.join(", ") || "none"})`,
  );
  execFileSync("npx", ["docusaurus", cutCommand, version], {
    cwd: new URL("../apps/docs/", import.meta.url),
    stdio: "inherit",
  });
  console.log(
    `cut ${name} docs version ${version}: commit apps/docs/${versionsFile} and its snapshot`,
  );
}
