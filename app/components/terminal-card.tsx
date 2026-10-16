import "./marketing.css";

interface TerminalCardProps {
  title: string;
  lines: string[];
}

// The hero's right-hand card: an illustrative terminal showing the real
// install command from steward-release's README.
export const TerminalCard = ({ title, lines }: TerminalCardProps) => (
  <div className="terminal" role="img" aria-label={`Illustrative terminal output: ${title}`}>
    <div className="terminal__bar">
      <span className="terminal__dot terminal__dot--red" />
      <span className="terminal__dot terminal__dot--yellow" />
      <span className="terminal__dot terminal__dot--green" />
      <span className="terminal__title">{title}</span>
    </div>
    <pre className="terminal__body">
      <code>
        {lines.join("\n")}
        <span className="terminal__cursor" aria-hidden="true" />
      </code>
    </pre>
  </div>
);
