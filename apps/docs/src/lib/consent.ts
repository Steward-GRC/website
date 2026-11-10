// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// The docs' storage key prefix for the shared consent store (packages/frame
// consent.ts), <slug>-docs from packages/frame/product.ts: the switches and
// the cookie bar use it through useBrowserConsent, and the head scripts in
// docusaurus.config.ts read the same keys.
export { DOCS_CONSENT_PREFIX } from "@product/frame/product";
