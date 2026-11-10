// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { WrapperProps } from "@docusaurus/types";
import type TOCItemsType from "@theme/TOCItems";
import type { ReactNode } from "react";

import { stripEmoji } from "@product/frame/emoji";
import TOCItemsOriginal from "@theme-original/TOCItems";

type Properties = WrapperProps<typeof TOCItemsType>;

// The table of contents beside a page (and its collapsed form on phones)
// lists the headings without their emoji; the headings keep them.
export default function TOCItems({
  toc,
  ...properties
}: Properties): ReactNode {
  return (
    <TOCItemsOriginal
      toc={toc.map((item) => ({ ...item, value: stripEmoji(item.value) }))}
      {...properties}
    />
  );
}
