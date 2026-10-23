import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import {
  FixedSizeList,
  type ListChildComponentProps,
  type ListOnItemsRenderedProps,
} from "react-window";
import type { TransactionRow } from "@/shared/types";

interface VirtualizedInfiniteListProps {
  items?: TransactionRow[];
  dataLength?: number;
  renderRow: (item: TransactionRow, index: number) => ReactNode;
  itemSize: number;
  height: number;
  isFetching?: boolean;
  onLoadMore?: () => void;
}

interface RowData {
  items: TransactionRow[];
  dataLength?: number;
  renderRow: (item: TransactionRow, index: number) => ReactNode;
  isFetching?: boolean;
  lastRef: ForwardedRef<HTMLDivElement>;
}

// Defined outside the list so rows keep their DOM nodes between renders;
// otherwise every render remounts them and the `top` transition can't run.
const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
  const { items, dataLength, renderRow, isFetching, lastRef } = data;

  // If we're at the "loading row"
  if (index === items.length && index !== dataLength) {
    return (
      <div className="p-2 px-4" style={style}>
        {isFetching ? <p>Loading more...</p> : null}
      </div>
    );
  }

  const item = items[index];
  const isLast = index === items.length - 1;

  return (
    <div
      style={style}
      ref={isLast ? lastRef : null}
      // Rows below a removed item glide up into its place
      className="transition-[top] duration-300 ease-out motion-reduce:transition-none"
    >
      {renderRow(item, index)}
    </div>
  );
};

const VirtualizedInfiniteList = forwardRef<
  HTMLDivElement,
  VirtualizedInfiniteListProps
>(function VirtualizedInfiniteList(
  { items = [], dataLength, renderRow, itemSize, height, isFetching, onLoadMore },
  ref
) {
  const length = isFetching ? items.length + 1 : items.length

  // Ask for the next page once the last real item is rendered
  const handleItemsRendered = ({ visibleStopIndex }: ListOnItemsRenderedProps) => {
    if (items.length > 0 && visibleStopIndex >= items.length - 1) {
      onLoadMore?.();
    }
  };

  return (
    <FixedSizeList
      height={height}
      itemCount={length}
      itemSize={itemSize}
      width="100%"
      className="transition-[height] duration-300 ease-out motion-reduce:transition-none"
      itemData={{ items, dataLength, renderRow, isFetching, lastRef: ref }}
      // Key by id so a row keeps its node when items above it are removed
      itemKey={(index, data) => data.items[index]?.id ?? "loading-row"}
      onItemsRendered={handleItemsRendered}
    >
      {Row}
    </FixedSizeList>
  );
});

export default VirtualizedInfiniteList;
