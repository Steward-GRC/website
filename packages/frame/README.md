# @product/frame 🖼️

> 🧩 What the product site and the docs share: the product's name and addresses, the frame, the current release, and consent-first preferences

A private workspace package: `apps/docs` imports it (the product page at the repo root does not yet), nothing is published. Run its
tests with `npm test`, here or from the repo root.

## 📦 What's in it

- 🏷️ **`product.ts`:** the product's name, slug, addresses, tagline and copyright holder, the one
  place a product names itself (filled by `scripts/init-product.mjs`).
- 🎨 **`site-frame.css`:** the frame tokens (column, header, strip, footer), the neutral grey
  colours in light and dark, the system font stack, and the classes for the theme switch, the
  full-width switch, the header menu and the cookie bar.
- 🧭 **`content.ts`, `strip.ts`:** the header links, footer, legal line and release strip.
- 🍔 **`header-menu.tsx`, `header-menu-config.ts`:** the menu button both headers fold their links
  into under 1050px.
- 🚀 **`release.ts`:** the current release, which the strip shows and the docs are versioned after.
- 🍪 **`consent.ts`:** the cookie choice, framework-free. See below.
- 🌗 **`theme-pref.ts`, `theme-toggle.tsx`:** the light and dark choice, consent first, and its
  button.
- ↔️ **`full-width.ts`, `full-width-toggle.tsx`:** the docs' full-width content choice, consent
  first, and its button.
- ⚛️ **`use-consent.ts`, `consent-banner.tsx`:** the React side: hooks for the store and the cookie
  bar.
- 🔤 **`emoji.ts`:** strips emoji from navigation labels (the docs sidebar and table of contents).
- 📁 **`fonts.ts`, `public/fonts/`:** where self-hosted fonts go; empty until a product adds one.

## 🍪 Consent-first preferences

Nothing a site does is written to browser storage until the visitor accepts the cookie choice.
There's no tracking behind it; it only decides whether a preference (the theme, the content
width) is remembered on that machine.

- 🕓 **Before an answer:** the theme follows the visitor's system setting (`prefers-color-scheme`)
  and nothing is stored. Pressing the theme switch only opens the cookie bar (`ask()`); the page
  doesn't change. The full-width switch works at once, in memory, and opens the bar too. The bar
  shows only to someone who touched one of those switches.
- ✅ **Accept:** the answer and the preferences are stored (`<prefix>:consent`,
  `<prefix>:pref:<name>` in localStorage, where the prefix is `<slug>-site` on the site and
  `<slug>-docs` on the docs, from `product.ts`). From then on the theme switch flips the theme and the
  choice is stored, and a small head script applies it before the next page paints.
- 🚫 **Decline:** nothing is stored, not even the refusal, and anything stored before is cleared.
  The theme keeps following the system setting; the switch then flips it for this visit only, in
  memory. A later visit can ask again.

`consent.ts`, `theme-pref.ts` and `full-width.ts` have no framework in them; each site adds a thin
wrapper:

- **Site (React Router):** `apps/site/app/components/theme-switch.tsx` calls `pressThemeSwitch`
  and applies what it returns to `<html>`, and follows system changes until the
  visitor picks a theme; `consent-bar.tsx` renders `ConsentBanner` when the store is asking;
  `root.tsx` puts `themeBootScript(prefix)` in `<head>`. React Router's `ScrollRestoration` is
  replaced with `scroll-to-top.tsx`, because it writes to sessionStorage.
- **Docs (Docusaurus):** `apps/docs/src/components/theme-toggle-navbar-item.tsx` calls
  `pressThemeSwitch` and applies what it returns with `setColorMode(theme, {persist: false})`
  (with `respectPrefersColorScheme: true`, Docusaurus follows the system until then); `src/theme/Root.tsx` renders the
  cookie bar; `docusaurus.config.ts` turns off Docusaurus's own storage (`disableSwitch`, no
  `announcementBar`, `versionPersistence: 'none'`, and `src/theme/Tabs` keeps tab choices in the
  URL until consent) and runs the boot scripts at the top of `<body>`, after Docusaurus's own
  theme script.

`scripts/check-no-storage.mjs` proves it on the built sites: it loads every page in jsdom with
storage watched, and on the docs it also hydrates a few pages and uses the switches. Its
`--prefix` flag names the docs' key prefix, so it checks the keys this product writes.

Restyle the bar and buttons through the `--frame-*` colour tokens; the markup stays the same.
