// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { PropSidebarItem } from "@docusaurus/plugin-content-docs";
import type { WrapperProps } from "@docusaurus/types";
import type DocSidebarItemsType from "@theme/DocSidebarItems";

import { stripEmoji } from "@product/frame/emoji";
import DocSidebarItemsOriginal from "@theme-original/DocSidebarItems";
import { memo, type ReactNode } from "react";

type Properties = WrapperProps<typeof DocSidebarItemsType>;

// The sidebar reads as plain text: page titles keep their emoji on the page
// itself, but the sidebar shows the labels without them.
const plain = (item: PropSidebarItem): PropSidebarItem => {
  if (item.type === "html") return item;
  if (item.type === "category")
    return {
      ...item,
      items: item.items.map(plain),
      label: stripEmoji(item.label),
    };
  return { ...item, label: stripEmoji(item.label) };
};

const DocumentSidebarItems = ({
  items,
  ...properties
}: Properties): ReactNode => {
  return (
    <DocSidebarItemsOriginal
      items={items.map((item) => plain(item))}
      {...properties}
    />
  );
};

export default memo(DocumentSidebarItems);
