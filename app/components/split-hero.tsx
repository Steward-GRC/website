import type { ReactNode } from "react";

import type { LedeSegment } from "~/content/steward";

import "./marketing.css";

interface Cta {
  label: string;
  href: string;
}

interface SplitHeroProps {
  eyebrow: string;
  headlineLine1: string;
  /** The accent line's text before the trademarked word. */
  headlineLine2: string;
  /** The trademarked word the (tm) binds to. */
  headlineLine2TmWord: string;
  /** Punctuation right after the mark, inside the same no-break span. */
  headlineLine2Stop: string;
  lede: LedeSegment[];
  primaryCta: Cta;
  secondaryCta: Cta;
  children: ReactNode;
}

// A two-column hero over a faint grid backdrop with a blurred radial glow,
// top-right. Carried over from the coming-soon page's brand tokens.
export const SplitHero = ({
  eyebrow,
  headlineLine1,
  headlineLine2,
  headlineLine2TmWord,
  headlineLine2Stop,
  lede,
  primaryCta,
  secondaryCta,
  children,
}: SplitHeroProps) => (
  <section className="hero">
    <div className="hero__backdrop" aria-hidden="true" />
    <div className="container hero__grid">
      <div className="hero__copy">
        <p className="hero__eyebrow">
          <span className="tm-bind">
            {eyebrow}
            <sup>&trade;</sup>
          </span>
        </p>
        <h1 className="hero__headline">
          <span>{headlineLine1}</span>
          <span className="hero__headline-accent">
            {headlineLine2}{" "}
            <span className="tm-bind">
              {headlineLine2TmWord}
              <sup>&trade;</sup>
            </span>
            {headlineLine2Stop}
          </span>
        </h1>
        <p className="hero__lede">
          {lede.map((segment, index) =>
            segment.accent ? <mark key={index}>{segment.text}</mark> : <span key={index}>{segment.text}</span>,
          )}
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href={primaryCta.href}>
            {primaryCta.label}
          </a>
          <a className="button button--secondary" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        </div>
      </div>
      <div className="hero__aside">{children}</div>
    </div>
  </section>
);
