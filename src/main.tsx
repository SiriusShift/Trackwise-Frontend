import { StrictMode } from "react";
import { CookiesProvider } from "react-cookie";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./app/store.js";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </CookiesProvider>
  </StrictMode>,
);
