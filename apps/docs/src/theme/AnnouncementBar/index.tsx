// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from "react";

import { ThemeClassNames } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

// The strip above the header (packages/frame strip.ts), in the announcement
// bar's place. Docusaurus's own announcement bar stores its id and dismissal
// in browser storage on every page load, before any cookie choice, so it
// isn't configured and this draws the strip on its own. It can't be closed,
// so there's nothing to remember.
export default function AnnouncementBar(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const html = siteConfig.customFields?.stripHtml as string;
  return (
    <div className={ThemeClassNames.announcementBar.container} role="banner">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
