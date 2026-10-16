import type { MetaFunction } from "react-router";

import { Footer } from "~/components/footer";
import "~/components/coming-soon.css";
import { Wordmark } from "~/components/wordmark";
import { hero, meta as pageMeta } from "~/content/steward";

export const meta: MetaFunction = () => [
  { title: pageMeta.title },
  { name: "description", content: pageMeta.description },
];

export default function Home() {
  return (
    <div className="page">
      <div className="page__backdrop" aria-hidden="true" />
      <main className="hero">
        <div className="hero__inner">
          <Wordmark />
          <p className="hero__tagline">
            {hero.tagline}
            <span className="hero__tagline-tm">&trade;</span>
          </p>
          <p className="hero__status">{hero.status}</p>
          <span className="hero__bar" aria-hidden="true" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
