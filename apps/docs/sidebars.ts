// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// The docs sidebar. Order here is the sidebar order; ids are file paths under
// docs/ minus ".md". Three parts: the user guide, the admin guide, and the
// demo, which holds everything that is only about the demo.
const sidebars: SidebarsConfig = {
  docs: [
    {
      collapsed: false,
      items: [
        "user/index",
        "user/policies-and-procedures",
        "user/editor",
        "user/approvals",
        "user/appendices",
        "user/library",
        "user/reading-and-history",
      ],
      label: "User guide",
      type: "category",
    },
    {
      collapsed: false,
      items: ["admin/index"],
      label: "Admin guide",
      type: "category",
    },
    {
      collapsed: false,
      items: ["demo/index", "demo/signing-in", "demo/things-to-know"],
      label: "Demo",
      type: "category",
    },
  ],
};

export default sidebars;
