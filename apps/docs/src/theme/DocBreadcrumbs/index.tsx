// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import Link from "@docusaurus/Link";
import { useSidebarBreadcrumbs } from "@docusaurus/plugin-content-docs/client";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useHomePageRoute } from "@docusaurus/theme-common/internal";
import { stripEmoji } from "@product/frame/emoji";
import { DocToolbar } from "@site/src/components/doc-toolbar";
import {
  FOLD_MARK,
  foldedTitle,
  nextFold,
  TRAIL_SEPARATOR,
  visibleCrumbs,
} from "@site/src/lib/breadcrumb-fold";
import HomeBreadcrumbItem from "@theme/DocBreadcrumbs/Items/Home";
import DocBreadcrumbsStructuredData from "@theme/DocBreadcrumbs/StructuredData";
import clsx from "clsx";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

// The breadcrumb line carries the doc toolbar at its right end, on one line
// of a fixed height on every doc page, so the page title always starts at
// the same y. When the trail doesn't fit beside the toolbar, the crumbs
// above the page fold, oldest first, into one "…" item (its title names
// them), so the current page keeps its full name whenever it fits; only
// once every other crumb has folded does the current page's name end in an
// ellipsis. The full trail is the line's title. On a page with no
// breadcrumbs the toolbar still takes this spot; on phones it has a line of
// its own under the breadcrumbs (src/css/custom.css).
export default function DocumentBreadcrumbs(): ReactNode {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const listReference = useRef<HTMLUListElement>(null);
  const [folded, setFolded] = useState(0);
  // Bumped on every fresh measure, so folding runs again even when it
  // restarts from a fold count it already had.
  const [pass, setPass] = useState(0);
  const count = breadcrumbs?.length ?? 0;
  const trailKey = breadcrumbs?.map((item) => item.label).join("\u0000") ?? "";
  const lastWidth = useRef(-1);

  // A new width (or a new page) starts again from the whole trail.
  useLayoutEffect(() => {
    const list = listReference.current;
    const restart = () => {
      setFolded(0);
      setPass((value) => value + 1);
    };
    restart();
    if (!list || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next === lastWidth.current) return;
      lastWidth.current = next;
      restart();
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, [trailKey]);

  // Fold one more crumb while the trail overflows or the current page's
  // name is cut, until only the current page is left unfolded
  // (src/lib/breadcrumb-fold.ts).
  useLayoutEffect(() => {
    const list = listReference.current;
    if (!list) return;
    const current = list.querySelector<HTMLElement>(
      ".breadcrumbs__item:last-child .breadcrumbs__link",
    );
    const overflows = list.scrollWidth > list.clientWidth + 1;
    const cut = current ? current.scrollWidth > current.clientWidth + 1 : false;
    const next = nextFold({ count, cut, folded, overflows });
    if (next !== folded) setFolded(next);
  }, [folded, count, pass]);

  if (!breadcrumbs) return <Row list={null} trail={undefined} />;
  const labels = breadcrumbs.map((item) => stripEmoji(item.label));

  const list = (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <nav
        aria-label="Breadcrumbs"
        className={ThemeClassNames.docs.docBreadcrumbs}
      >
        <ul className="breadcrumbs" ref={listReference}>
          {homePageRoute && <HomeBreadcrumbItem />}
          {visibleCrumbs(labels, folded).map(({ index }) => {
            if (index < 0) {
              return (
                <li
                  className="breadcrumbs__item breadcrumbs__item--folded"
                  key="folded"
                >
                  <span
                    className="breadcrumbs__link"
                    title={foldedTitle(labels, folded)}
                  >
                    {FOLD_MARK}
                  </span>
                </li>
              );
            }
            const item = breadcrumbs[index];
            const isLast = index === count - 1;
            const href =
              item.type === "category" && item.linkUnlisted
                ? undefined
                : item.href;
            return (
              <li
                className={clsx("breadcrumbs__item", {
                  "breadcrumbs__item--active": isLast,
                })}
                key={index}
              >
                {isLast || !href ? (
                  <span className="breadcrumbs__link">{item.label}</span>
                ) : (
                  <Link className="breadcrumbs__link" href={href}>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
  return <Row list={list} trail={labels.join(TRAIL_SEPARATOR)} />;
}

const Row = ({
  list,
  trail,
}: {
  list: ReactNode;
  trail: string | undefined;
}): ReactNode => {
  return (
    <div className="doc-toolbar-row">
      <div className="doc-toolbar-row__crumbs" title={trail || undefined}>
        {list}
      </div>
      <DocToolbar />
    </div>
  );
};
