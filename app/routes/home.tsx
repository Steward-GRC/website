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
  whatItIs,
} from "~/content/steward";

export const meta: MetaFunction = () => [
  { title: pageMeta.title },
  { name: "description", content: pageMeta.description },
  { property: "og:site_name", content: pageMeta.siteName },
  { property: "og:title", content: pageMeta.title },
  { property: "og:description", content: pageMeta.description },
  { property: "og:type", content: "website" },
  { property: "og:url", content: pageMeta.url },
  { name: "twitter:card", content: "summary" },
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

        <Section id="coming-later" eyebrow={comingLater.eyebrow} heading={comingLater.heading} lede={comingLater.lede} tone="card">
          <FeatureGrid items={comingLater.features} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
