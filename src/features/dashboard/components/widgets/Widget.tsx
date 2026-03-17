import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card";
import { formatDateDisplay } from "@/shared/utils/CustomFunctions";
import { commonWidgetProps } from "@/shared/types";

const WidgetLayout = ({ children, title }: commonWidgetProps) => {
  const date = formatDateDisplay();
  const isOverview = title === "Overview";

  return (
    <Card
      className={`
        relative overflow-hidden border border-border/60 bg-card
        p-5 flex flex-col rounded-2xl shadow-sm
        col-span-full
       ${isOverview ? " md:col-span-2" : " md:col-span-1"}
        xl:col-span-1 2xl:col-span-1
        transition-shadow hover:shadow-md
      `}
style={{
  backgroundImage: `
    radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
  `,
}}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <CardHeader className="p-0 flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-foreground">
          {title}
        </CardTitle>
        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/50">
          {date}
        </span>
      </CardHeader>

      {/* <hr className="h-px bg-gradient-to-r from-border via-border/40 to-transparent mt-3 mb-4" /> */}

      <div className="flex-1 min-h-0 mt-4">{children}</div>
    </Card>
  );
};

export default WidgetLayout;
