import { cn } from "@/lib/utils";

interface ScreenshotPlaceholderProps {
  label: string;
  hint: string;
  className?: string;
}

// Stand-in frame until real app captures are available
const ScreenshotPlaceholder = ({ label, hint, className }: ScreenshotPlaceholderProps) => (
  <div
    className={cn(
      "flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-card/60 p-6 text-center shadow-2xl shadow-primary/5",
      className,
    )}
  >
    <p className="font-medium text-foreground">[{label}]</p>
    <p className="text-xs text-muted-foreground">{hint}</p>
  </div>
);

export default ScreenshotPlaceholder;
