// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
/* oxlint-disable perfectionist/sort-objects -- a slot lists its callouts in number order */
// Captures the guide's screenshots from a running Steward: headless Chromium,
// light mode, a fixed 1280x800 window, numbered callouts, metadata stripped.
//
//   node apps/docs/screenshots/capture.mjs [--only=slot,slot] [--out=dir] [--records=file]
//
// Environment:
//   STEWARD_URL        the site, default https://steward.localhost
//   PLAYWRIGHT_MODULE  path or name of the playwright module, default playwright-core
//   CHROMIUM           path to a chromium or chrome-headless-shell executable
//
// The record numbers each slot uses come from records.json; slots.json says
// which state each slot needs. Every fixture is fictional. The script only
// reads and opens dialogs: it never confirms a submit, withdraw or acknowledge,
// and never resets anything.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { clearCallouts, drawCallouts, resolveBoxes } from "./callouts.mjs";
import { stripPng } from "./png.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const argument = (name) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const BASE = process.env.STEWARD_URL;
if (!BASE) throw new Error("set STEWARD_URL to the running Steward");
const OUT = path.resolve(
  argument("out") ?? path.join(here, "../static/img/guide"),
);
const only = argument("only")?.split(",");
const updateManifest =
  !process.argv.includes("--no-manifest") && !argument("out");
const records = JSON.parse(
  readFileSync(argument("records") ?? path.join(here, "records.json"), "utf8"),
);
const manifestPath = path.join(here, "../src/data/screenshots.json");

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? "playwright-core"
);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM });

const sessions = new Map();
const newContext = () =>
  browser.newContext({
    colorScheme: "light",
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    viewport: { height: 800, width: 1280 },
  });

const tidy = async (page) => {
  await page.addStyleTag({
    content: '[aria-label="Accessibility options"]{display:none!important}',
  });
  const dismiss = page.getByRole("button", { name: "Dismiss for 24 hours" });
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click();
    await page.waitForTimeout(300);
  }
};

const go = async (page, route) => {
  const url = route.replaceAll(/\{(\w+)\}/g, (_, key) => {
    if (!records[key]) throw new Error(`records.json has no "${key}"`);
    return records[key];
  });
  await page.goto(BASE + url);
  await page.waitForLoadState("networkidle");
  await tidy(page);
};

// A page signed in as `who` by the Dev quick login, in a context of its own.
const as = async (who, { admin = false, fresh = false } = {}) => {
  const key = `${who}/${admin}`;
  if (!fresh && sessions.has(key)) return sessions.get(key);
  const context = await newContext();
  const page = await context.newPage();
  await page.goto(BASE + (admin ? "/admin/sign-in" : "/sign-in"));
  await page.getByRole("combobox", { name: "Dev quick login" }).click();
  await page
    .getByRole("option", { name: new RegExp(`^${who}`) })
    .first()
    .click();
  await page.waitForURL((u) => !u.pathname.endsWith("sign-in"), {
    timeout: 20_000,
  });
  await page.waitForLoadState("networkidle");
  if (!fresh) sessions.set(key, page);
  return page;
};
const anonymous = async (route) => {
  const context = await newContext();
  const page = await context.newPage();
  await page.goto(BASE + route);
  await page.waitForLoadState("networkidle");
  await tidy(page);
  return page;
};

// A long page may take a taller window (same width); the default is 1280x800.
const snap = async (page, slot, items, { height = 800 } = {}) => {
  await page.setViewportSize({ height, width: 1280 });
  await page.waitForTimeout(400);
  const boxes = await resolveBoxes(page, items);
  await drawCallouts(page, boxes);
  const png = stripPng(await page.screenshot());
  await clearCallouts(page);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(path.join(OUT, `${slot}.png`), png);
};

const role = (page, r, name) => page.getByRole(r, { name });
const text = (page, t, options) => page.getByText(t, options);
const nav = (page) => page.getByRole("navigation", { name: "Main navigation" });
const menuItem = (page, name) => page.getByRole("menuitem", { name });
const dialog = (page) => page.getByRole("dialog");

// One entry per slot, in the order of slots.json. Each opens the state the
// slot's `clicks` describe, then calls snap with its numbered callouts.
const slots = {
  "index-1": async () => {
    const p = await as("Bob");
    await go(p, "/");
    await snap(p, "index-1", [
      { n: 1, loc: nav(p), side: "tr" },
      { n: 2, loc: role(p, "heading", "My work") },
    ]);
  },
  "signing-in-1": async () => {
    const p = await anonymous("/sign-in");
    const combo = role(p, "combobox", "Dev quick login");
    await snap(p, "signing-in-1", [
      {
        n: 1,
        loc: combo.locator(
          "xpath=ancestor::div[contains(@class,'border-dashed')][1]",
        ),
      },
      { n: 2, loc: combo },
      {
        n: 3,
        loc: p
          .getByLabel("Email or username")
          .locator("xpath=ancestor::form[1]"),
      },
    ]);
  },
  "signing-in-2": async () => {
    const p = await anonymous("/admin/sign-in");
    const combo = role(p, "combobox", "Dev quick login");
    await snap(p, "signing-in-2", [
      { n: 1, loc: p.getByText("Admin", { exact: true }) },
      { n: 2, loc: combo },
    ]);
  },
  "policies-and-procedures-1": async () => {
    const p = await as("Bob");
    await go(p, "/policies");
    // An empty list: Information, then Devices, which holds nothing.
    await p
      .locator("main")
      .getByRole("button", { name: "Information", exact: true })
      .click();
    await p
      .locator("main")
      .getByRole("button", { name: "Devices", exact: true })
      .click();
    await p.waitForTimeout(600);
    await snap(p, "policies-and-procedures-1", [
      { n: 1, loc: nav(p).getByRole("link", { name: "Library" }).first() },
      { n: 2, loc: p.getByRole("link", { name: "New policy" }) },
      {
        n: 3,
        loc: p.locator("main").getByRole("heading", { name: "Policies" }),
      },
    ]);
  },
  "policies-and-procedures-2": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/new/policy");
    await p
      .getByLabel("Category", { exact: true })
      .selectOption({ label: "Finance" });
    await p.waitForTimeout(500);
    await snap(p, "policies-and-procedures-2", [
      { n: 1, loc: p.getByLabel("Title") },
      { n: 2, loc: p.getByLabel("Category", { exact: true }) },
      { n: 3, loc: p.getByLabel("Subcategory") },
      { n: 4, loc: p.getByLabel("Template") },
      { n: 5, loc: text(p, /Set by the category/i) },
    ]);
  },
  "policies-and-procedures-3": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{draft}");
    await snap(p, "policies-and-procedures-3", [
      { n: 1, loc: p.locator("[contenteditable=true]").first() },
      { n: 2, loc: role(p, "button", "AI") },
      { n: 3, loc: role(p, "button", "Submit for approval") },
      { n: 4, loc: role(p, "button", "Actions") },
      { n: 5, loc: text(p, /Saved|Saving|Unsaved/) },
      { n: 6, loc: text(p, "Required sections", { exact: true }) },
      { n: 7, loc: text(p, "Appendices", { exact: true }) },
      { n: 8, loc: text(p, "Next version", { exact: true }) },
    ]);
  },
  "policies-and-procedures-4": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{draft}");
    await role(p, "button", "AI").click();
    const menu = p.getByRole("menu");
    await menuItem(p, /Review draft/).click();
    await p
      .getByText(/AI review/i)
      .first()
      .waitFor({ timeout: 15_000 });
    await snap(p, "policies-and-procedures-4", [
      { n: 1, loc: menu },
      { n: 2, loc: p.getByText(/AI review/i).first() },
      { n: 3, loc: p.getByText(/Jump to/i).first() },
      { n: 4, loc: role(p, "button", /Re-run review/i) },
    ]);
  },
  "policies-and-procedures-5": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{ready}");
    await role(p, "button", "Submit for approval").click();
    const d = dialog(p);
    await d.waitFor();
    await snap(p, "policies-and-procedures-5", [
      { n: 1, loc: d.getByRole("heading").first() },
      { n: 2, loc: d.getByText(/Major/).first() },
      { n: 3, loc: d.getByRole("button", { name: "Keep editing" }) },
      { n: 4, loc: d.getByRole("button", { name: "Submit for approval" }) },
    ]);
  },
  "policies-and-procedures-6": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{inReview}");
    await role(p, "button", "Actions").click();
    const item = menuItem(p, /Withdraw from review/);
    await item.waitFor();
    const actions = await role(p, "button", "Actions").boundingBox();
    const itemBox = await item.boundingBox();
    await item.click();
    const d = dialog(p);
    await d.waitFor();
    // The menu closes when the dialog opens, so its two callouts are drawn from
    // the boxes measured before the click.
    await snap(p, "policies-and-procedures-6", [
      { n: 3, loc: d },
      { n: 1, loc: role(p, "button", "Actions") },
    ]);
    void actions;
    void itemBox;
  },
  "policies-and-procedures-7": async () => {
    const p = await as("Bob");
    await go(p, "/drafts");
    await snap(p, "policies-and-procedures-7", [
      { n: 1, loc: role(p, "heading", "My drafts") },
      { n: 2, loc: p.getByRole("link", { name: "New" }).first() },
      { n: 3, loc: p.getByRole("table") },
    ]);
  },
  "approvals-1": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals");
    await snap(p, "approvals-1", [
      { n: 1, loc: nav(p).getByRole("link", { name: /Approvals/ }) },
      { n: 2, loc: text(p, "Pending", { exact: true }) },
      { n: 3, loc: text(p, "In progress", { exact: true }) },
      { n: 4, loc: text(p, "Coming to you", { exact: true }) },
      { n: 5, loc: p.getByRole("link", { name: "Review" }).first() },
    ]);
  },
  "approvals-2": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{inReview}");
    await snap(p, "approvals-2", [
      { n: 1, loc: text(p, /of \d+ approved/).first() },
      { n: 2, loc: p.getByRole("tablist") },
      { n: 3, loc: p.getByLabel(/Decision comment/i) },
      { n: 4, loc: role(p, "button", /^Approve/) },
    ]);
  },
  "approvals-3": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{inReview}");
    const target = p.locator("article p, main p").first();
    await target.selectText();
    await role(p, "button", "Comment").first().click();
    await p.getByLabel(/Suggest a change/i).check();
    await snap(p, "approvals-3", [
      { n: 1, loc: target },
      { n: 2, loc: role(p, "button", "Comment").first() },
      { n: 3, loc: p.getByRole("textbox").last() },
      { n: 4, loc: p.getByLabel(/Suggest a change/i) },
      { n: 5, loc: p.getByLabel(/Suggested text/i) },
      { n: 6, loc: role(p, "button", "Comment").last() },
    ]);
  },
  "approvals-4": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{edited}");
    await role(p, "tab", /Changes since you last reviewed/).click();
    await snap(p, "approvals-4", [
      { n: 1, loc: role(p, "tab", /Changes since you last reviewed/) },
      { n: 2, loc: p.getByRole("tabpanel") },
      { n: 3, loc: role(p, "button", /Mark as reviewed/) },
    ]);
  },
  "approvals-5": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{rejected}");
    await snap(p, "approvals-5", [
      { n: 1, loc: text(p, /Changes requested|Rejected/).first() },
      { n: 2, loc: text(p, /address the feedback/i).first() },
      { n: 3, loc: role(p, "button", "Actions") },
      { n: 4, loc: role(p, "button", "Submit for approval") },
    ]);
  },
  "appendices-1": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{withAppendices}");
    const panel = text(p, "Appendices", { exact: true })
      .first()
      .locator("xpath=ancestor::*[self::section or self::div][2]");
    await snap(p, "appendices-1", [
      { n: 1, loc: panel },
      { n: 2, loc: role(p, "button", "Add appendix") },
      { n: 3, loc: text(p, /Appendix A/).first() },
      { n: 4, loc: role(p, "button", /Move appendix A/).first() },
      { n: 5, loc: role(p, "link", "Edit").first() },
      { n: 6, loc: role(p, "button", "Retire").first() },
    ]);
  },
  "appendices-2": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{withAppendices}/appendices/A");
    await snap(p, "appendices-2", [
      { n: 1, loc: p.getByRole("tablist").first() },
      { n: 2, loc: role(p, "button", /Unified/) },
      { n: 3, loc: p.getByLabel(/Published version/i) },
      { n: 4, loc: role(p, "button", "Save appendix") },
      { n: 5, loc: text(p, "Contributors", { exact: true }) },
      { n: 6, loc: p.getByRole("link", { name: /^Back to/ }) },
    ]);
  },
  "appendices-3": async () => {
    const bob = await as("Bob", { fresh: true });
    const alice = await as("Alice", { fresh: true });
    await go(bob, "/drafts/{withAppendices}/appendices/A");
    await go(alice, "/drafts/{withAppendices}/appendices/A");
    await bob.waitForTimeout(2500);
    await snap(bob, "appendices-3", [
      { n: 1, loc: text(bob, /Editing together/i).first() },
      { n: 2, loc: text(bob, /Who is here/i).first() },
      { n: 3, loc: text(bob, /Alice/).first() },
    ]);
  },
  "library-1": async () => {
    const p = await as("Alice", { admin: true });
    await go(p, "/admin/definitions-library");
    await role(p, "button", /New definition/).click();
    await snap(p, "library-1", [
      { n: 1, loc: p.getByRole("link", { name: "Definitions" }).first() },
      { n: 2, loc: p.getByLabel(/Category/i).first() },
      { n: 3, loc: role(p, "button", /New definition/) },
      { n: 4, loc: p.getByLabel(/^Term/) },
    ]);
  },
  "library-2": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{linked}");
    await text(p, "Definitions", { exact: true })
      .first()
      .scrollIntoViewIfNeeded();
    await snap(p, "library-2", [
      { n: 1, loc: text(p, "Definitions", { exact: true }).first() },
      { n: 2, loc: text(p, "Related", { exact: true }).first() },
      { n: 3, loc: text(p, "References", { exact: true }).first() },
      { n: 4, loc: text(p, "Contacts", { exact: true }).first() },
      { n: 5, loc: p.getByRole("button", { name: /Move|Remove/ }).first() },
    ]);
  },
  "library-3": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{linked}");
    await snap(p, "library-3", [
      { n: 1, loc: role(p, "tab", /^Related/) },
      { n: 2, loc: role(p, "tab", /^Definitions/) },
      { n: 3, loc: role(p, "tab", /^References/) },
      { n: 4, loc: role(p, "tab", /^Contacts/) },
    ]);
  },
  "reading-and-history-1": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{published}");
    await snap(p, "reading-and-history-1", [
      { n: 1, loc: text(p, /On this page/i).first() },
      { n: 2, loc: p.locator("article").first() },
      { n: 3, loc: text(p, "Details", { exact: true }).first() },
      { n: 4, loc: p.getByRole("tablist") },
      { n: 5, loc: role(p, "button", "Actions") },
      { n: 6, loc: text(p, /Last Updated/i).first() },
    ]);
  },
  "reading-and-history-2": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{twoVersions}");
    await role(p, "tab", "Changes").click();
    await snap(p, "reading-and-history-2", [
      { n: 1, loc: role(p, "tab", "Changes") },
      { n: 2, loc: p.getByLabel(/From version/i) },
      { n: 3, loc: role(p, "button", /Side by side/) },
      { n: 4, loc: p.locator("ins, del, mark").first() },
      { n: 5, loc: text(p, /Show .*unchanged/i).first() },
    ]);
  },
  "reading-and-history-3": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{published}");
    await role(p, "button", "Actions").click();
    await menuItem(p, /Print/).click();
    const d = dialog(p);
    await d.waitFor();
    await snap(p, "reading-and-history-3", [
      { n: 1, loc: role(p, "button", "Actions") },
      { n: 2, loc: d.getByRole("heading").first() },
      { n: 3, loc: d.getByLabel(/Include version history/i) },
      { n: 4, loc: d.getByRole("button", { name: "Print" }) },
    ]);
  },
  "reading-and-history-4": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{ack}");
    const card = text(p, /Please review and confirm/i).first();
    const button = role(p, "button", "Acknowledge");
    await button.first().click();
    const d = dialog(p);
    await d.waitFor();
    await snap(p, "reading-and-history-4", [
      { n: 1, loc: card },
      { n: 2, loc: button },
      { n: 3, loc: d },
    ]);
  },
  "reading-and-history-5": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{twoVersions}");
    await p.getByRole("link", { name: "History & approvals" }).last().click();
    await p.waitForLoadState("networkidle");
    await snap(p, "reading-and-history-5", [
      {
        n: 1,
        loc: p.getByRole("link", { name: "History & approvals" }).first(),
      },
      { n: 2, loc: p.getByRole("list").first() },
      { n: 3, loc: text(p, /Published/).first() },
    ]);
  },
  "admin-1": async () => {
    const p = await as("Alice", { admin: true });
    await go(p, "/admin/categories");
    await p
      .locator("a[href^='/admin/categories/']")
      .filter({ hasText: /^Finance$/ })
      .last()
      .click();
    await p.waitForLoadState("networkidle");
    await snap(
      p,
      "admin-1",
      [
        { n: 1, loc: p.getByPlaceholder("Filter categories") },
        { n: 2, loc: p.getByLabel("Name", { exact: true }) },
        { n: 3, loc: p.getByLabel("Default template") },
        { n: 4, loc: p.getByLabel("Default workflow") },
        { n: 5, loc: text(p, /Acknowledgement audience/i) },
        { n: 6, loc: text(p, /Documents this category holds/i) },
        {
          n: 7,
          loc: p.getByRole("button", { name: "Save", exact: true }).first(),
        },
      ],
      { height: 1300 },
    );
  },
  "admin-2": async () => {
    const p = await as("Alice", { admin: true });
    await go(p, "/admin/templates");
    await p
      .locator("a[href^='/admin/templates/']")
      .filter({ hasText: "Standard Policy" })
      .first()
      .click();
    await p.waitForLoadState("networkidle");
    await snap(p, "admin-2", [
      { n: 1, loc: p.getByRole("link", { name: /Templates/ }).first() },
      { n: 2, loc: role(p, "button", "Required").first() },
      { n: 3, loc: role(p, "button", /v\d+ Draft/) },
      { n: 4, loc: role(p, "button", /Next: Review/) },
    ]);
  },
  "admin-3": async () => {
    const p = await as("Alice", { admin: true });
    await go(p, "/admin/workflows");
    await p
      .locator("a[href^='/admin/workflows/']")
      .filter({ hasText: /veto/i })
      .first()
      .click();
    await p.waitForLoadState("networkidle");
    await snap(
      p,
      "admin-3",
      [
        { n: 1, loc: p.getByLabel("Stage 1 name") },
        { n: 2, loc: p.getByRole("radio").first() },
        { n: 3, loc: role(p, "button", /Add approver/).first() },
        { n: 4, loc: p.getByLabel("Stage 1 due within") },
        { n: 5, loc: p.getByLabel(/veto/i).first() },
        { n: 6, loc: role(p, "button", /Save workflow/) },
      ],
      { height: 1100 },
    );
  },
  "admin-4": async () => {
    const p = await as("Alice", { admin: true });
    await go(p, "/admin/access");
    await p
      .locator("a[href^='/admin/access/']")
      .filter({ hasText: "Finance" })
      .first()
      .click();
    await p.waitForLoadState("networkidle");
    await snap(p, "admin-4", [
      { n: 1, loc: p.getByPlaceholder("Filter categories") },
      { n: 2, loc: role(p, "button", /^Read for/).first() },
      { n: 3, loc: role(p, "button", /^Approve for/).first() },
      { n: 4, loc: role(p, "button", /Add rule/) },
    ]);
  },
  "admin-5": async () => {
    const p = await as("Alice", { admin: true });
    await go(p, "/admin/users");
    await snap(p, "admin-5", [
      { n: 1, loc: p.getByText("People", { exact: true }).first() },
      { n: 2, loc: p.getByRole("table") },
      { n: 3, loc: p.getByRole("link", { name: /^Bob Author/ }) },
      { n: 4, loc: p.getByPlaceholder(/Search users/i) },
    ]);
  },
};

const wanted = only ?? Object.keys(slots);
const done = [];
const failed = [];
for (const slot of wanted) {
  if (!slots[slot]) {
    failed.push([slot, "no such slot"]);
    continue;
  }
  try {
    await slots[slot]();
    done.push(slot);
    console.log("ok", slot);
  } catch (error) {
    failed.push([slot, String(error.message).split("\n", 1)[0]]);
    console.log("FAIL", slot, String(error.message).split("\n", 1)[0]);
  }
}
await browser.close();

if (updateManifest) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const slot of done) manifest[slot] = { ready: true };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
console.log(`${done.length} captured, ${failed.length} failed`);
if (failed.length > 0) process.exitCode = 1;
