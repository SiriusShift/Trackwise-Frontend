import { cn } from "@/lib/utils";
import { getLucideIcon } from "@/shared/utils/icons";

const sizes = {
  sm: { box: "w-7 h-7 rounded-md", icon: 14 },
  md: { box: "w-9 h-9 rounded-lg", icon: 16 },
  lg: { box: "w-11 h-11 rounded-xl", icon: 20 },
};

interface IconBadgeProps {
  // lucide-react icon name, as stored on categories/savings
  icon?: string | null;
  size?: keyof typeof sizes;
  className?: string;
  iconClassName?: string;
}

// Renders a lucide icon (resolved by name) inside a muted square badge.
// Returns null when no icon name is provided.
export function IconBadge({
  icon,
  size = "md",
  className,
  iconClassName,
}: IconBadgeProps) {
  if (!icon) return null;
  const Icon = getLucideIcon(icon);
  const { box, icon: iconSize } = sizes[size];
  return (
    <div
      className={cn(
        "shrink-0 flex justify-center items-center bg-muted border border-border/60",
        box,
        className,
      )}
    >
      <Icon
        className={cn("text-muted-foreground", iconClassName)}
        width={iconSize}
        height={iconSize}
      />
    </div>
  );
}
