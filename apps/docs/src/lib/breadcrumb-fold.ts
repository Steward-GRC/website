// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// How the breadcrumb line (src/theme/DocBreadcrumbs) folds a trail that
// doesn't fit beside the doc toolbar: the crumbs above the current page go,
// oldest first, into one "…" item whose title names them, so the page keeps
// its full name whenever it fits. Once every other crumb has folded, the
// page's own name ends in an ellipsis (CSS) instead.

export const FOLD_MARK = "…";
export const TRAIL_SEPARATOR = " › ";

export const foldedTitle = (labels: string[], folded: number): string => {
  return labels.slice(0, folded).join(TRAIL_SEPARATOR);
};

// The fold count after one measure: one more while the trail overflows or the
// page's name is cut, never folding the current page itself.
export const nextFold = ({
  count,
  cut,
  folded,
  overflows,
}: {
  count: number;
  cut: boolean;
  folded: number;
  overflows: boolean;
}): number => {
  if (folded >= count - 1) return folded;
  return overflows || cut ? folded + 1 : folded;
};

// The crumbs to draw: the "…" item (index -1) for the folded ones, then
// the rest with their index in the full trail.
export const visibleCrumbs = (
  labels: string[],
  folded: number,
): { index: number; label: string }[] => {
  const rest = labels
    .slice(folded)
    .map((label, offset) => ({ index: folded + offset, label }));
  return folded > 0 ? [{ index: -1, label: FOLD_MARK }, ...rest] : rest;
};
