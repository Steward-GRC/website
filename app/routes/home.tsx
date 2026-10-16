import type { MetaFunction } from "react-router";

import { FeatureGrid } from "~/components/feature-grid";
import { Footer } from "~/components/footer";
import "~/components/marketing.css";
import { Nav } from "~/components/nav";
import { Section } from "~/components/section";
import { SplitHero } from "~/components/split-hero";
import { TerminalCard } from "~/components/terminal-card";
import {
  comingLater,
  hero,
  howItRuns,
  meta as pageMeta,
  nav,
  openSource,
  whatItIs,
} from "~/content/steward";

export const meta: MetaFunction = () => [
  { title: pageMeta.title },
  { name: "description", content: pageMeta.description },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav links={nav.links} />
      <main id="main">
        <SplitHero
          eyebrow={hero.eyebrow}
          headlineLine1={hero.headlineLine1}
          headlineLine2={hero.headlineLine2}
          headlineLine2TmWord={hero.headlineLine2TmWord}
          headlineLine2Stop={hero.headlineLine2Stop}
          lede={hero.lede}
          primaryCta={hero.primaryCta}
          secondaryCta={hero.secondaryCta}
        >
          <TerminalCard title={hero.terminal.title} lines={hero.terminal.lines} />
        </SplitHero>

        <Section id="what-it-is" eyebrow={whatItIs.eyebrow} heading={whatItIs.heading} lede={whatItIs.lede}>
          <FeatureGrid items={whatItIs.features} className="feature-grid--quad" />
        </Section>

        <Section id="how-it-runs" eyebrow={howItRuns.eyebrow} heading={howItRuns.heading} tone="card">
          {howItRuns.paragraphs.map((paragraph) => (
            <p className="prose" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </Section>

        <Section id="open-source" eyebrow={openSource.eyebrow} heading={openSource.heading}>
          <p className="prose">
            Steward-GRC is open source, licensed under the{" "}
            <a href={openSource.license.href}>{openSource.license.label}</a>.{" "}
            <a href={openSource.org.href}>{openSource.org.label}</a>
          </p>
          <p className="prose">
            <span className="tm-bind">
              Steward-GRC<sup>&trade;</sup>
            </span>
            , its logo and the tagline {hero.headlineLine1} {hero.headlineLine2}{" "}
            <span className="tm-bind">
              {hero.headlineLine2TmWord}
              <sup>&trade;</sup>
            </span>
            {hero.headlineLine2Stop}
            {openSource.trademarkTail}
          </p>
        </Section>

        <Section id="coming-later" eyebrow={comingLater.eyebrow} heading={comingLater.heading} lede={comingLater.lede} tone="card">
          <FeatureGrid items={comingLater.features} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
