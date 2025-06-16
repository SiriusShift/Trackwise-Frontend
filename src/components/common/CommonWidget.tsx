import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import moment from "moment";
import { useSelector } from "react-redux";
import { commonWidgetProps } from "@/types";
import { formatDateDisplay } from "@/utils/CustomFunctions";

const CommonWidget = ({children, title}: commonWidgetProps) => {
  const activeMonth = useSelector((state: any) => state.active.activeMonth);

  return (
    <Card className={`border p-5 flex flex-col rounded-lg col-span-full ${title === "Calendar" ? "md:col-span-full" : "md:col-span-2"} xl:col-span-1 h-60 `}>
      <CardHeader className="flex p-0 flex-row justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        {/* <CardDescription className="text-sm text-gray-400">
          {formatDateDisplay()}
        </CardDescription> */}
      </CardHeader>
      <hr className="my-2 mb-4" />
      {children}
    </Card>
  );
};

export default CommonWidget;
