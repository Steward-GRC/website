// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";

import { tabsWithoutStorage } from "./tabs-storage.ts";

test("before consent a tab group keeps its choice in the URL, not in storage", () => {
  assert.deepEqual(
    tabsWithoutStorage({ groupId: "os", queryString: true }, false),
    {
      groupId: undefined,
      queryString: "os",
    },
  );
  assert.deepEqual(tabsWithoutStorage({ groupId: "os" }, false), {
    groupId: undefined,
    queryString: "os",
  });
  assert.deepEqual(
    tabsWithoutStorage({ groupId: "os", queryString: "platform" }, false),
    {
      groupId: undefined,
      queryString: "platform",
    },
  );
});

test("after consent a tab group remembers its choice as Docusaurus does", () => {
  const properties = { groupId: "os", queryString: true };
  assert.equal(tabsWithoutStorage(properties, true), properties);
});

test("a tab group with no groupId is left alone", () => {
  const properties = { queryString: false };
  assert.equal(tabsWithoutStorage(properties, false), properties);
});
