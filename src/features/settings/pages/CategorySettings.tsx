import { useGetCategoryQuery } from "@/shared/api/categoryApi";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { setActiveRow } from "@/shared/slices/activeSlice";
import { CategoryType } from "@/shared/types";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import CategoryCard from "../components/CategoryCard";
import CategoryCardSkeleton from "../components/CategoryCardSkeleton";
import CategoryDialog from "../components/CategoryDialog";

const TABS = ["all", "expense", "income", "transfer"] as const;
type Tab = (typeof TABS)[number];

const CategorySettings = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"Add" | "Edit">("Add");

  const { data, isLoading } = useGetCategoryQuery();

  const filtered = useMemo(() => {
    if (!data) return [];

    return data.filter((category) => {
      const matchesTab = tab === "all" || category.type?.toLowerCase() === tab;
      const matchesSearch = category.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [data, tab, search]);

  const handleAdd = () => {
    dispatch(setActiveRow(null));
    setDialogMode("Add");
    setDialogOpen(true);
  };

  const handleEdit = (category: CategoryType) => {
    dispatch(setActiveRow(category));
    setDialogMode("Edit");
    setDialogOpen(true);
  };

  const handleArchiveToggle = (category: CategoryType) => {
    // TODO: wire to archive/restore mutation once available
    console.log("toggle archive for", category.id);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        id="category_toolbar"
        className="flex flex-row flex-wrap items-center justify-between gap-2"
      >
        <div id="button_list" className="flex flex-row gap-2">
          {TABS.map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              onClick={() => setTab(t)}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="flex flex-row gap-2">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search categories..."
            className="w-[200px]"
          />
          <Button onClick={handleAdd}>Add Category</Button>
        </div>
      </div>

      <div className="flex max-h-[calc(100vh-280px)] flex-col gap-2 overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {search || tab !== "all"
              ? "No categories match your filters."
              : "No categories yet — add one to get started."}
          </p>
        ) : (
          filtered.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onArchiveToggle={handleArchiveToggle}
            />
          ))
        )}
      </div>

      <CategoryDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        mode={dialogMode}
      />
    </div>
  );
};

export default CategorySettings;
