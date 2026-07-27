import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./App.css";
import App from "./App.jsx";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

// Easter egg for fellow devs poking around the console
console.log(
  "%cvh:~$%c you found the dev channel.\n" +
    "❯ hiring? vladyslav.horbatenko.work@gmail.com\n" +
    "❯ psst — try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A",
  "color:#F59E0B;font-family:monospace;font-weight:bold;font-size:14px",
  "color:inherit;font-family:monospace"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
