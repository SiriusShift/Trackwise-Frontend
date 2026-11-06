import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect in the browser, useEffect during prerender (avoids the SSR warning). */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
