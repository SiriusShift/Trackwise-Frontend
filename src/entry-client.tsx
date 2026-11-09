import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error('Root element "#root" not found');

if (root.firstElementChild) ReactDOM.hydrateRoot(root, <App />);
else ReactDOM.createRoot(root).render(<App />);
