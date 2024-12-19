import { RouterProvider } from "react-router-dom";
import { router } from "./navigation/router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster visibleToasts={1} />
    </ThemeProvider>
  );
}

export default App;