// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Fails unless the built docs are unlisted: a robots.txt that disallows every
// crawler, no sitemap, a robots noindex meta on every page, and the
// X-Robots-Tag header in _headers.
//
//   node scripts/check-unlisted.mjs <build directory>
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const REQUIRED_DIRECTIVES = ["noindex", "nofollow", "noarchive"];

const htmlFiles = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const full = path.join(directory, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith(".html") ? [full] : [];
  });

export const robotsMeta = (html) =>
  [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => /\bname\s*=\s*["']?robots["']?[\s/>]/i.test(tag))
    .map((tag) => tag.match(/\bcontent\s*=\s*"([^"]*)"/i)?.[1] ?? "");

// Every group in a robots.txt must disallow "/", and one group must be "*".
export const robotsProblems = (text) => {
  const problems = [];
  const groups = text
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.replace(/#.*/, "").trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.some((line) => /^user-agent:/i.test(line)));
  if (
    !groups.some((lines) =>
      lines.some((line) => /^user-agent:\s*\*$/i.test(line)),
    )
  ) {
    problems.push("robots.txt has no group for User-agent: *");
  }
  for (const lines of groups) {
    if (!lines.some((line) => /^disallow:\s*\/$/i.test(line))) {
      problems.push(`robots.txt group does not Disallow: /: ${lines[0]}`);
    }
    if (lines.some((line) => /^allow:/i.test(line))) {
      problems.push(`robots.txt group has an Allow: ${lines[0]}`);
    }
  }
  return problems;
};

export const check = (build) => {
  const problems = [];
  const robots = path.join(build, "robots.txt");
  if (existsSync(robots)) {
    problems.push(...robotsProblems(readFileSync(robots, "utf8")));
  } else {
    problems.push("no robots.txt");
  }
  for (const name of readdirSync(build)) {
    if (/sitemap/i.test(name)) problems.push(`${name} must not exist`);
  }
  const headers = path.join(build, "_headers");
  if (
    !existsSync(headers) ||
    !/X-Robots-Tag:\s*noindex/i.test(readFileSync(headers, "utf8"))
  ) {
    problems.push("_headers has no X-Robots-Tag: noindex");
  }
  const pages = htmlFiles(build);
  if (pages.length === 0) problems.push("no HTML pages in the build");
  for (const file of pages) {
    const html = readFileSync(file, "utf8");
    const metas = robotsMeta(html);
    const relative = path.relative(build, file);
    if (metas.length !== 1) {
      problems.push(`${relative}: ${metas.length} robots meta tags, want 1`);
      continue;
    }
    for (const directive of REQUIRED_DIRECTIVES) {
      if (!metas[0].includes(directive)) {
        problems.push(`${relative}: robots meta lacks ${directive}`);
      }
    }
    if (/sitemap/i.test(html.replaceAll(/<script[\s\S]*?<\/script>/gi, ""))) {
      problems.push(`${relative}: mentions a sitemap`);
    }
  }
  return problems;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const build = process.argv[2];
  if (!build) {
    console.error("usage: check-unlisted.mjs <build directory>");
    process.exit(2);
  }
  const problems = check(build);
  for (const problem of problems) console.error(`unlisted check: ${problem}`);
  if (problems.length > 0) process.exit(1);
  console.log("unlisted check passed");
}
