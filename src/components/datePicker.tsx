import React, { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  startOfMonth,
  endOfMonth,
  isAfter,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Button } from "./ui/button";
import { CalendarRange } from "lucide-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { active, setActiveMonth } from "@/feature/reducers/active";
import { RootState } from "@/store"; // Replace with your actual root state type
import { IconLeft, IconRight } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "./ui/calendar";

interface MonthPickerProps {
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MonthPicker: React.FC<MonthPickerProps> = () => {
  const dispatch = useDispatch();
  const activeMonth = useSelector(
    (state: RootState) => state.active.activeMonth
  );
  const activeYear = useSelector((state: RootState) => state.active.activeYear);

  const parsedActiveMonth = useMemo(() => moment(activeMonth), [activeMonth]);
  const [currentYear, setCurrentYear] = useState(parsedActiveMonth.year());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const isFuture = (monthIndex: number) =>
    currentYearMonth <
    `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-start">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="font-normal">
            <CalendarRange />
            <span className="hidden sm:inline ml-2">
              {activeMonth
                ? parsedActiveMonth.format("MMMM YYYY")
                : "Select Month"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-[325px] p-4">
          <div className="flex flex-col items-center">
            {/* Year Navigation */}
            <Tabs defaultValue="daily">
              <TabsList className="flex w-full">
                <TabsTrigger className="w-1/3" value="daily">
                  Daily
                </TabsTrigger>
                <TabsTrigger className="w-1/3" value="weekly">
                  Weekly
                </TabsTrigger>
                <TabsTrigger className="w-1/3" value="monthly">
                  Monthly
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) {
                      const dayString = format(date, "yyyy-MM-dd");
                      dispatch(setActiveMonth(dayString));
                      setStartDate(startOfDay(date));
                      setEndDate(endOfDay(date));
                    }
                  }}
                  disabled={(date) => isAfter(date, new Date())}
                />
              </TabsContent>
              <TabsContent value="monthly">
                <div className="px-3">
                  <div className="flex items-center justify-between w-full mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      onClick={() => setCurrentYear((y) => y - 1)}
                    >
                      <IconLeft style={{ width: "8px" }} />
                    </Button>
                    <span className="sm:text-sm font-medium">
                      {moment(activeMonth).format("MMMM")}
                      {currentYear}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      onClick={() => setCurrentYear((y) => y + 1)}
                    >
                      <IconRight style={{ width: "8px" }} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
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
                              ? "bg-foreground text-primary-foreground"
                              : "bg-background hover:bg-accent text-accent-foreground"
                          }`}
                        >
                          {month}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Month Grid */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthPicker;
