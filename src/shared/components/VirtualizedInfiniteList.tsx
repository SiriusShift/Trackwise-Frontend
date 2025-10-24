import React, { forwardRef } from "react";
import { FixedSizeList } from "react-window";

const VirtualizedInfiniteList = forwardRef(function VirtualizedInfiniteList(
  { items = [], onSelect, renderRow, itemSize, height, isFetching },
  ref
) {
  const length = isFetching ? items.length + 1 : items.length

  const Row = ({ index, style }) => {
    // If we're at the "loading row"
    if (index === items.length) {
      return (
        <div style={style}>
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
