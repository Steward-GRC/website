// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { ComponentProps, ReactNode } from "react";

import { useActiveDocContext } from "@docusaurus/plugin-content-docs/client";
import DocsVersionDropdownNavbarItem from "@theme/NavbarItem/DocsVersionDropdownNavbarItem";

type Properties = ComponentProps<typeof DocsVersionDropdownNavbarItem>;

// The docs version dropdown for one docs instance, in the doc toolbar
// (doc-toolbar.tsx). Off a doc page it renders nothing. Used outside the
// navbar config, it skips the defaults the built-in 'docsVersionDropdown'
// type gets, so they're set here.
export const DocsVersionNavbarItem = ({
  dropdownItemsAfter = [],
  dropdownItemsBefore = [],
  ...properties
}: Properties): ReactNode => {
  const { activeVersion } = useActiveDocContext(properties.docsPluginId);
  if (!activeVersion) return null;
  return (
    <DocsVersionDropdownNavbarItem
      dropdownItemsAfter={dropdownItemsAfter}
      dropdownItemsBefore={dropdownItemsBefore}
      {...properties}
    />
  );
};
