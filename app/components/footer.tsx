import { footer, hero } from "~/content/steward";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__legal">
        Steward-GRC<span className="footer__tm">&trade;</span>, &ldquo;{hero.tagline}&rdquo;
        <span className="footer__tm">&trade;</span> and their logos are trademarks of {footer.holder}. &copy;{" "}
        {year} {footer.holder}. All rights reserved.
      </p>
    </footer>
  );
};
