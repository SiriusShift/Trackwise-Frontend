import { ConfirmProvider } from "@/shared/provider/ConfirmProvider";
import { ThemeProvider } from "@/shared/provider/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <ConfirmProvider>
            {children}
            <Toaster visibleToasts={1} />
            <Analytics />
          </ConfirmProvider>
        </ThemeProvider>
      </Provider>
    </CookiesProvider>
  );
}
