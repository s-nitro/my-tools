import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { tools } from './toolsRegistry.js'

function ToolFrame({ children, name }) {
  return (
    <div className="tool-frame">
      <header className="tool-frame__bar">
        <Link to="/" className="tool-frame__back">
          &larr; all tools
        </Link>
        <span className="tool-frame__name">{name}</span>
      </header>
      <div className="tool-frame__body">{children}</div>
    </div>
  )
}

function RouteLabel() {
  const { pathname } = useLocation()
  return <code className="route-chip">/my-tools{pathname}</code>
}

export default function App() {
  return (
    <div className="shell">
      <Routes>
        <Route path="/" element={<Home />} />
        {tools.map(({ path, name, component: Tool }) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <ToolFrame name={name}>
                <Tool />
              </ToolFrame>
            }
          />
        ))}
        <Route
          path="*"
          element={
            <div className="not-found">
              <p className="not-found__eyebrow">404</p>
              <h1>No tool lives at this address.</h1>
              <Link to="/" className="button">
                Back to the workbench
              </Link>
            </div>
          }
        />
      </Routes>
      <div className="route-chip-dock">
        <RouteLabel />
      </div>
    </div>
  )
}
