import { CategoryType } from "@/shared/types";
import { getLucideIcon } from "@/shared/utils/icons";
import FilterChip from "./FilterChip";

const Categories = ({
  selectedCategories,
  categories,
  onChange,
}: {
  selectedCategories: CategoryType[];
  categories: CategoryType[];
  onChange: (category: CategoryType) => void;
}) => {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-semibold">
        Category
        {selectedCategories.length > 0 && (
          <span className="text-xs font-normal text-muted-foreground">
            {selectedCategories.length} selected
          </span>
        )}
      </legend>

      {categories.length ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const CategoryIcon = getLucideIcon(category.icon);
            return (
              <FilterChip
                key={category.id}
                selected={selectedCategories.some(
                  (selected) => selected.id === category.id,
                )}
                onToggle={() => onChange(category)}
                icon={<CategoryIcon className="h-3.5 w-3.5 shrink-0" />}
              >
                {category.name}
              </FilterChip>
            );
          })}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No categories yet</span>
      )}
    </fieldset>
  );
};

export default Categories;
