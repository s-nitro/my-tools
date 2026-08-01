import { Link } from "react-router-dom";
import { tools } from "../toolsRegistry.js";

export default function Home() {
  return (
    <main className="home">
      <ul className="tool-grid" role="list">
        {tools.map((tool) => (
          <li
            key={tool.path}
            className="tool-card"
            style={{ background: tool.background }}
          >
            <Link to={`/${tool.path}`} className="tool-card__link">
              {tool.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
