import { ComponentProps, ReactNode } from "react";
import MonthPicker from "./datePicker";

type PageHeaderProps = ComponentProps<"div"> & {
  pageName: string;
  description: string;
  monthPicker?: boolean;
  children?: ReactNode;
};

function PageHeader({
  pageName,
  description,
  monthPicker = true,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div {...props}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">{pageName}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          {children}
          {monthPicker && <MonthPicker />}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
