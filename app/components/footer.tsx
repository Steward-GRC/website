import "~/components/marketing.css";
import { acknowledgement, footer, hero } from "~/content/steward";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__row">
        <nav aria-label="Footer">
          <ul className="footer__links">
            {footer.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="footer__legal">
          <span className="tm-bind">
            Steward-GRC<sup>&trade;</sup>
          </span>
          , {hero.headlineLine1} {hero.headlineLine2}{" "}
          <span className="tm-bind">
            {hero.headlineLine2TmWord}
            <sup>&trade;</sup>
          </span>
          {hero.headlineLine2Stop} and their logos are trademarks of {footer.holder}. &copy; {year}{" "}
          {footer.holder}. All rights reserved.
        </p>
        <p className="footer__legal">
          {acknowledgement.credit}
          <a href={acknowledgement.creditLink.href}>{acknowledgement.creditLink.label}</a>.{" "}
          {acknowledgement.note}
        </p>
      </div>
    </footer>
  );
};
