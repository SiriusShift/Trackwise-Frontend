import { ConfirmProvider } from "@/shared/provider/ConfirmProvider";
import { ThemeProvider } from "@/shared/provider/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./routing/router";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ConfirmProvider>
        <RouterProvider router={router} />
        <Toaster visibleToasts={1} />
        <Analytics />
      </ConfirmProvider>
    </ThemeProvider>
  );
}

export default App;
