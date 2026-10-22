import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useTheme } from "@/shared/provider/ThemeProvider";

const DEFAULT_ACCENT = "#3b82f6";

const PRESETS = [
  { name: "Blue", color: DEFAULT_ACCENT },
  { name: "Violet", color: "#8b5cf6" },
  { name: "Rose", color: "#e11d48" },
  { name: "Orange", color: "#ea580c" },
  { name: "Emerald", color: "#059669" },
  { name: "Teal", color: "#0d9488" },
];

const PALETTES = [
  {
    id: null,
    name: "Default",
    description: "Trackwise blue",
    color: "hsl(217 91% 60%)",
  },
  {
    id: "claude",
    name: "Claude",
    description: "Warm cream and terracotta",
    color: "hsl(15 56% 52%)",
    background: "hsl(48 33% 97%)",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Cool sky blue and fresh green",
    color: "hsl(142 71% 45%)",
    background: "hsl(208 100% 97%)",
  },
  {
    id: "sage-green",
    name: "Sage Green",
    description: "Soft, muted sage on clean white",
    color: "hsl(96 16% 70%)",
    background: "hsl(0 0% 99%)",
  },
];

const ThemeSettings = () => {
  const { accent, setAccent, palette, setPalette } = useTheme();
  const current = accent ?? DEFAULT_ACCENT;
  const isPreset =
    !accent ||
    PRESETS.some(
      (preset) => preset.color.toLowerCase() === current.toLowerCase(),
    );

  console.log(accent, palette);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <span className="block text-lg font-semibold">Color Palette</span>
        <Separator />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h2 className="font-medium">Theme</h2>
          <p className="text-sm text-muted-foreground">
            Choose a complete theme. This replaces any custom accent color.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {PALETTES.map((item) => {
            const selected = !accent && (palette ?? null) === item.id;
            return (
              <button
                key={item.name}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setAccent(null);
                  setPalette(item.id);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-muted",
                  selected && "border-primary ring-1 ring-primary",
                )}
              >
                <span
                  className="size-8 rounded-full border"
                  style={{
                    background: item.color,
                    boxShadow: item.background
                      ? `inset 0 0 0 3px ${item.background}`
                      : undefined,
                  }}
                />
                <span>
                  <span className="block text-sm font-medium">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" size="sm">
          Preview button
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!accent && !palette}
          onClick={() => {
            setAccent(null);
            setPalette(null);
          }}
        >
          Reset to default
        </Button>
      </div>
    </div>
  );
};

export default ThemeSettings;
