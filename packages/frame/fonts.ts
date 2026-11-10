// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Self-hosted fonts, written as font-face rules with the site's base path. The
// template draws on the system font stack (site-frame.css), so the list
// starts empty. A product that self-hosts its fonts puts the WOFF2 files and
// their licences in public/fonts and lists each file here.
//
// A url() in site-frame.css can't know the base, so a site served under a
// sub-path (a preview) would look for /fonts/ at the server root; each site
// passes its own base here and puts the rules in its <head> instead. Both
// sites get the same files at the same URLs under their base.

export interface FrameFont {
  family: string;
  file: string;
  // A unicode-range, when the face is one subset of a family.
  range?: string;
  style?: "italic" | "normal";
  weight: string;
}

export const FRAME_FONTS: FrameFont[] = [];

// The files the strip, header and footer draw with, preloaded on both sites
// so the frame never paints in a fallback face first.
export const PRELOAD_FONTS: string[] = [];

const withSlash = (base: string) => (base.endsWith("/") ? base : `${base}/`);

export const fontUrl = (base: string, file: string) =>
  `${withSlash(base)}fonts/${file}`;

export const fontFaceCss = (base: string, fonts: FrameFont[] = FRAME_FONTS) =>
  fonts
    .map(
      (font) =>
        `@font-face{font-family:"${font.family}";font-style:${font.style ?? "normal"};` +
        `font-weight:${font.weight};font-display:swap;` +
        `src:url("${fontUrl(base, font.file)}") format("woff2");` +
        (font.range ? `unicode-range:${font.range};` : "") +
        "}",
    )
    .join("\n");
