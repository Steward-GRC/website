import { Link } from "react-router";

import "./marketing.css";
import { Wordmark } from "~/components/wordmark";

interface NavLink {
  label: string;
  href: string;
}

interface NavProps {
  links: NavLink[];
}

export const Nav = ({ links }: NavProps) => (
  <header className="nav">
    <div className="container nav__row">
      <Link className="nav__brand" to="/" aria-label="Steward-GRC">
        <Wordmark />
      </Link>
      <nav aria-label="Primary">
        <ul className="nav__links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
);
