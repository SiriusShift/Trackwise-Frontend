import type { filterProps } from "@/shared/types";

export type AppliedFilter = Required<filterProps>;

export const EMPTY_FILTER: AppliedFilter = {
  search: "",
  status: "",
  selectedCategories: [],
  selectedAssets: [],
  active: true,
};

// Status values the API expects, with the labels the user sees
export const STATUS_OPTIONS = [
  { value: "", label: "Any" },
  { value: "Paid", label: "Completed" },
  { value: "Overdue", label: "Skipped" },
];

// Toggle an item in a list by id
export const toggleById = <T extends { id: number }>(list: T[], item: T): T[] =>
  list.some((selected) => selected.id === item.id)
    ? list.filter((selected) => selected.id !== item.id)
    : [...list, item];

// One per filter group in use (search is shown in its own field)
export const countActiveFilters = (filter: AppliedFilter) =>
  (filter.selectedCategories.length ? 1 : 0) +
  (filter.selectedAssets.length ? 1 : 0) +
  (filter.status ? 1 : 0) +
  (filter.active ? 0 : 1);
