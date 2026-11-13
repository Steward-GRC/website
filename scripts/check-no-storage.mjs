// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";
// Checks that a built site writes nothing to browser storage before the
// visitor accepts the cookie choice, and that the theme follows the
// visitor's system setting until they pick one. Each page loads in jsdom on
// a first visit (empty storage) with localStorage, sessionStorage and
// document.cookie watched, and prefers-color-scheme emulated; any write
// before consent fails the check.
//
// - Every page runs its inline scripts (the prerender level: the head
//   scripts and whatever the page runs before any bundle loads), once with
//   a light system setting and once with a dark one, and must show that
//   theme.
// - With --app=docs, a few pages also load the app bundles and hydrate, and
//   the check uses them as a visitor would. Before an answer: picking a tab
//   stores nothing and doesn't ask; pressing the theme switch opens the
//   cookie bar and leaves the theme alone; the full-width switch stores
//   nothing. After Decline: the theme switch flips the theme for the visit
//   and still stores nothing. After Accept (on a fresh load): the theme
//   switch flips the theme and the choice is stored, which proves the watch
//   works. (The site's bundles are ES modules, which jsdom can't run; the
//   site's switch goes through the same consent and theme code, tested in
//   packages/frame.)
//
//   node scripts/check-no-storage.mjs --app=<site|docs> <build directory>
//     [--prefix=<slug>-docs] [--base=/sub/path/] [--use=<page>]...
//
// --prefix is the storage key prefix the docs' consent store writes under
// (packages/frame/product.ts DOCS_CONSENT_PREFIX), which accepting must
// store; it's required with --app=docs. --base is the base path the build was
// made with (PREVIEW_BASE_PATH). Each --use names a docs page to hydrate and
// use, from the build root; the default is the docs home and the getting
// started page, which has a tab group.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const ORIGIN = "https://example.test";

class BuildLoader extends ResourceLoader {
  constructor(root, base) {
    super();
    this.root = root;
    this.base = base;
  }

  fetch(url) {
    const target = new URL(url);
    if (target.origin !== ORIGIN || !target.pathname.startsWith(this.base))
      return null;
    const file = path.join(
      this.root,
      decodeURIComponent(target.pathname.slice(this.base.length)),
    );
    if (!existsSync(file) || statSync(file).isDirectory()) return null;
    return Promise.resolve(readFileSync(file));
  }
}

// Loads one page. With `root`, the page's own bundles load from the build
// and the app hydrates; without, only its inline scripts run.
export const loadPage = async (
  html,
  { base = "/", file = "page.html", root, scheme = "dark", settleMs = 0 } = {},
) => {
  const writes = [];
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => {
    if (!/Could not parse CSS stylesheet/.test(error.message))
      errors.push(error.message);
  });
  const dom = new JSDOM(html, {
    beforeParse: (window) => watchStorage(window, writes, scheme),
    pretendToBeVisual: true,
    resources: root ? new BuildLoader(root, base) : undefined,
    runScripts: "dangerously",
    url: `${ORIGIN}${base}${file.replace(/index\.html$/, "")}`,
    virtualConsole,
  });
  await new Promise((resolve) => {
    if (dom.window.document.readyState === "complete") resolve();
    else dom.window.addEventListener("load", resolve);
  });
  if (settleMs) await sleep(settleMs);
  return { dom, errors, writes };
};

export const storageWritesIn = async (html, file, scheme = "dark") => {
  const { dom, errors, writes } = await loadPage(html, { file, scheme });
  const theme = dom.window.document.documentElement.dataset.theme;
  dom.window.close();
  return {
    errors: errors.map((error) => `${file}: ${error}`),
    theme,
    writes: writes.map((write) => `${file}: ${write}`),
  };
};

const watchStorage = (window, writes, scheme) => {
  const storage = window.Storage.prototype;
  const { clear, removeItem, setItem } = storage;
  const name = (store) =>
    store === window.sessionStorage ? "sessionStorage" : "localStorage";
  storage.setItem = function (key, value) {
    writes.push(`${name(this)}.setItem(${key})`);
    return setItem.call(this, key, value);
  };
  // Removing a key that isn't there stores nothing, so it isn't counted.
  storage.removeItem = function (key) {
    if (this.getItem(key) !== null)
      writes.push(`${name(this)}.removeItem(${key})`);
    return removeItem.call(this, key);
  };
  storage.clear = function () {
    if (this.length > 0) writes.push(`${name(this)}.clear()`);
    return clear.call(this);
  };
  Object.defineProperty(window.document, "cookie", {
    configurable: true,
    get: () => "",
    set: (value) => {
      writes.push(`document.cookie(${String(value).split("=", 1)[0]})`);
    },
  });
  window.matchMedia = (query) => ({
    addEventListener() {},
    addListener() {},
    matches: query.includes(`prefers-color-scheme: ${scheme}`),
    media: query,
    removeEventListener() {},
    removeListener() {},
  });
  window.IntersectionObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  };
  window.ResizeObserver = window.IntersectionObserver;
  window.scrollTo = () => {};
};

const settle = (ms = 300) => sleep(ms);

const click = async (element) => {
  element?.click();
  await settle();
};

const theme = (document) => document.documentElement.dataset.theme;

const button = (document, label) =>
  [...document.querySelectorAll(".frame-consent__button")].find(
    (b) => b.textContent === label,
  );

const htmlFiles = (directory) => {
  return readdirSync(directory).flatMap((name) => {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) return htmlFiles(file);
    return name.endsWith(".html") ? [file] : [];
  });
};

// Uses a hydrated docs page the way a first-time visitor would, then again
// for a visitor who declines and one who accepts.
const useDocsPage = async (root, file, base, prefix) => {
  const problems = [];
  const fail = (message) => problems.push(`${file}: ${message}`);
  const html = readFileSync(path.join(root, file), "utf8");
  const open = (scheme) =>
    loadPage(html, { base, file, root, scheme, settleMs: 1500 });

  // First visit, light system setting: nothing asked, nothing stored.
  const first = await open("light");
  const document = first.dom.window.document;
  if (!document.querySelector(".theme-toggle"))
    fail("never hydrated (no theme switch)");
  if (theme(document) !== "light")
    fail(`ignored a light system setting (showed ${theme(document)})`);
  if (first.writes.length > 0)
    fail(`wrote on load: ${first.writes.join(", ")}`);
  if (document.querySelector(".frame-consent"))
    fail("the cookie bar shows before any switch is used");
  await click(
    document.querySelector('[role="tab"]:not([aria-selected="true"])'),
  );
  if (document.querySelector(".frame-consent"))
    fail("picking a tab showed the cookie bar");
  await click(document.querySelector(".theme-toggle"));
  if (theme(document) !== "light")
    fail("the theme switch changed the theme before consent");
  if (!document.querySelector(".frame-consent"))
    fail("the theme switch didn't open the cookie bar");
  await click(document.querySelector(".width-toggle"));
  if (first.writes.length > 0)
    fail(`wrote before consent: ${first.writes.join(", ")}`);

  // Decline: the switch now works for the visit, and still nothing is stored.
  await click(button(document, "Decline"));
  if (document.querySelector(".frame-consent"))
    fail("the cookie bar stayed after declining");
  await click(document.querySelector(".theme-toggle"));
  if (theme(document) !== "dark")
    fail("after declining, the theme switch didn't switch for the visit");
  if (first.writes.length > 0)
    fail(`wrote after declining: ${first.writes.join(", ")}`);
  first.dom.window.close();

  // A fresh visit, dark system setting: accept, then the choice is stored.
  const second = await open("dark");
  const document2 = second.dom.window.document;
  if (theme(document2) !== "dark")
    fail(`ignored a dark system setting (showed ${theme(document2)})`);
  await click(document2.querySelector(".theme-toggle"));
  await click(button(document2, "Accept"));
  if (document2.querySelector(".frame-consent"))
    fail("the cookie bar stayed after accepting");
  await click(document2.querySelector(".theme-toggle"));
  if (theme(document2) !== "light")
    fail("after accepting, the theme switch didn't switch");
  const stored = second.writes.join(" ");
  for (const key of [`${prefix}:consent`, `${prefix}:pref:theme`]) {
    if (!stored.includes(key))
      fail(`accepting didn't store ${key} (the watch may be broken)`);
  }
  second.dom.window.close();
  return [
    ...problems,
    ...[...first.errors, ...second.errors].map((error) => `${file}: ${error}`),
  ];
};

// Docs pages that are used, not just loaded: the home, and a page with a tab
// group, in the default (released) version.
export const DEFAULT_DOCS_PAGES = ["index.html", "docs/user/editor/index.html"];

export const parseArguments = (argv) => {
  const flag = (name) =>
    argv
      .find((argument) => argument.startsWith(`--${name}=`))
      ?.slice(name.length + 3);
  const app = flag("app");
  const root = argv.find((argument) => !argument.startsWith("--"));
  const prefix = flag("prefix");
  const baseArgument = flag("base") ?? "/";
  const base = baseArgument.endsWith("/") ? baseArgument : `${baseArgument}/`;
  const use = argv
    .filter((argument) => argument.startsWith("--use="))
    .map((argument) => argument.slice(6));
  const problems = [];
  if (!root) problems.push("no build dir");
  if (!["docs", "site"].includes(app))
    problems.push("--app must be site or docs");
  if (app === "docs" && !prefix)
    problems.push("--prefix is required with --app=docs");
  if (prefix !== undefined && !/^[a-z0-9][a-z0-9-]*$/.test(prefix)) {
    problems.push(
      `--prefix must be lowercase letters, digits and hyphens (got "${prefix}")`,
    );
  }
  return {
    app,
    base,
    pages: use.length > 0 ? use : DEFAULT_DOCS_PAGES,
    prefix,
    problems,
    root,
  };
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const {
    app,
    base,
    pages,
    prefix,
    problems: usage,
    root,
  } = parseArguments(process.argv.slice(2));
  if (usage.length > 0) {
    console.error(
      `${usage.join("; ")}\nusage: node scripts/check-no-storage.mjs --app=<site|docs> <build directory> [--prefix=<slug>-docs] [--base=/sub/path/] [--use=<page>]...`,
    );
    process.exit(2);
  }
  const problems = [];
  const files = htmlFiles(root);
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    const name = path.relative(root, file);
    for (const scheme of ["light", "dark"]) {
      const result = await storageWritesIn(html, name, scheme);
      problems.push(...result.writes);
      // Redirect stubs carry no theme script; every real page does.
      if (html.includes("prefers-color-scheme") && result.theme !== scheme) {
        problems.push(
          `${name}: showed ${result.theme} with a ${scheme} system setting`,
        );
      }
    }
  }
  console.log(
    `${app}: ran the inline scripts of ${files.length} page(s), light and dark`,
  );
  if (app === "docs") {
    for (const file of pages) {
      if (!existsSync(path.join(root, file))) {
        problems.push(`${file}: missing from the build`);
        continue;
      }
      problems.push(...(await useDocsPage(root, file, base, prefix)));
    }
    console.log(`docs: used ${pages.length} hydrated page(s)`);
  }
  if (problems.length > 0) {
    console.error(`storage check failed:\n${problems.slice(0, 50).join("\n")}`);
    process.exit(1);
  }
  console.log(`${app}: nothing is written to browser storage before consent`);
}
