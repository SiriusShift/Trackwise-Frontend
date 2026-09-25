import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Resolves a lucide-react icon component by name (as stored on categories),
// returning `fallback` when the name is missing or not a lucide icon.
export const getLucideIcon = (
  name?: string | null,
  fallback: LucideIcon = Icons.CircleHelp,
): LucideIcon => {
  if (!name) return fallback;
  const icon = (Icons as unknown as Record<string, unknown>)[name];
  return typeof icon === "object" && icon !== null && "render" in icon
    ? (icon as unknown as LucideIcon)
    : fallback;
};
