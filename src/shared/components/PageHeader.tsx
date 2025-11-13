import React from "react";
import MonthPicker from "./datePicker";

function PageHeader({pageName, description}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-semibold">{pageName}</p>
          <p className="text-gray-400 text-sm">
            {description}
          </p>
        </div>
        <MonthPicker />
      </div>
    </div>
  );
}

export default PageHeader;
