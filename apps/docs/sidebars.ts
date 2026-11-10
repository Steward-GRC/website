// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// The docs sidebar. Order here is the sidebar order; ids are file paths under
// docs/ minus ".md".
const sidebars: SidebarsConfig = {
  docs: [
    {
      collapsed: false,
      items: ["index", "signing-in", "things-to-know"],
      label: "Start here",
      type: "category",
    },
    {
      collapsed: false,
      items: [
        "policies-and-procedures",
        "approvals",
        "appendices",
        "library",
        "reading-and-history",
      ],
      label: "The staff app",
      type: "category",
    },
    {
      collapsed: false,
      items: ["admin"],
      label: "The admin app",
      type: "category",
    },
  ],
};

export default sidebars;
