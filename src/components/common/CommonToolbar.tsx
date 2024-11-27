import React from "react";
import { AddDialog } from "../dialog/fundsDialog";
import { Button } from "../ui/button";
import { ArrowDownToLine, SlidersHorizontal } from "lucide-react";
import { CommonToolbarProps } from "../../types/index";
import MonthPicker from "../datePicker";
import { Input } from "../ui/input";
function CommonToolbar({ type, children }: CommonToolbarProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div>
        {children}
        <div>
          <MonthPicker />
        </div>
      </div>
      <div className="flex justify-between ">
        <Input placeholder="Search.." className="w-52 h-9"/>
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
