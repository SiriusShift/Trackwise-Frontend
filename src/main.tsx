import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import "./index.css";
import { CookiesProvider } from "react-cookie";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider>
    <Provider store={store}>
      <App />
    </Provider>
    </CookiesProvider>
  </StrictMode>
);
