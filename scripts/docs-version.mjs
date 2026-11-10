// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import { existsSync, readFileSync } from "node:fs";

// The docs are versioned after the product's release: the version in
// packages/frame/release.ts (`release`) must be cut in apps/docs/versions.json
// before a release can deploy. The list form leaves room for a product that
// adds a second docs instance with its own versions file.
export const docsInstances = [
  {
    cutCommand: "docs:version",
    id: "default",
    name: "docs",
    releaseExport: "release",
    versionsFile: "versions.json",
  },
];

// Why a release can't deploy these docs, or null when it can: the release's
// version has to be cut and be the newest, so it's the default.
export const docsVersionProblem = (version, versions, name) => {
  if (!versions.includes(version)) {
    return `the ${name} have no ${version} version: run "npm run docs:version" and merge it before publishing the release`;
  }
  if (versions[0] !== version) {
    return `${version} is cut in the ${name} but isn't the newest version there (${versions[0]} is), so it wouldn't be the default`;
  }
  return null;
};

// The cut docs versions of one instance, newest first.
export const docsVersions = (json) => {
  if (json === undefined) return [];
  const versions = JSON.parse(json);
  if (!Array.isArray(versions) || versions.some((v) => typeof v !== "string")) {
    throw new Error("a docs versions file must be an array of version names");
  }
  return versions;
};

// A product's release version from packages/frame/release.ts, read as text
// so plain Node can run this without a TypeScript loader.
export const releaseVersion = (source, exportName) => {
  const match = source.match(
    new RegExp(
      `export const ${exportName}\\s*=\\s*\\{[^}]*?version:\\s*"(v[^"]+)"`,
    ),
  );
  if (!match)
    throw new Error(`packages/frame/release.ts has no ${exportName} version`);
  return match[1];
};

export const paths = {
  docs: new URL("../apps/docs/", import.meta.url),
  release: new URL("../packages/frame/release.ts", import.meta.url),
};

// Each instance with its release version and its cut versions.
export const readState = () => {
  const source = readFileSync(paths.release, "utf8");
  return docsInstances.map((instance) => {
    const file = new URL(instance.versionsFile, paths.docs);
    return {
      ...instance,
      version: releaseVersion(source, instance.releaseExport),
      versions: docsVersions(
        existsSync(file) ? readFileSync(file, "utf8") : undefined,
      ),
    };
  });
};
