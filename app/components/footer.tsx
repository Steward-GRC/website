import "~/components/marketing.css";
import { footer, hero, openSource } from "~/content/steward";

export const Footer = () => {
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
          Copyright &copy; The Steward Authors. Licensed under the{" "}
          <a href={openSource.license.href}>{openSource.license.label}</a>.
        </p>
        <p className="footer__legal">
          <span className="tm-bind">
            Steward-GRC<sup>&trade;</sup>
          </span>
          , {hero.headlineLine1} {hero.headlineLine2}{" "}
          <span className="tm-bind">
            {hero.headlineLine2TmWord}
            <sup>&trade;</sup>
          </span>
          {hero.headlineLine2Stop} and their logos are trademarks of {footer.holder}.
        </p>
      </div>
    </footer>
  );
};
