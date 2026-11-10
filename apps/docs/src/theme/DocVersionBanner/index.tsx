// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from "react";

import { useDocsVersion } from "@docusaurus/plugin-content-docs/client";
import { ThemeClassNames } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { vnextBannerText } from "@site/src/lib/vnext-banner";
import clsx from "clsx";

type Release = { upcoming: string; version: string };

// The banner on every vNext page (the unreleased "current" version), naming
// the release being built and the current one (packages/frame/release.ts,
// passed in customFields). Released versions get no banner.
const DocumentVersionBanner = ({
  className,
}: {
  className?: string;
}): ReactNode => {
  const version = useDocsVersion();
  const { siteConfig } = useDocusaurusContext();
  const release = siteConfig.customFields?.docsRelease as Release | undefined;
  if (version.version !== "current" || !release) return null;
  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        "alert alert--warning margin-bottom--md",
      )}
      role="alert"
    >
      {vnextBannerText(release)}
    </div>
  );
};

export default DocumentVersionBanner;
