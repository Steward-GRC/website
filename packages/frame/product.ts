// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// The one place a product names itself. Every other file reads these values,
// so filling them in (scripts/init-product.mjs, see TEMPLATE.md) turns the
// template into a product's site and docs. Each value is a marked
// placeholder until then.
//
// - name: the product's name as people write it.
// - slug: lowercase letters, digits and hyphens. It names the Cloudflare
//   Pages projects (<slug>-www, <slug>-docs) and the browser storage keys
//   (<slug>-site, <slug>-docs).
// - domain: the product site's host, without a scheme.
// - docsDomain: the docs site's host, without a scheme.
// - githubOrg: the GitHub organisation or user that holds the product.
// - tagline: one short line under the name.
// - copyrightHolder: who the footer's copyright line names.
export const product = {
  copyrightHolder: "The Steward Authors",
  docsDomain: "docs.steward-grc.com",
  domain: "www.steward-grc.com",
  githubOrg: "Steward-GRC",
  name: "Steward",
  slug: "steward",
  tagline:
    "Open-source policy, procedure and compliance management, built as a set of small services.",
} as const;

export const siteUrl = `https://${product.domain}`;
export const docsUrl = `https://${product.docsDomain}`;
export const githubUrl = `https://github.com/${product.githubOrg}`;

// The storage key prefixes for the consent store (consent.ts): one per site,
// so the site and the docs keep their answers apart.
export const SITE_CONSENT_PREFIX = `${product.slug}-site`;
export const DOCS_CONSENT_PREFIX = `${product.slug}-docs`;
