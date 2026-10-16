import { footer, hero, splitLastWord } from "~/content/steward";

export const Footer = () => {
  const year = new Date().getFullYear();
  const [taglineLead, taglineLast] = splitLastWord(hero.tagline);
  return (
    <footer className="footer">
      <p className="footer__legal">
        <span className="tm-bind">
          Steward-GRC<sup>&trade;</sup>
        </span>
        , {taglineLead}{" "}
        <span className="tm-bind">
          {taglineLast}
          <sup>&trade;</sup>
        </span>{" "}
        and their logos are trademarks of {footer.holder}. &copy; {year} {footer.holder}. All rights
        reserved.
      </p>
    </footer>
  );
};
