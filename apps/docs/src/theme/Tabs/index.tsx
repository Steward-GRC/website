// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { WrapperProps } from "@docusaurus/types";
import type TabsType from "@theme/Tabs";
import type { ReactNode } from "react";

import { useBrowserConsent } from "@product/frame/use-consent";
import { DOCS_CONSENT_PREFIX } from "@site/src/lib/consent";
import { tabsWithoutStorage } from "@site/src/lib/tabs-storage";
import TabsOriginal from "@theme-original/Tabs";

type Properties = WrapperProps<typeof TabsType>;

// Tab groups remember their choice only after the visitor accepts the cookie
// choice (src/lib/tabs-storage.ts). Picking a tab doesn't ask; only the
// theme and full-width switches do.
export default function Tabs(properties: Properties): ReactNode {
  const { state } = useBrowserConsent(DOCS_CONSENT_PREFIX);
  return (
    <TabsOriginal {...tabsWithoutStorage(properties, state === "accepted")} />
  );
}
