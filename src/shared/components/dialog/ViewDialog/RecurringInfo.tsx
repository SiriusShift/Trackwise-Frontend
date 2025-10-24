import { CapitalCase } from "@/shared/utils/CustomFunctions";
import {
  Calendar1,
  CalendarClock,
  CalendarCog,
  FileText,
  Landmark,
  Repeat,
} from "lucide-react";
import React from "react";
const RecurringInfo = ({ details }) => {
  const unit = CapitalCase(details?.unit)
  console.log(unit)
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex items-center gap-3">
        <CalendarCog className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Unit</p>
          <p className="font-medium break-words">{unit}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Calendar1 className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Interval</p>
          <p className="font-medium break-words">{details?.interval}</p>
        </div>
      </div>  
      <div className="flex items-center gap-3">
        <CalendarClock className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">End Date</p>
          <p className="font-medium break-words">
            {details?.endDate || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Landmark className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Asset</p>
          <p className="font-medium break-words">
            {details.fromAsset?.name || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecurringInfo;
