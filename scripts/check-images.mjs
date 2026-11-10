// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Fails on any image a built page points at that isn't in the build: every
// <img> src and srcset, <source> srcset, SVG <image> href and every image
// a stylesheet's url() names, on every page of both docs instances and every version. Built with
// a base path (PREVIEW_BASE_PATH), it also catches an image written with a
// root path that skips the base (for example '/img/...' instead of
// useBaseUrl('/img/...')), since that path then points outside the build.
//
// With --site-url, the link-preview images (og:image, twitter:image) on that
// address are checked too.
//
//   node scripts/check-images.mjs <build directory> [--base=/sub/path/] [--site-url=https://...]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ATTRIBUTE =
  /<(?:img|source|image)\b[^>]*?\s(src|srcset|href|xlink:href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
const CSS_URL = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/gi;

const META_IMAGE =
  /<meta\b[^>]*?\b(?:property|name)\s*=\s*["']?(?:og:image|twitter:image)["']?[\s/][^>]*?\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;

// The link-preview images (og:image, twitter:image), which are absolute URLs
// on the site's own address; given that address, they're checked like any
// local image.
export const previewImageUrls = (html, siteUrl) => {
  if (!siteUrl) return [];
  const origin = new URL(siteUrl).origin;
  return [...html.matchAll(META_IMAGE)]
    .map((match) => match[1] ?? match[2] ?? match[3] ?? "")
    .filter((url) => url.startsWith(`${origin}/`))
    .map((url) => new URL(url).pathname);
};

const isLocal = (url) => url && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url);

export const imageUrlsInHtml = (html) => {
  const urls = [];
  for (const match of html.matchAll(ATTRIBUTE)) {
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    const parts =
      match[1].toLowerCase() === "srcset"
        ? value.split(",").map((part) => part.trim().split(/\s+/, 1)[0])
        : [value];
    urls.push(...parts.filter((part) => isLocal(part)));
  }
  return urls;
};

const IMAGE_FILE = /\.(?:png|jpe?g|gif|svg|webp|avif|ico)(?:[?#].*)?$/i;

// Where a URL used on a page (at pagePath, under base) lands in the build,
// or null when it points outside the base.
export const buildPathFor = (url, pagePath, base) => {
  const resolved = new URL(url, `http://localhost${pagePath}`).pathname;
  if (!resolved.startsWith(base)) return null;
  return decodeURIComponent(resolved.slice(base.length));
};

// Images only: a stylesheet's fonts aren't this check's business.
export const imageUrlsInCss = (css) => {
  return [...css.matchAll(CSS_URL)]
    .map((match) => match[1] ?? match[2] ?? match[3] ?? "")
    .filter((url) => isLocal(url) && IMAGE_FILE.test(url));
};

export const missingImages = (root, base = "/", siteUrl) => {
  const missing = [];
  const check = (url, from, pagePath) => {
    const target = buildPathFor(url, pagePath, base);
    if (target === null)
      missing.push(`${from}: ${url} (outside the base path ${base})`);
    else if (!existsSync(path.join(root, target)))
      missing.push(`${from}: ${url}`);
  };
  for (const file of files(root, ".html")) {
    const relativePath = path.relative(root, file).split(path.sep).join("/");
    const pagePath = base + relativePath;
    const html = readFileSync(file, "utf8");
    for (const url of [
      ...imageUrlsInHtml(html),
      ...previewImageUrls(html, siteUrl),
    ]) {
      check(url, relativePath, pagePath);
    }
  }
  for (const file of files(root, ".css")) {
    const relativePath = path.relative(root, file).split(path.sep).join("/");
    for (const url of imageUrlsInCss(readFileSync(file, "utf8")))
      check(url, relativePath, base + relativePath);
  }
  return missing;
};

const files = (directory, extension) => {
  return readdirSync(directory).flatMap((name) => {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) return files(file, extension);
    return name.endsWith(extension) ? [file] : [];
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv
    .slice(2)
    .find((argument) => !argument.startsWith("--"));
  const base =
    process.argv
      .find((argument) => argument.startsWith("--base="))
      ?.slice("--base=".length) ?? "/";
  if (!root) {
    console.error(
      "usage: node scripts/check-images.mjs <build directory> [--base=/sub/path/]",
    );
    process.exit(2);
  }
  const siteUrl = process.argv
    .find((argument) => argument.startsWith("--site-url="))
    ?.slice("--site-url=".length);
  const missing = missingImages(
    root,
    base.endsWith("/") ? base : `${base}/`,
    siteUrl,
  );
  if (missing.length > 0) {
    console.error(
      `${missing.length} missing image(s):\n${missing.slice(0, 50).join("\n")}`,
    );
    process.exit(1);
  }
  console.log(
    `every image the pages in ${root} use is in the build (base ${base})`,
  );
}
