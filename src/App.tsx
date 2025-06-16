import { RouterProvider } from "react-router-dom";
import { router } from "./navigation/router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { ConfirmProvider } from "./context/ConfirmContext";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ConfirmProvider>
        <RouterProvider router={router} />
        <Toaster visibleToasts={1} />
      </ConfirmProvider>
    </ThemeProvider>
  );
}

export default App;
