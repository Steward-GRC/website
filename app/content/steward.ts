export const meta = {
  title: "Steward-GRC",
  description: "Open-source policy, procedure and compliance management, coming soon.",
};

// The tagline is Steward-GRC's own line (owner, 2026-10-15).
export const hero = {
  tagline: "Rules kept. Voices heard.",
  status: "Coming soon",
};

// The holder wording is copied from Steward-GRC/.github's TRADEMARKS.md and
// profile/README.md (merged to main 2026-10-15): "...are trademarks of the
// rabbit hole tech, llc."
export const footer = {
  holder: "the rabbit hole tech, llc",
};

// Splits off the last word of a phrase so a trademark mark can be bound to it
// with a non-breaking span: the mark never wraps onto its own line.
export const splitLastWord = (phrase: string): [string, string] => {
  const i = phrase.lastIndexOf(" ");
  return i === -1 ? ["", phrase] : [phrase.slice(0, i), phrase.slice(i + 1)];
};
