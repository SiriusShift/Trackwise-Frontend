import { useTheme } from "@/shared/provider/ThemeProvider";
import { useMediaQuery } from "./useMediaQuery";

/**
 * Whether the dark theme is active, resolving "system" against the OS setting.
 * Same resolution as ThemeProvider, which sets the `dark` class on <html>.
 */
export function useIsDark() {
  const { theme } = useTheme();
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  return theme === "dark" || (theme === "system" && systemDark);
}
