// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { FrameLink } from "@product/frame/content";
import type { ReactNode } from "react";

import { HeaderMenu } from "@product/frame/header-menu";

// The shared menu button from packages/frame, the same one the site shows
// after its theme switch: under the frame's breakpoint it holds the header
// links. It isn't a navbar__item, so Infima's phone rules don't hide it, and
// it renders nothing in Docusaurus's own phone menu.
export const HeaderMenuNavbarItem = ({
  links,
  mobile,
}: {
  links: FrameLink[];
  mobile?: boolean;
}): ReactNode => {
  if (mobile) return null;
  return <HeaderMenu links={links} />;
};
