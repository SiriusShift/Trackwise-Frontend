import React, { SetStateAction } from "react";
import { useDispatch } from "react-redux";

function CommonTab({
  activeTab,
  setTab,
}: {
  activeTab: string;
  setTab: SetStateAction<string>;
}) {
  const dispatch = useDispatch();

  return (
    <div className="relative flex gap-1 h-full bg-secondary rounded-sm items-center overflow-hidden">
      <div
        className={`absolute top-0 left-0 h-full w-1/2 bg-background rounded-sm transition-all duration-300`}
        style={{
          transform: activeTab === "All" ? "translateX(0)" : "translateX(100%)",
        }}
      ></div>
      <div
        onClick={() =>
          dispatch(
            setTab({
              expenseTab: "All",
            })
          )
        }
        className={`relative z-10 flex items-center justify-center text-sm w-1/2 cursor-pointer ${
          activeTab === "All" ? "text-primary" : "text-gray-500"
        }`}
      >
        All
      </div>
      <div
        onClick={() =>
          dispatch(
            setTab({
              expenseTab: "Recurring",
            })
          )
        }
        className={`relative z-10 flex items-center justify-center text-sm w-1/2 cursor-pointer ${
          activeTab === "Recurring" ? "text-primary" : "text-gray-500"
        }`}
      >
        Recurring
      </div>
    </div>
  );
}

export default CommonTab;
