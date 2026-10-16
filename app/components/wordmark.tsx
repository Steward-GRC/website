// The Steward mark, copied from steward-web's apps/docs/static/img/mark.svg
// (same brand asset, inlined here so this repo doesn't depend on that one).
export const Wordmark = () => (
  <span className="wordmark">
    <svg className="wordmark__mark" viewBox="0 0 48 48" role="img" aria-label="The Steward mark">
      <path
        fill="#5d2a5b"
        fillRule="evenodd"
        d="M12 4h24a5 5 0 0 1 5 5v30a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5zM14 29.5h20a1.5 1.5 0 0 1 0 3H14a1.5 1.5 0 0 1 0-3zM14 35.5h13a1.5 1.5 0 0 1 0 3H14a1.5 1.5 0 0 1 0-3z"
      />
      <path fill="#e2a336" d="M27 4h9v21l-4.5-4.2L27 25z" />
    </svg>
    <span className="wordmark__name">
      <span className="tm-bind">
        Steward-GRC<sup>&trade;</sup>
      </span>
    </span>
  </span>
);
