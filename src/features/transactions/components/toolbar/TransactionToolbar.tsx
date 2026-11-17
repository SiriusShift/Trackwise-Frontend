import { IRootState } from "@/app/store";
import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import { useGetCategoryQuery } from "@/shared/api/categoryApi";
import { FilterSheet } from "@/shared/components/FilterSheet";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { AssetData, CategoryType } from "@/shared/types";
import { Download, Filter, MoreHorizontal, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReportDialog from "../dialogs/ReportDialog";
import Assets from "./filters/Assets";
import Categories from "./filters/Categories";
import FilterMenu, { ActiveFilterChips } from "./filters/FilterMenu";
import {
  AppliedFilter,
  countActiveFilters,
  EMPTY_FILTER,
  toggleById,
} from "./filters/filterState";
import Status from "./filters/Status";
import TypeSelect from "./TypeSelect";

const SEARCH_DEBOUNCE_MS = 350;
const DESKTOP_MIN_WIDTH = 768; // Tailwind `md`
const COMPACT_MAX_WIDTH = 640; // under Tailwind `sm`: the phone layout

const TransactionToolbar = ({
  onSubmit,
  onClear,
}: {
  onSubmit: (filter: AppliedFilter) => void;
  onClear: () => void;
}) => {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= DESKTOP_MIN_WIDTH;
  const isCompact = screenWidth < COMPACT_MAX_WIDTH;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // What the list is currently filtered by
  const [applied, setApplied] = useState<AppliedFilter>(EMPTY_FILTER);

  // Search applies as you type (debounced)
  const [searchInput, setSearchInput] = useState("");

  // Draft values edited inside the mobile sheet (applied on Apply)
  const [status, setStatus] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    [],
  );
  const [selectedAssets, setSelectedAssets] = useState<AssetData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("active");

  const type = useSelector((state: IRootState) => state.active.type);

  const { data: assets } = useGetAccountsQuery();
  const { data: categoryData } = useGetCategoryQuery({
    type,
  });

  const applyFilter = (next: AppliedFilter) => {
    setApplied(next);
    onSubmit(next);
  };

  useEffect(() => {
    const term = searchInput.trim();
    if (term === applied.search) return;
    const timer = setTimeout(
      () => applyFilter({ ...applied, search: term }),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, applied]);

  // The sheet only exists on mobile; close it if the window grows past it
  useEffect(() => {
    if (isDesktop) setFilterOpen(false);
  }, [isDesktop]);

  // Opening the sheet starts from what is applied, so unapplied picks are dropped
  const openFilter = () => {
    setStatus(applied.status);
    setSelectedCategories(applied.selectedCategories);
    setSelectedAssets(applied.selectedAssets as AssetData[]);
    setActiveTab(applied.active ? "active" : "archived");
    setFilterOpen(true);
  };

  const handleApply = () => {
    applyFilter({
      search: applied.search,
      status,
      selectedCategories,
      selectedAssets,
      active: activeTab === "active",
    });
    setFilterOpen(false);
  };

  const clearFilter = () => {
    setSearchInput("");
    setSelectedCategories([]);
    setSelectedAssets([]);
    setStatus("");
    setActiveTab("active");
    setApplied(EMPTY_FILTER);
    onClear();
    setFilterOpen(false);
  };

  const activeFilterCount = countActiveFilters(applied);

  return (
    <>
      {/*
        Layout follows the toolbar's own width (container queries), not the
        viewport, so the app sidebar can't squeeze it:
        - under 768px: [type ........ export add] / [search ...... filter]
        - 768px+:      [type  search ...  filter  export  add]
        - 896px+:      Export / Add show their text labels
      */}
      <div className="@container flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 p-1">
          <div className="order-1 flex-1 sm:shrink-0">
            <TypeSelect fullWidth={isCompact} />
          </div>

          {/* Export / Add */}
          {isCompact ? (
            // Phones: Export lives in a menu, Add is the floating button below
            <div className="order-2 shrink-0">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11"
                    aria-label="More actions"
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => setReportOpen(true)}
                    data-tour="export"
                    className="gap-2 py-2.5"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="order-2 ml-auto flex shrink-0 gap-2 @3xl:order-3 @3xl:ml-0">
              <Button
                variant="outline"
                size="icon"
                className="@4xl:w-auto @4xl:px-4"
                onClick={() => setReportOpen(true)}
                data-tour="export"
                aria-label="Export"
              >
                <Download />
                <span className="hidden @4xl:inline">Export</span>
              </Button>
              {/* <Button
                size="icon"
                className="@4xl:w-auto @4xl:px-4"
                onClick={() => setDialogOpen(true)}
                data-tour="add"
                aria-label="Add transaction"
              >
                <Plus />
                <span className="hidden @4xl:inline">Add</span>
              </Button> */}
            </div>
          )}

          {/* Search + filter: own full-width row when narrow */}
          <div className="order-3 flex w-full min-w-0 items-center gap-2 @3xl:order-2 @3xl:w-auto @3xl:flex-1 @3xl:justify-end">
            <div className="relative min-w-0 flex-1 @3xl:max-w-sm">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search transactions"
                aria-label="Search transactions"
                className="pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
                data-tour="search"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {isDesktop ? (
              <FilterMenu
                applied={applied}
                categories={categoryData ?? []}
                assets={assets?.data ?? []}
                onChange={applyFilter}
              />
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10 shrink-0"
                onClick={openFilter}
                data-tour="filter"
                aria-label={
                  activeFilterCount
                    ? `Filters, ${activeFilterCount} active`
                    : "Filters"
                }
              >
                <Filter />
                {activeFilterCount > 0 && (
                  <span
                    aria-hidden
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                  >
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Desktop: applied filters stay visible and removable */}
        {isDesktop && (
          <div className="px-1 empty:hidden">
            <ActiveFilterChips applied={applied} onChange={applyFilter} />
          </div>
        )}
      </div>

      {/* Mobile: bottom sheet, applied with Apply */}
      {!isDesktop && (
        <FilterSheet
          setClear={clearFilter}
          setOpen={setFilterOpen}
          onSubmit={handleApply}
          title="Filter"
          icon={"Filter"}
          open={filterOpen}
        >
          <div className="flex flex-col gap-6 py-3">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">Show</legend>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
              </Tabs>
            </fieldset>

            <Categories
              categories={categoryData ?? []}
              selectedCategories={selectedCategories}
              onChange={(category) =>
                setSelectedCategories((prev) => toggleById(prev, category))
              }
            />

            <Assets
              selectedAssets={selectedAssets}
              assets={assets?.data ?? []}
              onChange={(asset) =>
                setSelectedAssets((prev) => toggleById(prev, asset))
              }
            />

            <Status status={status} setStatus={setStatus} />
          </div>
        </FilterSheet>
      )}

      {/* Phones: Add floats within thumb reach */}
      {/* {isCompact && (
        <Button
          size="icon"
          onClick={() => setDialogOpen(true)}
          data-tour="add"
          aria-label="Add transaction"
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-40 h-14 w-14 rounded-2xl shadow-lg [&_svg]:size-6"
        >
          <Plus />
        </Button>
      )} */}

      {/* <TransactionDialog open={dialogOpen} setOpen={setDialogOpen} mode="add" /> */}
      <ReportDialog setOpen={setReportOpen} open={reportOpen} />
    </>
  );
};

export default TransactionToolbar;
