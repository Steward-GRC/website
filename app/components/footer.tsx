import "~/components/marketing.css";
import { Wordmark } from "~/components/wordmark";
import { footer } from "~/content/steward";

// Renders a mark with its (tm) bound to the last word, so a line break can
// never land between the word and its mark.
const MarkedTerm = ({ mark }: { mark: string }) => {
  const lastSpace = mark.lastIndexOf(" ");
  const rest = lastSpace === -1 ? "" : mark.slice(0, lastSpace + 1);
  const lastWord = mark.slice(lastSpace + 1);
  return (
    <>
      {rest}
      <span className="tm-bind">
        {lastWord}
        <sup>&trade;</sup>
      </span>
    </>
  );
};

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Wordmark />
            <p className="footer__tagline">{footer.tagline}</p>
          </div>
          {footer.groups.map((group) => (
            <nav key={group.title} aria-label={group.title} className="footer__group">
              <h2 className="footer__heading">{group.title}</h2>
              <ul className="footer__links">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="footer__legal">
          {footer.marks.map((mark, index) => (
            <span key={mark}>
              {index > 0 && " and "}
              <MarkedTerm mark={mark} />
            </span>
          ))}{" "}
          are trademarks of the {footer.holder} project. &copy; {year} The {footer.holder} Authors. Licensed under
          Apache-2.0.
        </p>
      </div>
    </footer>
  );
};
