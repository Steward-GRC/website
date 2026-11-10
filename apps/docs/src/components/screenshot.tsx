// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from "react";

import useBaseUrl from "@docusaurus/useBaseUrl";
import slots from "@site/src/data/screenshots.json";

import styles from "./screenshot.module.css";

type Slots = Record<string, { ready: boolean }>;

// A guide picture. Its numbers match the numbered list under it. Until the
// real light-mode capture is in place (src/data/screenshots.json says so, and
// static/img/guide/<slot>.png exists), it draws a plain labelled box with the
// slot's name, so the page reads the same before and after.
export const Screenshot = ({
  alt,
  slot,
}: {
  alt: string;
  slot: string;
}): ReactNode => {
  const source = useBaseUrl(`/img/guide/${slot}.png`);
  const known = (slots as Slots)[slot];
  if (!known) throw new Error(`Unknown screenshot slot "${slot}"`);
  return (
    <figure className={styles.figure}>
      {known.ready ? (
        <img alt={alt} className={styles.image} loading="lazy" src={source} />
      ) : (
        <div
          aria-label={`Placeholder for the screenshot: ${alt}`}
          className={styles.placeholder}
          role="img"
        >
          <span className={styles.slot}>{slot}</span>
          <span>Screenshot placeholder</span>
        </div>
      )}
      <figcaption className={styles.caption}>{alt}</figcaption>
    </figure>
  );
};
