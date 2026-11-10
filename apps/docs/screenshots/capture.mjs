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
    reducedMotion: "no-preference",
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
  if (page.viewportSize()?.height !== height) {
    await page.setViewportSize({ height, width: 1280 });
  }
  await page.waitForTimeout(400);
  const boxes = await resolveBoxes(page, items);
  await drawCallouts(page, boxes);
  const png = stripPng(await page.screenshot());
  await clearCallouts(page);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(path.join(OUT, `${slot}.png`), png);
};

// Selects text the way a person does, with the mouse; the selection toolbar
// only shows for a real drag, not for a script-made selection.
const dragSelect = async (page, locator) => {
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + 4, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + Math.min(300, box.width - 8), box.y + 10, {
    steps: 8,
  });
  await page.mouse.up();
  await page.waitForTimeout(800);
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
    // An empty list: the Devices category holds nothing.
    await p.getByRole("button", { name: "Devices", exact: true }).click();
    await p.waitForTimeout(600);
    await snap(p, "policies-and-procedures-1", [
      { n: 1, loc: nav(p).getByRole("link", { name: "Library" }).first() },
      { n: 2, loc: p.getByRole("link", { name: "New policy" }) },
      { n: 3, loc: text(p, "No policies match these filters.") },
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
      { n: 2, loc: role(p, "button", "Actions") },
      { n: 3, loc: role(p, "button", "Submit for approval") },
      { n: 4, loc: text(p, "Saved", { exact: true }) },
      { n: 5, loc: text(p, "Required sections", { exact: true }) },
      { n: 6, loc: text(p, "Appendices", { exact: true }) },
      { n: 7, loc: text(p, "Next version", { exact: true }) },
    ]);
  },
  "policies-and-procedures-4": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{draft}");
    await role(p, "button", "Actions").click();
    const menu = p.getByRole("menu");
    await menu.waitFor();
    await menuItem(p, /Review draft/).click();
    await p
      .getByText(/AI review/i)
      .first()
      .waitFor({ timeout: 20_000 });
    await snap(p, "policies-and-procedures-4", [
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
    await menuItem(p, /Withdraw from review/).click();
    const d = dialog(p);
    await d.waitFor();
    await snap(p, "policies-and-procedures-6", [
      { n: 1, loc: d.getByRole("heading").first() },
      { n: 2, loc: d.getByRole("button", { name: "Withdraw", exact: true }) },
      { n: 3, loc: d.getByRole("button", { name: "Keep in review" }) },
    ]);
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
      { n: 3, loc: text(p, "Coming to you", { exact: true }) },
      { n: 4, loc: p.getByRole("link", { name: "Review" }).first() },
    ]);
  },
  "approvals-2": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{inReview}");
    const step = (name) =>
      text(p, name, { exact: true }).locator(
        "xpath=ancestor::*[contains(@class,'rounded')][1]",
      );
    await snap(p, "approvals-2", [
      { n: 1, union: [step("Submitted"), step("Publish")] },
      { n: 2, loc: p.getByRole("tablist") },
    ]);
  },
  "approvals-6": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{inReview}");
    await p.getByLabel(/Decision comment/i).scrollIntoViewIfNeeded();
    await p.mouse.wheel(0, 200);
    await snap(p, "approvals-6", [
      { n: 1, loc: text(p, "Your decision", { exact: true }) },
      { n: 2, loc: p.getByLabel(/Decision comment/i) },
      {
        n: 3,
        union: [
          role(p, "button", "Send comments"),
          role(p, "button", "Approve"),
        ],
      },
    ]);
  },
  "approvals-3": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{inReview}");
    const target = p.locator("article p, main p").first();
    await dragSelect(p, target);
    await p.locator('[data-kg-toolbar-button="comment"]').click();
    await p.getByLabel(/Suggest a change/i).check();
    await snap(p, "approvals-3", [
      { n: 1, loc: target },
      { n: 2, loc: p.getByPlaceholder(/What's up with this/i) },
      { n: 3, loc: p.getByLabel(/Suggest a change/i) },
      { n: 4, loc: p.getByLabel(/Suggested text/i) },
      { n: 5, loc: role(p, "button", "Comment").last() },
    ]);
  },
  "approvals-4": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{edited}");
    await role(p, "tab", /Changes since you last reviewed/).click();
    await snap(p, "approvals-4", [
      { n: 1, loc: role(p, "tab", /Changes since you last reviewed/) },
      { n: 2, loc: p.getByText(/added in the newer version/).first() },
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
    const rowActions = [
      role(p, "link", /Edit appendix A/),
      role(p, "button", /Retire appendix A/),
    ];
    await snap(
      p,
      "appendices-1",
      [
        {
          n: 1,
          union: [
            text(p, "Appendices", { exact: true }),
            role(p, "button", /^Restore/),
          ],
        },
        { n: 2, loc: role(p, "button", "Add appendix") },
        { n: 3, loc: text(p, "Not published", { exact: true }) },
        { n: 4, union: rowActions },
        { n: 5, loc: role(p, "button", /^Restore/) },
      ],
      { height: 1100 },
    );
  },
  "appendices-2": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{withAppendices}/appendices/A");
    await snap(p, "appendices-2", [
      { n: 1, loc: p.getByRole("tablist").first() },
      { n: 2, loc: text(p, "View", { exact: true }) },
      { n: 3, loc: text(p, /Contributors/) },
      {
        n: 4,
        union: [role(p, "button", "Retire"), role(p, "button", "Publish")],
      },
      { n: 5, loc: p.getByRole("link", { name: /^Back to/ }) },
    ]);
  },
  "appendices-3": async () => {
    const bob = await as("Bob", { fresh: true });
    const alice = await as("Alice", { fresh: true });
    await go(bob, "/drafts/{withAppendices}/appendices/A");
    await go(alice, "/drafts/{withAppendices}/appendices/A");
    const box = await alice
      .locator("[contenteditable=true] p")
      .first()
      .boundingBox();
    await alice.mouse.click(box.x + 60, box.y + 10);
    await bob.waitForTimeout(3500);
    await snap(bob, "appendices-3", [
      { n: 1, loc: text(bob, /Alice Admin editing/) },
    ]);
  },
  "library-1": async () => {
    const p = await as("Alice", { admin: true });
    await go(p, "/admin/definitions-library");
    await role(p, "button", /New definition/)
      .first()
      .click();
    const d = dialog(p);
    await d.waitFor();
    await snap(p, "library-1", [
      { n: 1, loc: d },
      { n: 2, loc: d.getByLabel("Category") },
      { n: 3, loc: d.getByLabel("Term") },
      { n: 4, loc: d.getByLabel("Definition", { exact: true }) },
      { n: 5, loc: d.getByRole("button", { name: "Create definition" }) },
    ]);
  },
  "library-2": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{linked}");
    const heading = text(p, "Definitions", { exact: true }).first();
    await heading.scrollIntoViewIfNeeded();
    await p.evaluate(() => window.scrollBy(0, 330));
    await snap(
      p,
      "library-2",
      [
        { n: 1, loc: heading },
        { n: 2, loc: text(p, "Related", { exact: true }).first() },
        { n: 3, loc: text(p, "References", { exact: true }).first() },
        { n: 4, loc: text(p, "Contacts", { exact: true }).first() },
        { n: 5, loc: p.getByRole("button", { name: /^Remove/ }).first() },
      ],
      { height: 1500 },
    );
  },
  "library-3": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{linked}");
    await snap(p, "library-3", [
      { n: 1, loc: role(p, "tab", /^Definitions/) },
      { n: 2, loc: role(p, "tab", /^Related/) },
      { n: 3, loc: role(p, "tab", /^References/) },
      { n: 4, loc: role(p, "tab", /^Contacts/) },
    ]);
  },
  "reading-and-history-1": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{published}");
    await snap(
      p,
      "reading-and-history-1",
      [
        { n: 1, loc: text(p, "On this page", { exact: true }) },
        { n: 2, loc: text(p, "1. Purpose") },
        {
          n: 3,
          union: [
            text(p, "Status", { exact: true }),
            text(p, "Last updated", { exact: true }),
            text(p, "v3.0.0", { exact: true }).first(),
          ],
        },
        { n: 4, loc: p.getByRole("tablist") },
        { n: 5, loc: role(p, "button", "Actions") },
        { n: 6, loc: p.getByRole("link", { name: /Appendix A/ }).first() },
      ],
      { height: 1000 },
    );
  },
  "reading-and-history-2": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{twoVersions}");
    await role(p, "tab", "Changes").click();
    await p.waitForTimeout(800);
    await snap(p, "reading-and-history-2", [
      { n: 1, loc: role(p, "tab", "Changes") },
      {
        n: 2,
        union: [
          p.getByRole("combobox").first(),
          p.getByRole("combobox").nth(1),
        ],
      },
      { n: 3, loc: text(p, "Side by side", { exact: true }) },
      { n: 4, loc: text(p, /added in the newer version/) },
      { n: 5, loc: text(p, /unchanged sections?/).first() },
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
      { n: 1, loc: d.getByRole("heading").first() },
      { n: 2, loc: d.getByLabel(/Include version history/i) },
      { n: 3, loc: d.getByRole("button", { name: "Print" }) },
    ]);
  },
  "reading-and-history-4": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{ack}");
    await role(p, "button", "Acknowledge").first().click();
    const d = dialog(p);
    await d.waitFor();
    await snap(p, "reading-and-history-4", [
      { n: 1, loc: d },
      {
        n: 2,
        union: [
          d.getByText("Name", { exact: true }),
          d.getByText("Time", { exact: true }),
        ],
      },
      { n: 3, loc: d.getByRole("button", { name: "Acknowledge" }) },
    ]);
  },
  "reading-and-history-5": async () => {
    const p = await as("Erin");
    await go(p, "/policies/{twoVersions}");
    await role(p, "button", "Actions").click();
    await menuItem(p, /History/).click();
    const heading = p.getByRole("heading", { name: "History & approvals" });
    await heading.waitFor();
    await heading.scrollIntoViewIfNeeded();
    await snap(p, "reading-and-history-5", [
      { n: 1, loc: heading },
      {
        n: 2,
        union: [text(p, /^v3\.0\.0$/).last(), text(p, /^v1\.0\.0$/).last()],
      },
      { n: 3, loc: text(p, "Published v3.0.0") },
    ]);
  },
  "editor-1": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{tour}");
    await dragSelect(p, p.locator("[contenteditable=true] p").first());
    await p.locator("[data-kg-selection-toolbar]").waitFor();
    const button = (id) => p.locator(`[data-kg-toolbar-button="${id}"]`);
    await snap(p, "editor-1", [
      { n: 1, union: [button("bold"), button("superscript")] },
      { n: 2, loc: button("highlight") },
      { n: 3, loc: button("clearFormatting") },
      { n: 4, union: [button("h1"), button("h5")] },
      { n: 5, union: [button("bulletList"), button("numberList")] },
      { n: 6, union: [button("alignCenter"), button("alignRight")] },
      { n: 7, loc: button("link") },
      { n: 8, loc: button("ai") },
    ]);
  },
  "editor-2": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{draft}");
    // The empty section under "Policy statement" is an empty line. The step
    // types a "/" there to open the menu and always takes it out again, so the
    // draft is left as it was.
    const empty = p
      .locator("[contenteditable=true]")
      .getByRole("heading", { name: "Policy statement" })
      .locator("xpath=following-sibling::p[1]");
    try {
      await empty.click();
      await p.keyboard.press("Slash");
      await p.locator("[data-kg-slash-menu]").waitFor({ timeout: 8000 });
      await snap(p, "editor-2", [
        { n: 1, loc: p.locator("[data-kg-slash-menu]") },
        {
          n: 2,
          loc: p.locator("[data-kg-slash-menu]").getByText("Callout").first(),
        },
      ]);
    } finally {
      await p.keyboard.press("Escape");
      const left = await empty.textContent();
      if (left?.trim() === "/") {
        await empty.click();
        await p.keyboard.press("End");
        await p.keyboard.press("Backspace");
        await p
          .getByText("Saved", { exact: true })
          .waitFor({ timeout: 15_000 });
      }
    }
  },
  "editor-3": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{tour}");
    const card = (name) =>
      p.locator("[data-kg-card]").filter({ hasText: name }).first();
    await p.locator("[data-kg-card]").first().scrollIntoViewIfNeeded();
    await snap(
      p,
      "editor-3",
      [
        {
          n: 1,
          loc: p.locator("[data-kg-card='callout'], .kg-callout-card").first(),
        },
        {
          n: 2,
          loc: p.locator("[data-kg-card='toggle'], .kg-toggle-card").first(),
        },
        {
          n: 3,
          loc: p.locator("[data-kg-card='button'], .kg-button-card").first(),
        },
        { n: 4, loc: p.locator("hr").first() },
      ],
      { height: 1100 },
    );
    void card;
  },
  "editor-4": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{tour}");
    const cell = p.locator("table td").first();
    await cell.scrollIntoViewIfNeeded();
    await cell.click();
    await p.locator("[data-kg-table-toolbar]").waitFor();
    await snap(
      p,
      "editor-4",
      [
        { n: 1, loc: p.locator("table").first() },
        { n: 2, loc: p.locator("[data-kg-table-toolbar]") },
        { n: 3, loc: p.locator("table tr").first() },
        { n: 4, loc: cell },
      ],
      { height: 1000 },
    );
  },
  "editor-5": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{tour}");
    const image = p.locator("[data-kg-card='image'], .kg-image-card").first();
    await image.scrollIntoViewIfNeeded();
    await image.click();
    await snap(
      p,
      "editor-5",
      [
        { n: 1, loc: image },
        { n: 2, loc: p.locator("[data-kg-settings-panel]") },
        { n: 3, loc: p.locator("[data-kg-file-card]").first() },
      ],
      { height: 1200 },
    );
  },
  "editor-6": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{tour}");
    await p.locator("[contenteditable=true] p").first().click();
    await p.keyboard.press("Control+f");
    const bar = p.getByRole("search").or(p.getByPlaceholder(/Find/i)).first();
    await bar.waitFor();
    await p.keyboard.type("the");
    await snap(p, "editor-6", [
      { n: 1, loc: p.getByPlaceholder(/Find/i) },
      { n: 2, loc: p.getByRole("button", { name: /Next/ }) },
      { n: 3, loc: p.getByText("Match case") },
      { n: 4, loc: p.getByRole("button", { name: "Replace all" }) },
    ]);
  },
  "editor-7": async () => {
    const p = await as("Bob");
    await go(p, "/drafts/{tour}");
    await p.locator("[contenteditable=true] p").first().click();
    await p.keyboard.press("Control+/");
    await p.getByRole("dialog").waitFor();
    await snap(p, "editor-7", [
      { n: 1, loc: p.getByRole("dialog").getByRole("heading").first() },
      { n: 2, loc: p.getByRole("dialog") },
    ]);
  },
  "editor-8": async () => {
    const p = await as("Charlie");
    await go(p, "/approvals/{inReview}");
    const target = p.locator("article p, main p").first();
    await dragSelect(p, target);
    await p.locator("[data-kg-selection-toolbar]").waitFor();
    await snap(p, "editor-8", [
      { n: 1, loc: target },
      { n: 2, loc: p.locator("[data-kg-selection-toolbar]") },
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
      { n: 1, union: [text(p, "1 Sections"), text(p, "3 Publish")] },
      { n: 2, loc: p.getByRole("switch").first() },
      { n: 3, loc: role(p, "button", /Next: Review/) },
      { n: 4, loc: text(p, "Version history", { exact: true }) },
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
        { n: 3, loc: p.getByText(/Add approver/).first() },
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
      { n: 5, loc: text(p, "Simulator", { exact: true }) },
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
