// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// The strip both sites show above the header: the current release and, before
// v1.0.0, the pre-1.0 warning. The site renders this markup in its own page and the docs
// pass it to Docusaurus's announcement bar, so the two are the same bytes
// and site-frame.css draws them the same way.

export interface FrameLinks {
  docs: string;
  releases: string;
  site: string;
  status: string;
}

export interface ReleaseStrip {
  badge: string;
  body: string;
  heading: string;
  links: StripLink[];
}

export interface StripLink {
  href: string;
  label: string;
}

const trimSlash = (url: string) => url.replace(/\/+$/, "");

// Where each site lives. A preview build passes its own addresses so the two
// previews link to each other instead of the live sites.
export const frameLinks = ({
  docsUrl,
  siteUrl,
}: {
  docsUrl: string;
  siteUrl: string;
}): FrameLinks => {
  const site = trimSlash(siteUrl);
  const docs = trimSlash(docsUrl);
  return {
    docs,
    // The downloads live on the site's Releases page, never in the footer.
    releases: `${site}/releases`,
    site,
    status: `${docs}/docs/things-to-know`,
  };
};

// Before v1.0.0 the strip says any release may still change fundamentally;
// from v1.0.0 on it only names the release.
export const isPreOne = (version: string) => version.startsWith("v0.");

export const releaseStrip = (links: FrameLinks): ReleaseStrip => {
  return {
    // Steward has no release yet: this site is the guide for the demo, so
    // the strip says so instead of naming a release (release.ts stays for
    // the day the docs are versioned).
    badge: "Demo",
    body: "It describes a test install with made-up data.",
    heading: "This is the guide for the Steward demo.",
    links: [{ href: links.status, label: "Things to know" }],
  };
};

const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const stripHtml = (links: FrameLinks): string => {
  const strip = releaseStrip(links);
  const anchors = strip.links
    .map(
      (link) =>
        `<a class="strip__link" href="${escape(link.href)}">${escape(link.label)}</a>`,
    )
    .join(" ");
  return (
    `<div class="strip__row">` +
    `<span class="strip__badge"><span class="strip__dot" aria-hidden="true"></span>${escape(strip.badge)}</span>` +
    `<p class="strip__text"><strong>${escape(strip.heading)}</strong> ${strip.body ? `${escape(strip.body)} ` : ""}${anchors}</p>` +
    `</div>`
  );
};
