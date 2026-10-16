export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__legal">
        Steward<span className="footer__tm">&trade;</span> is a trademark. &copy; {year}. All rights
        reserved.
      </p>
    </footer>
  );
};
