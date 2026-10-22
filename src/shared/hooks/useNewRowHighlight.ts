import { useEffect, useRef, useState } from "react";

type RowId = string | number;

/**
 * Returns the ids of rows that just appeared in `data` (e.g. after creating a
 * transaction), so they can be briefly highlighted.
 *
 * Rows are only compared while `resetKey` stays the same. Changing the page,
 * filters or type changes the key, which resets the baseline instead of
 * flashing the whole new page.
 */
export default function useNewRowHighlight<T extends { id?: RowId }>(
  data: T[] | undefined,
  isLoading: boolean,
  resetKey: string,
  duration = 1600,
) {
  const [highlighted, setHighlighted] = useState<Set<RowId>>(new Set());
  const baseline = useRef<{ key: string | null; ids: Set<RowId> }>({
    key: null,
    ids: new Set(),
  });

  useEffect(() => {
    // Query data is stale while fetching; wait for the settled result
    if (isLoading || !data) return;

    const ids = new Set<RowId>();
    data.forEach((row) => row.id !== undefined && ids.add(row.id));

    const prev = baseline.current;
    baseline.current = { key: resetKey, ids };

    if (prev.key !== resetKey) return;

    const added = [...ids].filter((id) => !prev.ids.has(id));
    if (!added.length) return;

    setHighlighted(new Set(added));
  }, [data, isLoading, resetKey]);

  // Clear after the flash so a later re-render doesn't replay it
  useEffect(() => {
    if (!highlighted.size) return;
    const timer = setTimeout(() => setHighlighted(new Set()), duration);
    return () => clearTimeout(timer);
  }, [highlighted, duration]);

  return highlighted;
}
