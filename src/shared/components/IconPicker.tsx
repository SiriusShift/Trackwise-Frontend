import { icons, Search } from "lucide-react";
import { useMemo, useState } from "react";

import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type IconPickerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value?: string;
  onChange: (icon: string) => void;
};

const iconNames = Object.keys(icons).sort((a, b) => a.localeCompare(b));

// Icon set is ~1500 entries — cap what we render until the user narrows
// the search, otherwise every open mounts 1500 SVGs at once.
const MAX_VISIBLE = 120;

const IconPicker = ({ open, setOpen, value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");

  const filteredNames = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = query
      ? iconNames.filter((name) => name.toLowerCase().includes(query))
      : iconNames;
    return matches.slice(0, MAX_VISIBLE);
  }, [search]);

  const totalMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? iconNames.filter((name) => name.toLowerCase().includes(query)).length
      : iconNames.length;
  }, [search]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  };

  return (
    <CommonDialog
      open={open}
      setOpen={handleOpenChange}
      title="Choose Icon"
      icon={Search}
    >
      <div className="space-y-4 p-4">
        <Input
          placeholder="Search icon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <ScrollArea className="h-[420px] rounded-md border">
          {filteredNames.length === 0 ? (
            <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
              No icons match "{search}"
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 p-3">
              {filteredNames.map((name) => {
                const Icon = icons[name as keyof typeof icons];
                const isSelected = name === value;
                return (
                  <Button
                    key={name}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    title={name}
                    aria-label={`Select ${name} icon`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex h-auto flex-col items-center gap-1 ",
                      isSelected && "ring-2 ring-primary ring-offset-2",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {/* <span className="w-full truncate text-center text-xs">
                      {name}
                    </span> */}
                  </Button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {totalMatches > MAX_VISIBLE && (
          <p className="text-center text-xs text-muted-foreground">
            Showing {MAX_VISIBLE} of {totalMatches} results — keep typing to
            narrow it down
          </p>
        )}
      </div>
    </CommonDialog>
  );
};

export default IconPicker;