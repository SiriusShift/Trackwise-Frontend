import { ConfirmProvider } from "@/shared/provider/ConfirmProvider";
import { ThemeProvider } from "@/shared/provider/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./routing/router";

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
