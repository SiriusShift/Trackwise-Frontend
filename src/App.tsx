import { RouterProvider } from "react-router-dom";
import { router } from "./routing/router";
import { ThemeProvider } from "@/shared/provider/ThemeProvider";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/shared/provider/ConfirmProvider";

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
