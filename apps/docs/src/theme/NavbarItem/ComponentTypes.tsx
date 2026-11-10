// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import { HeaderMenuNavbarItem } from "@site/src/components/header-menu-navbar-item";
import { ThemeToggleNavbarItem } from "@site/src/components/theme-toggle-navbar-item";
import ComponentTypes from "@theme-original/NavbarItem/ComponentTypes";

// Adds the 'custom-themeToggle' and 'custom-headerMenu' navbar item types
// (docusaurus.config.ts).
export default {
  ...ComponentTypes,
  "custom-headerMenu": HeaderMenuNavbarItem,
  "custom-themeToggle": ThemeToggleNavbarItem,
};
