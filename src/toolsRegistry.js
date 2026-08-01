import SessionTime from "./pages/tools/SessionTime";

// To add a new tool:
// 1. Create src/pages/tools/YourTool.jsx (default export a component)
// 2. Import it above
// 3. Add an entry below — `path` becomes /my-tools/<path>
export const tools = [
  {
    path: "session-time",
    name: "Session Time",
    component: SessionTime,
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
  },
];
