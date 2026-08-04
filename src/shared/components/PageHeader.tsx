import MonthPicker from "./datePicker";

function PageHeader({
  pageName,
  description,
  monthPicker,
  children,
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">{pageName}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          {monthPicker && <MonthPicker />}
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
