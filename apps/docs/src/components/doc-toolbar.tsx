// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from "react";

import { useActivePlugin } from "@docusaurus/plugin-content-docs/client";
import { isFullWidth, setFullWidth } from "@product/frame/full-width";
import { FullWidthToggle } from "@product/frame/full-width-toggle";
import { useBrowserConsent } from "@product/frame/use-consent";
import { DocsVersionNavbarItem } from "@site/src/components/docs-version-navbar-item";
import { DOCS_CONSENT_PREFIX } from "@site/src/lib/consent";

// The doc toolbar, at the top right of the doc column on the breadcrumb
// line (src/theme/DocBreadcrumbs): the version picker and the full-width
// switch from packages/frame. Keeping them out of the header
// leaves the header the site's, item for item, at every width. On a narrow
// screen the toolbar wraps under the breadcrumbs. The switch reads the
// stored choice only once the page has hydrated, so the first render
// matches the prerendered page.
export const DocToolbar = (): ReactNode => {
  const activePlugin = useActivePlugin();
  const { consent } = useBrowserConsent(DOCS_CONSENT_PREFIX);
  if (!activePlugin) return null;
  const full = consent ? isFullWidth(consent) : false;
  return (
    <div className="doc-toolbar">
      <DocsVersionNavbarItem
        className="doc-toolbar__version"
        docsPluginId={activePlugin.pluginId}
        dropdownActiveClassDisabled
        dropdownItemsAfter={[]}
        dropdownItemsBefore={[]}
        // The dropdown builds its own items from the versions.
        items={[]}
      />
      <div className="doc-toolbar__width">
        <FullWidthToggle
          full={full}
          onToggle={() =>
            consent && setFullWidth(consent, !full, document.documentElement)
          }
        />
      </div>
    </div>
  );
};
