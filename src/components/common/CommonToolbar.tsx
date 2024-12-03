import React from "react";
import { AddDialog } from "../dialog/fundsDialog";
import { Button } from "../ui/button";
import { ArrowDownToLine, SlidersHorizontal } from "lucide-react";
import { CommonToolbarProps } from "../../types/index";
import MonthPicker from "../datePicker";
import { Input } from "../ui/input";
import useScreenWidth from "@/hooks/useScreenWidth";

function CommonToolbar({ type, children, active }: CommonToolbarProps) {
  const screenWidth = useScreenWidth();

  return (
    <div className="flex overflow-x-auto sm:flex-col gap-2 p-1">
      <Input placeholder="Search.." className="w-auto sm:w-52 h-9" />
      <div className="flex gap-2 justify-between whitespace-nowrap">
        {screenWidth > 640 ? children : null}
        <div className="flex space-x-2">
          <AddDialog type={type} active={active} />
          <Button size={"sm"} variant={"outline"}>
            <ArrowDownToLine />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size={"sm"} variant={"outline"}>
            <SlidersHorizontal />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommonToolbar;
