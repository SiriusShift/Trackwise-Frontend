import { forwardRef, type ReactNode } from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import type { TransactionRow } from "@/shared/types";

interface VirtualizedInfiniteListProps {
  items?: TransactionRow[];
  dataLength?: number;
  renderRow: (item: TransactionRow, index: number) => ReactNode;
  itemSize: number;
  height: number;
  isFetching?: boolean;
}

const VirtualizedInfiniteList = forwardRef<
  HTMLDivElement,
  VirtualizedInfiniteListProps
>(function VirtualizedInfiniteList(
  { items = [], dataLength, renderRow, itemSize, height, isFetching },
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

  return (
    <FixedSizeList
      height={height}
      itemCount={length}
      itemSize={itemSize}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
});

export default VirtualizedInfiniteList;