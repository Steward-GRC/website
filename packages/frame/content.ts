// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { FrameLinks } from "./strip.ts";

import { githubUrl, product } from "./product.ts";

// The header links and the footer both sites show, in one place, so the docs
// header and footer can't drift from the site's. The site passes its own base
// path as siteUrl (its links stay on the page it serves); the docs pass the
// site's address.

export interface FrameFooter {
  groups: FrameFooterGroup[];
  marks: string[];
  tagline: string;
}

export interface FrameFooterGroup {
  links: FrameLink[];
  title: string;
}

export interface FrameLink {
  href: string;
  label: string;
}

export const TAGLINE = product.tagline;

const securityPolicy = `${githubUrl}/.github/blob/main/SECURITY.md`;

export const frameNav = (links: FrameLinks): FrameLink[] => [
  { href: `${links["site"]}/`, label: "Home" },
  { href: `${links.docs}/`, label: "Docs" },
  { href: githubUrl, label: "GitHub" },
];

export const frameFooter = (links: FrameLinks): FrameFooter => ({
  groups: [
    {
      links: [{ href: `${links["site"]}/`, label: "Home" }],
      title: "Product",
    },
    {
      links: [
        { href: `${links.docs}/`, label: "Docs" },
        { href: githubUrl, label: "GitHub" },
      ],
      title: "Resources",
    },
    {
      links: [
        { href: securityPolicy, label: "Security policy" },
        {
          href: `${securityPolicy}#reporting-a-vulnerability`,
          label: "Report a vulnerability",
        },
      ],
      title: "Security",
    },
  ],
  marks: [product.name],
  tagline: TAGLINE,
});

const markSeparator = (index: number, count: number) => {
  if (index === 0) return "";
  return index === count - 1 ? " and " : ", ";
};

const marksTail = (count: number) =>
  ` ${count > 1 ? "are trademarks" : "is a trademark"} of ${product.copyrightHolder}.`;

const copyrightLine = (year: number) => `© ${year} ${product.copyrightHolder}.`;

// The legal text as the footer sets it, in two short lines: the trademarks,
// then the copyright.
export const legalLines = (marks: string[], year: number): [string, string] => [
  marks
    .map((mark, index) => `${markSeparator(index, marks.length)}${mark}™`)
    .join("") + marksTail(marks.length),
  copyrightLine(year),
];

// The legal text as one plain string, for checks and metadata.
export const legalLine = (marks: string[], year: number) =>
  legalLines(marks, year).join(" ");

const escapeHtml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// A mark with its last word and trademark sign held together in a no-break
// span, so a line never breaks between them.
export const markedHtml = (mark: string) => {
  const lastSpace = mark.lastIndexOf(" ");
  const rest = lastSpace === -1 ? "" : mark.slice(0, lastSpace + 1);
  const lastWord = lastSpace === -1 ? mark : mark.slice(lastSpace + 1);
  return `${escapeHtml(rest)}<span class="nowrap">${escapeHtml(lastWord)}<sup class="tm">™</sup></span>`;
};

// The legal lines as the site's footer renders them, each its own block
// (site-frame.css). The docs footer uses this markup as its copyright.
export const legalHtml = (marks: string[], year: number) =>
  `<span class="footer__legal-line">` +
  marks
    .map(
      (mark, index) =>
        `<span>${markSeparator(index, marks.length)}${markedHtml(mark)}</span>`,
    )
    .join("") +
  `${escapeHtml(marksTail(marks.length))}</span>` +
  `<span class="footer__legal-line">${escapeHtml(copyrightLine(year))}</span>`;
