// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Docusaurus's Tabs remember a tab group's choice (groupId) in browser
// storage. Before the visitor accepts the cookie choice, a group keeps its
// choice in the URL instead (queryString, named after the group), so tab
// groups on a page still switch together and nothing is stored. After they
// accept, the props pass through unchanged.
type TabsStorageProperties = {
  groupId?: string;
  queryString?: boolean | string;
};

export const tabsWithoutStorage = <P extends TabsStorageProperties>(
  properties: P,
  accepted: boolean,
): P => {
  if (accepted || !properties.groupId) return properties;
  const queryString =
    typeof properties.queryString === "string"
      ? properties.queryString
      : properties.groupId;
  return { ...properties, groupId: undefined, queryString };
};
