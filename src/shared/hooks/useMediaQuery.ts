import { useCallback, useSyncExternalStore } from "react";

/** Tracks whether a CSS media query matches, updating when it changes. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  // No window during prerender: assume no match, the client corrects it after hydration.
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
