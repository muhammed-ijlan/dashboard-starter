import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App";
import "@/i18n/i18n";

const init = () => {
  const appContainer = document.querySelector("#root");
  if (!appContainer) {
    throw new Error("Can not find #root");
  }
  const root = createRoot(appContainer);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

init();
