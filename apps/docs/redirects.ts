// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// When a docs page moves, its old path should keep answering, so links
// already out there keep working. Each entry names a path prefix a page used
// to live under (`from`) and the prefix it lives under now (`to`); a page
// under `to` then also answers at the same path under `from`, in every
// version. Used as @docusaurus/plugin-client-redirects' createRedirects.
//
// The template ships with no moves. Add one when a page or a section moves,
// for example {from: '/docs/setup', to: '/docs/getting-started'}.
export interface DocsMove {
  from: string;
  to: string;
}

export const DOCS_MOVES: DocsMove[] = [];

const under = (path: string, prefix: string): null | string => {
  if (path === prefix) return "";
  return path.startsWith(`${prefix}/`) ? path.slice(prefix.length) : null;
};

// The version segments a page path can carry after /docs: none (the default
// version), vnext, or a cut version such as v1.2.0.
const VERSION = /^\/docs\/(vnext|v\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)(?=\/|$)/;

export const oldDocsPaths = (
  path: string,
  moves: DocsMove[] = DOCS_MOVES,
): string[] => {
  const version = path.match(VERSION)?.[1];
  // Moves are written against the default version's paths; a versioned page
  // is matched with its version segment taken out and put back after.
  const plain = version
    ? `/docs${path.slice(`/docs/${version}`.length)}`
    : path;
  const withVersion = (docsPath: string) =>
    version ? `/docs/${version}${docsPath.slice("/docs".length)}` : docsPath;
  const old: string[] = [];
  for (const move of moves) {
    const rest = under(plain, move.to);
    if (rest !== null) old.push(withVersion(`${move.from}${rest}`));
  }
  return old;
};
