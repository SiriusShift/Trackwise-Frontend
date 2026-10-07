import { forwardRef, type ReactNode } from "react";
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

const VirtualizedInfiniteList = forwardRef<
  HTMLDivElement,
  VirtualizedInfiniteListProps
>(function VirtualizedInfiniteList(
  { items = [], dataLength, renderRow, itemSize, height, isFetching, onLoadMore },
  ref
) {
  const length = isFetching ? items.length + 1 : items.length

  const Row = ({ index, style }: ListChildComponentProps) => {
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
      <div style={style} ref={isLast ? ref : null}>
        {renderRow(item, index)}
      </div>
    );
  };

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
      onItemsRendered={handleItemsRendered}
    >
      {Row}
    </FixedSizeList>
  );
});

export default VirtualizedInfiniteList;
