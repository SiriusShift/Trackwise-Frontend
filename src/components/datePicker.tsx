import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "./ui/button";
import { CalendarRange } from "lucide-react";

const MonthPicker = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    startOfMonth(new Date())
  ); // Default to current month
  const [monthRange, setMonthRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const currentMonthIndex = new Date().getMonth(); // Current month (0-11)

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

  const handleMonthChange = (monthIndex: number) => {
    const date = new Date(currentYear, monthIndex, 1);
    setSelectedMonth(date);

    // Calculate start and end of the month
    const start = format(startOfMonth(date), "yyyy-MMMM-dd");
    const end = format(endOfMonth(date), "yyyy-MMMM-dd");

    setMonthRange({ start, end });
  };

  const handlePreviousYear = () => setCurrentYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setCurrentYear((prevYear) => prevYear + 1);

  return (
    <div className="flex flex-col items-start">
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"sm"} variant={"outline"} className="font-normal">
            <CalendarRange />
            <span className="hidden sm:inline">{selectedMonth
              ? format(selectedMonth, "MMMM yyyy")
              : "Select Month"}</span>

          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-auto p-4">
          <div className="flex flex-col items-center">
            {/* Year Navigation */}
            <div className="flex items-center justify-between w-full mb-4">
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={handlePreviousYear}
              >
                Prev
              </Button>
              <span className="sm:text-lg font-semibold">{currentYear}</span>
              <Button variant={"ghost"} onClick={handleNextYear}>
                Next
              </Button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-3">
              {months.map((month, index) => {
                const isCurrentMonth =
                  currentYear === new Date().getFullYear() &&
                  index === currentMonthIndex;

                console.log(isCurrentMonth);

                return (
                  <Button
                    key={month}
                    onClick={() => handleMonthChange(index)}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-md ${
                      selectedMonth &&
                      selectedMonth.getFullYear() === currentYear &&
                      selectedMonth.getMonth() === index
                        ? "bg-primary text-primary-foreground" // Highlight selected month
                        : "bg-secondary hover:bg-accent-foreground text-accent-foreground hover:text-accent"
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
