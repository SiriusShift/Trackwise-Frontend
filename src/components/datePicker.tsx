import React, { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "./ui/button";
import { CalendarRange } from "lucide-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMonth } from "@/feature/reducers/active";
import { RootState } from "@/store"; // Replace with your actual root state type

interface MonthPickerProps {
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MonthPicker: React.FC<MonthPickerProps> = ({ setStartDate, setEndDate }) => {
  const dispatch = useDispatch();
  const activeMonth = useSelector((state: RootState) => state.active.activeMonth);

  const parsedActiveMonth = useMemo(() => moment(activeMonth), [activeMonth]);
  const [currentYear, setCurrentYear] = useState(parsedActiveMonth.year());

  const currentYearMonth = useMemo(() => moment().format("YYYY-MM"), []);

  useEffect(() => {
    setCurrentYear(parsedActiveMonth.year());
  }, [parsedActiveMonth]);

  const handleMonthChange = (monthIndex: number) => {
    const newDate = moment({ year: currentYear, month: monthIndex, day: 2 });
    const isoString = newDate.toISOString();

    dispatch(setActiveMonth(isoString));
    setStartDate(startOfMonth(newDate.toDate()));
    setEndDate(endOfMonth(newDate.toDate()));
  };

  const isFuture = (monthIndex: number) =>
    currentYearMonth < `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-start">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="font-normal">
            <CalendarRange />
            <span className="hidden sm:inline ml-2">
              {activeMonth ? parsedActiveMonth.format("MMMM YYYY") : "Select Month"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-auto p-4">
          <div className="flex flex-col items-center">
            {/* Year Navigation */}
            <div className="flex items-center justify-between w-full mb-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentYear(y => y - 1)}>
                Prev
              </Button>
              <span className="sm:text-lg font-semibold">{currentYear}</span>
              <Button variant="ghost" size="sm" onClick={() => setCurrentYear(y => y + 1)}>
                Next
              </Button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-3">
              {months.map((month, index) => {
                const selected =
                  parsedActiveMonth.year() === currentYear &&
                  parsedActiveMonth.month() === index;
                const future = isFuture(index);

                return (
                  <Button
                    key={month}
                    onClick={() => !future && handleMonthChange(index)}
                    disabled={future}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-md ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-accent text-accent-foreground"
                    }`}
                  >
                    {month}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthPicker;