import SessionTime from "./pages/tools/SessionTime.jsx";
import WhatsAppRedirector from "./pages/tools/WhatsAppRedirector.jsx";
import ShoppingList from "./pages/tools/ShoppingList.jsx";

export const tools = [
  {
    path: "session-time",
    name: "Session Time",
    component: SessionTime,
    background: "linear-gradient(135deg, #22c5ba, #109790)",
  },
  {
    path: "shopping-list",
    routePath: "shopping-list/*",
    name: "Shopping List",
    component: ShoppingList,
    background: "linear-gradient(135deg, #fb8f39, #d58b1c)",
  },
  {
    path: "whatsapp-redirector",
    name: "WhatsApp Redirector",
    component: WhatsAppRedirector,
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
  },
];
