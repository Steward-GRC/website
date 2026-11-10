// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

import {
  frameFooter,
  frameNav,
  legalHtml,
  TAGLINE,
} from "@product/frame/content";
import { fontFaceCss, fontUrl, PRELOAD_FONTS } from "@product/frame/fonts";
import { contentWidthBootScript } from "@product/frame/full-width";
import { NAV_LINK_CLASS } from "@product/frame/header-menu-config";
import {
  DOCS_CONSENT_PREFIX,
  docsUrl,
  githubUrl,
  product,
  siteUrl,
} from "@product/frame/product";
import { release } from "@product/frame/release";
import { frameLinks, stripHtml } from "@product/frame/strip";
import { themeBootScript } from "@product/frame/theme-pref";
import { readFileSync } from "node:fs";
import { themes as prismThemes } from "prism-react-renderer";

import { oldDocsPaths } from "./redirects";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// One docs instance at /docs, versioned after the product's release
// (packages/frame/release.ts): the newest cut version (versions.json) is the
// default, and the pages in docs/ are "vNext", unreleased main, at
// /docs/vnext/ under a banner naming the upcoming and current release. A
// released version holds only what that release ships. The deploy builds with
// DOCS_INCLUDE_NEXT=true, so the published site carries vNext beside the
// released versions, as every other build does; only a build that sets it to
// false leaves vNext out.
const includeNext = process.env.DOCS_INCLUDE_NEXT !== "false";

// Docusaurus rejects options for a version it isn't building.
// The unreleased version is "vNext" at .../vnext/; src/theme/DocVersionBanner
// draws its banner, so Docusaurus's own is off.
// Until the product has a release there is no cut version (versions.json is
// empty): the guide is the one version, served at /docs/ with no banner.
const hasReleased =
  (
    JSON.parse(
      readFileSync(new URL("versions.json", import.meta.url), "utf8"),
    ) as string[]
  ).length > 0;
const nextVersion: {
  [version: string]: { banner: "none"; label: string; path: string };
} = includeNext
  ? {
      current: hasReleased
        ? { banner: "none", label: "vNext", path: "vnext" }
        : { banner: "none", label: "Demo guide", path: "" },
    }
  : {};

// The frame and the brand assets come from the shared packages: one copy of
// site-frame.css, any self-hosted fonts, the header links, the footer, the
// strip, the marks and the favicon for both sites.
const framePackage = "../../packages/frame";

// The share card for link previews, from packages/brand (public/), the same
// picture the site uses.
// The one robots directive, on every page.
const ROBOTS = "noindex, nofollow, noarchive, noai, noimageai";

const SHARE_IMAGE = "img/brand/og-card.png";
const SHARE_IMAGE_ALT = `The ${product.name} mark.`;
const brandPackage = "../../packages/brand";

// The site's base path, and where the product site lives. A preview build,
// served from a sub-path on someone else's server, sets PREVIEW_BASE_PATH and
// DOCS_SITE_URL (and DOCS_URL for the strip's absolute links);
// the real build leaves them unset. Asset paths written into raw HTML below
// (the footer's marks) are built from the base path, since Docusaurus only
// rewrites the paths it renders itself.
const baseUrl = process.env.PREVIEW_BASE_PATH || "/";
const links = frameLinks({
  docsUrl: process.env.DOCS_URL || docsUrl,
  siteUrl: process.env.DOCS_SITE_URL || siteUrl,
});
const { site: siteLink } = links;
const footer = frameFooter(links);

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Where "Edit this page" goes: the product's website repository.
const editUrl = `${githubUrl}/website/edit/main/apps/docs/`;

// Code blocks sit on the card colour. On those backgrounds every token of
// these two themes meets WCAG AA except vsLight's pure red attribute names
// (4.0:1), which take a darker red (4.8:1) instead.
const prismLight = {
  ...prismThemes.vsLight,
  plain: { ...prismThemes.vsLight.plain, backgroundColor: "#ffffff" },
  styles: prismThemes.vsLight.styles.map((entry) =>
    entry.style.color === "rgb(255, 0, 0)"
      ? { ...entry, style: { ...entry.style, color: "#dc2626" } }
      : entry,
  ),
};
const prismDark = {
  ...prismThemes.oceanicNext,
  plain: { ...prismThemes.oceanicNext.plain, backgroundColor: "#171717" },
};

const config: Config = {
  baseUrl,
  // Read by the docs home's link back to the product site, and by the strip
  // (src/theme/AnnouncementBar).
  customFields: {
    // The release, for the vNext banner.
    docsRelease: hasReleased
      ? { upcoming: release.upcoming, version: release.version }
      : undefined,
    siteUrl: `${siteLink}/`,
    stripHtml: stripHtml(links),
  },
  favicon: "favicon.svg",

  future: {
    v4: true,
  },

  // Self-hosted fonts (packages/frame fonts.ts, empty in the template),
  // preloaded the same way on the site (apps/site/app/root.tsx), so the frame
  // never paints in a fallback face first. The font faces are written here
  // with the base path, not in site-frame.css, so a sub-path build still
  // finds /fonts/ under it.
  headTags: [
    ...(PRELOAD_FONTS.length > 0
      ? [{ attributes: {}, innerHTML: fontFaceCss(baseUrl), tagName: "style" }]
      : []),
    ...PRELOAD_FONTS.map((font) => ({
      attributes: {
        as: "font",
        crossorigin: "anonymous",
        href: fontUrl(baseUrl, font),
        rel: "preload",
        type: "font/woff2",
      },
      tagName: "link",
    })),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  // A broken internal link fails the build, in vNext and in every released
  // version, so CI catches it before a release does.
  onBrokenLinks: "throw",
  organizationName: product.githubOrg,

  plugins: [
    ["@docusaurus/plugin-client-redirects", { createRedirects: oldDocsPaths }],
    // A remembered theme and full-width choice (only stored once the visitor
    // accepts the cookie choice) go on <html> before the first paint. These
    // run at the top of <body>, after Docusaurus's own theme script, so the
    // two agree.
    () => ({
      injectHtmlTags: () => ({
        preBodyTags: [
          {
            innerHTML: themeBootScript(DOCS_CONSENT_PREFIX),
            tagName: "script",
          },
          {
            innerHTML: contentWidthBootScript(DOCS_CONSENT_PREFIX),
            tagName: "script",
          },
        ],
      }),
      name: "consent-boot",
    }),
  ],

  presets: [
    [
      "classic",
      {
        blog: false,
        docs: {
          editUrl,
          includeCurrentVersion: includeNext,
          routeBasePath: "docs",
          showLastUpdateTime: true,
          sidebarPath: "./sidebars.ts",
          versions: nextVersion,
        },
        // Unlisted: no sitemap, and every page says noindex (below).
        sitemap: false,
        theme: {
          customCss: [
            `${framePackage}/site-frame.css`,
            "./src/css/theme.css",
            "./src/css/custom.css",
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  projectName: "website",

  // static/ holds the docs' own images; /fonts/ comes from packages/frame and
  // /favicon.svg and /img/brand/ from packages/brand.
  staticDirectories: [
    "static",
    `${framePackage}/public`,
    `${brandPackage}/public`,
  ],

  tagline: TAGLINE,

  themeConfig: {
    // The theme follows the system setting until the visitor picks one, as
    // on the site. Nothing in the docs writes to browser storage before the
    // visitor accepts the cookie choice, so Docusaurus's own storage is kept
    // out of it:
    // - colour mode: Docusaurus's switch is off, so it never stores 'theme'
    //   (and clears one left from before). The header shows the shared
    //   switch from packages/frame (the 'custom-themeToggle' item below):
    //   before an answer it only opens the cookie bar; after one it sets the
    //   colour mode without persisting it and keeps the pick in the consent
    //   store (packages/frame theme-pref.ts).
    // - the strip: no announcementBar here, because Docusaurus stores its id
    //   and dismissal on every page load. src/theme/AnnouncementBar draws the
    //   strip instead.
    // - versions: the picked docs version isn't stored (versionPersistence).
    // - tabs: src/theme/Tabs only lets a tab group remember its choice after
    //   consent; before that the choice rides in the URL.
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      },
      versionPersistence: "none",
    },
    // The footer mirrors the site's (apps/site/app/components/footer.tsx): the
    // brand and tagline, the same three link groups, then the same legal line,
    // all from packages/frame content.ts.
    footer: {
      copyright: legalHtml(footer.marks, new Date().getFullYear()),
      links: [
        {
          items: [
            {
              html:
                `<div class="footer__brand"><a class="footer__name" href="${siteLink}/" aria-label="${escapeHtml(product.name)}">` +
                `<img class="footer__mark mark--light" src="${baseUrl}img/brand/mark-light.svg" width="24" height="24" alt="" />` +
                `<img class="footer__mark mark--dark" src="${baseUrl}img/brand/mark-dark.svg" width="24" height="24" alt="" />` +
                `<span class="footer__wordmark">${escapeHtml(product.name)}</span></a>` +
                `<p class="footer__tagline">${escapeHtml(TAGLINE)}</p></div>`,
            },
          ],
          title: null,
        },
        ...footer.groups.map((group) => ({
          items: group.links.map((link) =>
            link.label === "Docs"
              ? { label: link.label, to: "/" }
              : { href: link.href, label: link.label, target: "_self" },
          ),
          title: group.title,
        })),
      ],
    },
    // Link previews. Docusaurus writes each page's og:title, og:description,
    // og:url and twitter:card (summary_large_image) itself, from the page's
    // title and description, as absolute URLs on the configured url. The
    // share image is the site's (packages/brand), served from
    // staticDirectories; the rest is the same for every page.
    image: SHARE_IMAGE,
    metadata: [
      // Unlisted: no search engine, archive or AI crawler may index or use
      // any page. robots.txt and the X-Robots-Tag header (static/_headers) say
      // the same.
      { content: ROBOTS, name: "robots" },
      { content: "website", property: "og:type" },
      { content: `${product.name} docs`, property: "og:site_name" },
      { content: "1200", property: "og:image:width" },
      { content: "630", property: "og:image:height" },
      { content: SHARE_IMAGE_ALT, property: "og:image:alt" },
      { content: SHARE_IMAGE_ALT, name: "twitter:image:alt" },
    ],
    // The header mirrors the site's (apps/site/app/components/nav.tsx): the
    // same mark, wordmark and links in the same order (packages/frame
    // content.ts), then the theme switch. Site links open in the same tab, as
    // they do there, and the mark goes to the site's home. The docs sections
    // live in the sidebar and on the docs home, not in the header.
    navbar: {
      items: [
        // The header is the site's, item for item, on every page. The docs
        // version picker and the full-width switch live in the doc toolbar
        // on the breadcrumb line (src/theme/DocBreadcrumbs), not here.
        ...frameNav(links).map((link) =>
          link.label === "Docs"
            ? {
                activeBaseRegex: "^/",
                className: NAV_LINK_CLASS,
                label: link.label,
                position: "right" as const,
                to: "/",
              }
            : // html, not label: a label on an off-site href gets Docusaurus's
              // external-link icon, which the site's header doesn't have.
              {
                className: NAV_LINK_CLASS,
                href: link.href,
                html: link.label,
                position: "right" as const,
                target: "_self",
              },
        ),
        { position: "right", type: "custom-themeToggle" },
        // Under the frame's breakpoint the links above hide (NAV_LINK_CLASS)
        // and this shared menu button shows after the switch, as on the site.
        {
          links: frameNav(links),
          position: "right",
          type: "custom-headerMenu",
        },
      ],
      logo: {
        alt: "",
        height: 28,
        href: `${siteLink}/`,
        src: "img/brand/mark-light.svg",
        srcDark: "img/brand/mark-dark.svg",
        target: "_self",
        width: 28,
      },
      title: product.name,
    },
    prism: {
      additionalLanguages: ["bash", "go", "yaml", "json", "protobuf", "ini"],
      darkTheme: prismDark,
      theme: prismLight,
    },
  } satisfies Preset.ThemeConfig,

  title: product.name,

  url: docsUrl,
};

export default config;
