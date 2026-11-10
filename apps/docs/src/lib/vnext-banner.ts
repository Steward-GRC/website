// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// The banner on every vNext page (src/theme/DocVersionBanner). The versions
// come from packages/frame/release.ts.
export const vnextBannerText = ({
  upcoming,
  version,
}: {
  upcoming: string;
  version: string;
}): string => {
  return `This page describes planned work, or work that may ship soon in ${upcoming}. The current release is ${version}.`;
};
