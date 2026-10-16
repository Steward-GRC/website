import "./marketing.css";

interface FeatureItem {
  title: string;
  body: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  /** Extra class on the grid, e.g. "feature-grid--quad" for a four-up row. */
  className?: string;
}

export const FeatureGrid = ({ items, className }: FeatureGridProps) => (
  <ul className={className ? `feature-grid ${className}` : "feature-grid"}>
    {items.map((item) => (
      <li key={item.title} className="feature-card">
        <h3 className="feature-card__title">{item.title}</h3>
        <p className="feature-card__body">{item.body}</p>
      </li>
    ))}
  </ul>
);
