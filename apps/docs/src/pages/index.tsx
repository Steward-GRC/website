// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from "react";

import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { product } from "@product/frame/product";
import { release } from "@product/frame/release";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

type EntryPoint = {
  description: string;
  label: string;
  to: string;
};

// The docs home: the product's name and tagline, then a card for each
// main section of the guide.
const entries: EntryPoint[] = [
  {
    description:
      "Writing, the editor, approvals, appendices, reading and history.",
    label: "User guide",
    to: "/docs/user/",
  },
  {
    description: "Categories, templates, workflows and who can do what.",
    label: "Admin guide",
    to: "/docs/admin/",
  },
  {
    description:
      "Try the demo: what is real, the test people, the limits of the demo.",
    label: "Demo",
    to: "/docs/demo/",
  },
];

const Home = (): ReactNode => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description={`The ${product.name} documentation: ${product.tagline}`}
      title="Docs"
    >
      <main className="frame-prose">
        <header className={styles.intro}>
          <h1 className={styles.title}>{product.name} docs</h1>
          <p className={styles.tagline}>{product.tagline}</p>
          <p className={styles.tagline}>Docs {release.version}</p>
        </header>
        <section aria-labelledby="docs-sections" className={styles.entryPoints}>
          <h2 className={styles.entryGroupTitle} id="docs-sections">
            Start here
          </h2>
          <div className={styles.entryGrid}>
            {entries.map((entry) => (
              <Link className={styles.entryCard} key={entry.to} to={entry.to}>
                <span className={styles.entryLabel}>{entry.label}</span>
                <span className={styles.entryDescription}>
                  {entry.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className={styles.productLink}>
          <p>
            Looking for the product overview rather than the documentation?{" "}
            <Link href={siteConfig.customFields?.siteUrl as string}>
              Visit {product.domain}
            </Link>
            .
          </p>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
