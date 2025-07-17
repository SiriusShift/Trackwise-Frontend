import React from "react";
import { AddDialog } from "../../features/transactions/components/dialogs/TransactionDialog";
import { Button } from "../../shared/components/ui/button";
import { ArrowDownToLine, SlidersHorizontal } from "lucide-react";
import { CommonToolbarProps } from "../../shared/types/index";
import MonthPicker from "../../shared/components/datePicker";
import { Input } from "../../shared/components/ui/input";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { FilterSheet } from "../page-components/expense/FilterSheet";

function CommonToolbar({ type, children, active, title }: CommonToolbarProps) {
  const screenWidth = useScreenWidth();

  return (
    <div className="flex sm:flex-col gap-2">
      <div className="flex w-full gap-2 overflow-x-auto items-center justify-start sm:justify-between whitespace-nowrap">
        {screenWidth > 640 ? children : null}
        <div className="flex gap-2 p-1">
          <Input
            placeholder="Search.."
            className="w-auto hidden sm:inline sm:w-52 h-9"
          />
          <AddDialog type={type} active={active} />
          <Button size={"sm"} variant={"outline"}>
            <ArrowDownToLine />
            <span className="inline sm:hidden lg:inline">Export</span>
          </Button>
          <FilterSheet title={title} />
        </div>
      </div>
    </div>
  );
}

export default CommonToolbar;
