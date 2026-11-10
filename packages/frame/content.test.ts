// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  frameFooter,
  frameNav,
  legalHtml,
  legalLine,
  legalLines,
  markedHtml,
  TAGLINE,
} from "./content.ts";
import { githubUrl, product } from "./product.ts";
import { release } from "./release.ts";
import { frameLinks } from "./strip.ts";

const docsSide = frameLinks({
  docsUrl: "https://docs.example",
  siteUrl: "https://www.example",
});
const siteSide = frameLinks({ docsUrl: "https://docs.example", siteUrl: "/" });

test("the header links are Home, Docs and GitHub", () => {
  assert.deepEqual(
    frameNav(docsSide).map((link) => link.label),
    ["Home", "Docs", "GitHub"],
  );
  assert.equal(frameNav(docsSide)[0].href, "https://www.example/");
  assert.equal(frameNav(siteSide)[0].href, "/");
  assert.equal(frameNav(siteSide)[1].href, "https://docs.example/");
  assert.equal(frameNav(siteSide)[2].href, githubUrl);
});

test("the footer has the tagline and the Product, Resources and Security groups", () => {
  const footer = frameFooter(docsSide);
  assert.equal(footer.tagline, TAGLINE);
  assert.equal(TAGLINE, product.tagline);
  assert.deepEqual(footer.marks, [product.name]);
  assert.deepEqual(
    footer.groups.map((group) => group.title),
    ["Product", "Resources", "Security"],
  );
});

test("the footer carries no download or release links", () => {
  const footerLinks = frameFooter(docsSide).groups.flatMap(
    (group) => group.links,
  );
  for (const link of footerLinks) {
    assert.doesNotMatch(
      link.label,
      /download/i,
      `${link.label} is a download link`,
    );
    assert.ok(
      !link.label.includes(release.version),
      `${link.label} names the release`,
    );
    assert.ok(
      !link.href.includes("/releases/tag/"),
      `${link.label} links a release tag`,
    );
  }
  assert.ok(footerLinks.every((link) => link.label !== "Releases"));
});

test("the legal line is two short lines: the marks, then the copyright", () => {
  assert.deepEqual(legalLines(["Alpha", "Beta Two"], 2026), [
    `Alpha™ and Beta Two™ are trademarks of ${product.copyrightHolder}.`,
    `© 2026 ${product.copyrightHolder}.`,
  ]);
  assert.equal(
    legalLine(["Alpha"], 2026),
    `Alpha™ is a trademark of ${product.copyrightHolder}. © 2026 ${product.copyrightHolder}.`,
  );
  const html = legalHtml(["Alpha"], 2026);
  assert.equal(html.match(/<span class="footer__legal-line">/g)?.length, 2);
});

test("a mark's last word and its trademark sign never break apart, and markup is escaped", () => {
  assert.equal(
    markedHtml("Kept on a leash"),
    'Kept on a <span class="nowrap">leash<sup class="tm">™</sup></span>',
  );
  assert.equal(
    markedHtml("A <b>"),
    'A <span class="nowrap">&lt;b&gt;<sup class="tm">™</sup></span>',
  );
});
