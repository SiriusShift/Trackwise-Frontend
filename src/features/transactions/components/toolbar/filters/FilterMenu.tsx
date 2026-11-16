import { Account } from "@/features/accounts/types/account.types";
import { FilterSheet } from "@/shared/components/FilterSheet";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { AssetData, CategoryType } from "@/shared/types";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";
import Assets from "./Assets";
import Categories from "./Categories";
import FilterChip from "./FilterChip";
import {
  AppliedFilter,
  countActiveFilters,
  STATUS_OPTIONS,
  toggleById,
} from "./filterState";
import Status from "./Status";

type Section = "category" | "account" | "status" | "archive";

const SECTIONS: {
  id: Section;
  label: string;
  icon: LucideIcon;
  sheetIcon: keyof typeof Icons;
}[] = [
  { id: "category", label: "Category", icon: Icons.Tags, sheetIcon: "Tags" },
  { id: "account", label: "Account", icon: Icons.Wallet, sheetIcon: "Wallet" },
  {
    id: "status",
    label: "Status",
    icon: Icons.CircleCheck,
    sheetIcon: "CircleCheck",
  },
  {
    id: "archive",
    label: "Archive status",
    icon: Icons.Archive,
    sheetIcon: "Archive",
  },
];

// "Food", "Food +2"
const summarizeNames = (names: string[]) =>
  names.length > 1 ? `${names[0]} +${names.length - 1}` : (names[0] ?? "");

// Current value of a section, or "" when it is not filtering anything
const sectionValue = (section: Section, filter: AppliedFilter) => {
  switch (section) {
    case "category":
      return summarizeNames(filter.selectedCategories.map((c) => c.name));
    case "account":
      return summarizeNames(filter.selectedAssets.map((a) => a.name));
    case "status":
      return filter.status
        ? (STATUS_OPTIONS.find((o) => o.value === filter.status)?.label ?? "")
        : "";
    case "archive":
      return filter.active ? "" : "Archived";
  }
};

// The filter with one section reset to its default
const clearSection = (
  section: Section,
  filter: AppliedFilter,
): AppliedFilter => {
  switch (section) {
    case "category":
      return { ...filter, selectedCategories: [] };
    case "account":
      return { ...filter, selectedAssets: [] };
    case "status":
      return { ...filter, status: "" };
    case "archive":
      return { ...filter, active: true };
  }
};

const clearAll = (filter: AppliedFilter): AppliedFilter => ({
  ...filter,
  selectedCategories: [],
  selectedAssets: [],
  status: "",
  active: true,
});

// Desktop: a Filter button opens a menu of filters; each one opens a side
// drawer with its options, applied with Apply.
const FilterMenu = ({
  applied,
  categories,
  assets,
  onChange,
}: {
  applied: AppliedFilter;
  categories: CategoryType[];
  assets: Account[];
  onChange: (next: AppliedFilter) => void;
}) => {
  const [openSection, setOpenSection] = useState<Section | null>(null);
  // Edited inside the drawer; starts from what is applied
  const [draft, setDraft] = useState<AppliedFilter>(applied);

  const activeCount = countActiveFilters(applied);
  const current = SECTIONS.find((section) => section.id === openSection);

  const openDrawer = (section: Section) => {
    setDraft(applied);
    setOpenSection(section);
  };

  const handleApply = () => {
    onChange({ ...draft, search: applied.search });
    setOpenSection(null);
  };

  const handleClear = () => {
    if (openSection) onChange(clearSection(openSection, applied));
    setOpenSection(null);
  };

  return (
    <>
      {/* modal={false}: lets the drawer take focus as the menu closes */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex shrink-0 items-center gap-2"
            data-tour="filter"
            aria-label={
              activeCount ? `Filters, ${activeCount} active` : "Filters"
            }
          >
            <Icons.Filter />
            Filter
            {activeCount > 0 && (
              <span
                aria-hidden
                className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1 text-[11px] font-bold text-primary"
              >
                {activeCount}
              </span>
            )}
            <Icons.ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SECTIONS.map(({ id, label, icon: SectionIcon }) => {
            const value = sectionValue(id, applied);
            return (
              <DropdownMenuItem
                key={id}
                onSelect={() => openDrawer(id)}
                className="flex items-center gap-2 py-2"
              >
                <SectionIcon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{label}</span>
                <span
                  className={`max-w-28 truncate text-xs ${
                    value ? "font-medium text-primary" : "text-muted-foreground"
                  }`}
                >
                  {value || "Any"}
                </span>
                <Icons.ChevronRight className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuItem>
            );
          })}
          {activeCount > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => onChange(clearAll(applied))}
                className="py-2 text-muted-foreground"
              >
                <Icons.X className="h-4 w-4" />
                Clear all filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <FilterSheet
        side="right"
        title={current?.label ?? "Filter"}
        icon={current?.sheetIcon}
        open={openSection !== null}
        setOpen={(open) => !open && setOpenSection(null)}
        onSubmit={handleApply}
        setClear={handleClear}
        clearLabel="Clear"
      >
        <div className="py-3">
          {openSection === "category" && (
            <Categories
              categories={categories}
              selectedCategories={draft.selectedCategories}
              onChange={(category) =>
                setDraft((prev) => ({
                  ...prev,
                  selectedCategories: toggleById(
                    prev.selectedCategories,
                    category,
                  ),
                }))
              }
            />
          )}

          {openSection === "account" && (
            <Assets
              assets={assets}
              selectedAssets={draft.selectedAssets as AssetData[]}
              onChange={(asset) =>
                setDraft((prev) => ({
                  ...prev,
                  selectedAssets: toggleById(
                    prev.selectedAssets as AssetData[],
                    asset,
                  ),
                }))
              }
            />
          )}

          {openSection === "status" && (
            <Status
              status={draft.status}
              setStatus={(status) => setDraft((prev) => ({ ...prev, status }))}
            />
          )}

          {openSection === "archive" && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">Show</legend>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  selected={draft.active}
                  onToggle={() =>
                    setDraft((prev) => ({ ...prev, active: true }))
                  }
                >
                  Active
                </FilterChip>
                <FilterChip
                  selected={!draft.active}
                  onToggle={() =>
                    setDraft((prev) => ({ ...prev, active: false }))
                  }
                >
                  Archived
                </FilterChip>
              </div>
            </fieldset>
          )}
        </div>
      </FilterSheet>
    </>
  );
};

// Applied filters as removable chips, so they stay visible outside the menu
export const ActiveFilterChips = ({
  applied,
  onChange,
}: {
  applied: AppliedFilter;
  onChange: (next: AppliedFilter) => void;
}) => {
  const active = SECTIONS.map((section) => ({
    ...section,
    value: sectionValue(section.id, applied),
  })).filter((section) => section.value);

  if (!active.length) return null;

  return (
    <div
      role="group"
      aria-label="Applied filters"
      className="flex flex-wrap items-center gap-2"
    >
      {active.map(({ id, label, value }) => (
        <span
          key={id}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 pl-3 pr-1 text-sm text-primary"
        >
          <span className="max-w-56 truncate">
            {id === "archive" ? value : `${label}: ${value}`}
          </span>
          <button
            type="button"
            onClick={() => onChange(clearSection(id, applied))}
            aria-label={`Remove ${label} filter`}
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-primary/15"
          >
            <Icons.X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-muted-foreground"
        onClick={() => onChange(clearAll(applied))}
      >
        Clear all
      </Button>
    </div>
  );
};

export default FilterMenu;
