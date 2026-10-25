export interface LedeSegment {
  text: string;
  accent?: boolean;
}

export const meta = {
  title: "Steward-GRC",
  // The org profile README's own tagline line, word for word.
  description: "Open-source policy, procedure and compliance management, built as a set of small services.",
  siteName: "Steward-GRC",
  url: "https://www.steward-grc.com/",
};

// The tagline is Steward-GRC's own line, exactly "Rules kept. Voices
// heard.(tm)" with the mark bound to "heard" and the period after it. Both
// the hero headline and the footer trademark notice build it from the same
// headlineLine2TmWord/headlineLine2Stop fields, so the mark never drifts to
// the wrong side of the period.
export const hero = {
  eyebrow: "Steward-GRC",
  headlineLine1: "Rules kept.",
  headlineLine2: "Voices",
  headlineLine2TmWord: "heard",
  headlineLine2Stop: ".",
  // Steward-GRC/.github profile/README.md, second sentence of the project
  // description ("It" -> "Steward-GRC" so the line stands on its own).
  lede: [
    { text: "Steward-GRC keeps an organisation's policies and procedures in one place, takes them through " },
    { text: "multi-stage approval workflows", accent: true },
    { text: ", tracks who has " },
    { text: "read and acknowledged", accent: true },
    { text: " them, and backs every change with a " },
    { text: "hash-chained, independently verifiable audit trail", accent: true },
    { text: "." },
  ] satisfies LedeSegment[],
  // Steward-GRC/docs src/pages/index.tsx (feat/1-guide): the guide home
  // hero's own button labels, word for word.
  primaryCta: { label: "Start reading", href: "https://github.com/Steward-GRC/docs" },
  secondaryCta: { label: "View on GitHub", href: "https://github.com/Steward-GRC" },
  // steward-release README.md, the "Install" command, word for word.
  terminal: {
    title: "helm install steward",
    lines: ["$ helm dependency build .", "$ helm install steward . -f values.yaml --namespace steward --create-namespace"],
  },
};

export const whatItIs = {
  eyebrow: "What it is",
  // steward-web README.md, first sentence, word for word.
  heading: "Steward keeps your organisation's rules in one place and gives everyone a safe way to speak up.",
  // Steward-GRC/docs welcome.md (feat/1-guide), word for word.
  lede: "Instead of hunting through email or shared drives, you come here to find, read and confirm the one that matters to you.",
  features: [
    {
      title: "Policy & procedure",
      // docs/using-steward/concepts.md, word for word.
      body: "A policy is a written rule: it tells people in your organisation how to do something the right way. A procedure is a written set of steps: it walks through how to actually carry a policy out.",
    },
    {
      title: "Workflow",
      // docs/reference.md glossary, word for word.
      body: "An ordered set of approval stages a draft moves through before it is published.",
    },
    {
      title: "Acknowledgement",
      // docs/reference.md glossary, word for word.
      body: "A user's confirmation that they have read a document. The record stands while the user keeps Acknowledge access to that document's category; it is cleared if they lose it.",
    },
    {
      title: "Access model",
      // docs/using-steward/concepts.md, word for word.
      body: "Access is controlled per category, so the same person may have different rights in different parts of the category tree.",
    },
  ],
};

export const howItRuns = {
  eyebrow: "How it runs",
  // Steward-GRC/docs docs/install.md (feat/1-guide), first sentence, trimmed
  // at the clause and word for word up to there.
  heading: "Steward is a self-hosted platform: one umbrella Helm chart composing every service, each with its own high-availability Postgres instance.",
  paragraphs: [
    // steward-release docs/install.md, "the first-class install path... use
    // this chart when you already run Kubernetes and want to bring your
    // own" (second person swapped to third so it stands next to the next
    // sentence).
    "The chart lives in steward-release, the first-class install path for anyone who already runs Kubernetes and wants to bring their own.",
    // Steward-GRC/docs docs/install.md (feat/1-guide), the appliance
    // parenthetical, word for word, as its own sentence.
    "The appliance is the other path: a separate, single-node closed-shell OS image for anyone who doesn't.",
    // steward-release README.md, "Shared clusters" bullet, word for word.
    "Default values install no cluster-scoped object: no CRDs, ClusterRoles, webhooks or ClusterIssuers.",
  ],
};

// The footer's acknowledgements line, not its own section: every steward-*
// README's Acknowledgements and License sections, word for word.
export const acknowledgement = {
  credit: "Steward was originally written by ",
  creditLink: { label: "@Bugs5382", href: "https://github.com/Bugs5382" },
  note: "Apache-2.0.",
};

export const comingLater = {
  // docs/reference.md (feat/1-guide), "Coming later" heading, word for word.
  eyebrow: "Coming later",
  // docs/reference.md, "Coming later" section, the noun phrase, word for word.
  heading: "The optional Compliance reporting and Ethics modules",
  // docs/reference.md, "Coming later" section, word for word.
  lede: "This guide doesn't yet cover the optional Compliance reporting and Ethics modules; a later edition will.",
  features: [
    {
      title: "Compliance reporting",
      // From the product's design package, condensed from its first and
      // last sentences; the HIPAA/PHI example is dropped to keep this
      // generic, per the no-reference-product rule.
      body: "A module where anyone in the organisation can report a privacy or health-information compliance concern, anonymously or with their name, and a privacy officer works the case to a close.",
    },
    {
      title: "Ethics",
      // From the product's design package, condensed from its opening
      // summary (marked "proposed" in that file).
      body: "Ethics has two parts: reporting, which works like Compliance reporting (anyone can raise a concern, anonymously or with their name, and an ethics officer works the case in a separate queue), and annual attestations, where everyone reads and confirms a set of documents, makes required disclosures, and signs.",
    },
  ],
};

// The holder wording is copied from Steward-GRC/.github's TRADEMARKS.md and
// profile/README.md (merged to main 2026-10-15): "...are trademarks of the
// rabbit hole tech, llc."
export const footer = {
  holder: "the rabbit hole tech, llc",
  links: [
    { label: "GitHub", href: "https://github.com/Steward-GRC" },
    { label: "Docs", href: "https://github.com/Steward-GRC/docs" },
  ],
};

export const nav = {
  links: [
    { label: "What it is", href: "#what-it-is" },
    { label: "How it runs", href: "#how-it-runs" },
    { label: "GitHub", href: "https://github.com/Steward-GRC" },
  ],
};
