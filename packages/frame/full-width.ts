// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import { type Consent, consentKeys } from "./consent.ts";

// The full-width content choice for a docs site. Off by default. It's a
// preference in the consent store, so it's remembered on the machine only
// once the visitor accepts. The page shows it through one attribute on
// <html>, which site-frame.css reads to widen the content column and
// nothing else: the header, the footer and the frame edges stay put.
// Framework-free; full-width-toggle.tsx is the button.

export const CONTENT_WIDTH_PREF = "content-width";
export const CONTENT_WIDTH_ATTRIBUTE = "data-content-width";

type RootLike = {
  removeAttribute(name: string): void;
  setAttribute(name: string, value: string): void;
};

export const isFullWidth = (consent: Consent): boolean => {
  return consent.get(CONTENT_WIDTH_PREF) === "full";
};

const mark = (root: RootLike, full: boolean) =>
  full
    ? root.setAttribute(CONTENT_WIDTH_ATTRIBUTE, "full")
    : root.removeAttribute(CONTENT_WIDTH_ATTRIBUTE);

export const applyContentWidth = (consent: Consent, root: RootLike): void => {
  mark(root, isFullWidth(consent));
};

// An inline script for the page head, so a remembered full-width choice is
// on <html> before the first paint and the column doesn't jump after the
// app loads. It reads the same keys as the consent store and does nothing
// unless the visitor accepted.
export const contentWidthBootScript = (prefix?: string): string => {
  const keys = consentKeys(prefix);
  const consentKey = JSON.stringify(keys.consent);
  const prefKey = JSON.stringify(keys.pref(CONTENT_WIDTH_PREF));
  const attribute = JSON.stringify(CONTENT_WIDTH_ATTRIBUTE);
  return (
    `try{if(localStorage.getItem(${consentKey})==="accepted"&&` +
    `localStorage.getItem(${prefKey})==="full")` +
    `document.documentElement.setAttribute(${attribute},"full")}catch(e){}`
  );
};

export const setFullWidth = (
  consent: Consent,
  full: boolean,
  root: RootLike,
): void => {
  consent.set(CONTENT_WIDTH_PREF, full ? "full" : "normal");
  mark(root, full);
};

// What the switch says. Its label names what pressing it does, so it reads
// "Full width" while off and "Standard width" while on, and the label alone
// carries the state (no aria-pressed as well, which would announce it twice).
// `other` is the label it isn't showing: the button keeps room for both, so
// it doesn't change width when pressed.
export const widthToggleText = (
  full: boolean,
): { label: string; other: string; title: string } => {
  return full
    ? {
        label: "Standard width",
        other: "Full width",
        title: "Narrow the content back to the page column",
      }
    : {
        label: "Full width",
        other: "Standard width",
        title: "Widen the content to the window",
      };
};
