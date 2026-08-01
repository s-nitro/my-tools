import { Link } from 'react-router-dom'
import { tools } from '../toolsRegistry.js'

export default function Home() {
  return (
    <main className="home">
      <header className="home__header">
        <p className="home__eyebrow">workbench</p>
        <h1>My Tools</h1>
        <p className="home__lede">
          Small, single-purpose tools. No accounts, no tracking, no build
          step to run them — just open a path and use it.
        </p>
      </header>

      <ul className="tool-grid" role="list">
        {tools.map((tool) => (
          <li key={tool.path} className="tool-card">
            <Link to={`/${tool.path}`} className="tool-card__link">
              <code className="tool-card__path">/{tool.path}</code>
              <h2 className="tool-card__name">{tool.name}</h2>
              <p className="tool-card__blurb">{tool.blurb}</p>
              <span className="tool-card__go" aria-hidden="true">
                open →
              </span>
            </Link>
          </li>
        ))}

        <li className="tool-card tool-card--add">
          <div className="tool-card__link">
            <code className="tool-card__path">/next</code>
            <h2 className="tool-card__name">Your next tool</h2>
            <p className="tool-card__blurb">
              Add an entry to <code>src/toolsRegistry.js</code> and it shows
              up here automatically.
            </p>
          </div>
        </li>
      </ul>
    </main>
  )
}
