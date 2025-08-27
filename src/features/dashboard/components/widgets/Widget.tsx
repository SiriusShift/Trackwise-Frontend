import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../../shared/components/ui/card";
import moment from "moment";
import { useSelector } from "react-redux";
import { commonWidgetProps } from "@/shared/types";
import { formatDateDisplay } from "@/shared/utils/CustomFunctions";
import { IRootState } from "@/app/store";
import { Separator } from "@/shared/components/ui/separator";

const WidgetLayout = ({children, title}: commonWidgetProps) => {
  // const activeMonth = useSelector((state: IRootState) => state.active.active);

  return (
    <Card className={`border p-5 flex flex-col rounded-lg col-span-full ${title === "Calendar" ? "md:col-span-full" : "md:col-span-2"} xl:col-span-1 h-60 `}>
      <CardHeader className="flex p-0 flex-row justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        {/* <CardDescription className="text-sm text-gray-400">
          {formatDateDisplay()}
        </CardDescription> */}
      </CardHeader>
      <Separator className="my-2 mb-4 border-white"/>
      {children}
    </Card>
  );
};

export default WidgetLayout;
