// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from "react";

import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { product } from "@product/frame/product";
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
    description: "What the demo is, what is real, and how long it takes.",
    label: "Start here",
    to: "/docs/",
  },
  {
    description: "Open the demo and pick one of the eight test people.",
    label: "Signing in",
    to: "/docs/signing-in",
  },
  {
    description: "Write a policy or procedure, and submit it for approval.",
    label: "Policies and procedures",
    to: "/docs/policies-and-procedures",
  },
  {
    description: "Approve, reject or comment as an approver.",
    label: "Approvals",
    to: "/docs/approvals",
  },
  {
    description: "Read a published document, compare versions, print.",
    label: "Reading and history",
    to: "/docs/reading-and-history",
  },
  {
    description: "Categories, templates and workflows.",
    label: "Admin",
    to: "/docs/admin",
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
