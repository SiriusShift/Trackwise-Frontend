import React from "react";
import { AddDialog } from "../dialog/fundsDialog";
import { Button } from "../ui/button";
import { ArrowDownToLine, SlidersHorizontal } from "lucide-react";
import { CommonToolbarProps } from "../../types/index";
import MonthPicker from "../datePicker";
import { Input } from "../ui/input";
import useScreenWidth from "@/hooks/useScreenWidth";
function CommonToolbar({ type, children }: CommonToolbarProps) {
  const screenWidth = useScreenWidth();

  return (
    <div className="flex sm:grid sm:grid-cols-1 overflow-x-auto sm:grid-rows-2 gap-2">
      <div className="flex w-2/6 ">
        <Input placeholder="Search.." className="sm:w-52 h-9" />
      </div>
      <div className="flex overflow-x-auto justify-between">
        {screenWidth > 640 ? children : null}
        <div className="space-x-2">
          {" "}
          <AddDialog type={type} />
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
