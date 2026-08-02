import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { tools } from "./toolsRegistry.js";

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
  );
}

export default function App() {
  return (
    <div className="shell">
      <Routes>
        <Route path="/" element={<Home />} />
        {tools.map(({ path, routePath, name, component: Tool }) => (
          <Route
            key={path}
            path={`/${routePath || path}`}
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
    </div>
  );
}
