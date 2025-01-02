import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "./ui/button";
import { CalendarRange } from "lucide-react";
import moment from "moment";

const MonthPicker = ({ setStartDate, setEndDate }: any) => {
  const [storedActiveMonth, setStoredActiveMonth] = useState(localStorage.getItem("activeMonth"));

  // Parse the stored month or default to the current date
  const activeMonth = storedActiveMonth
    ? new Date(JSON.parse(storedActiveMonth))
    : moment().endOf("month").toDate();
  

    console.log(activeMonth);

  if (!storedActiveMonth) {
    localStorage.setItem("activeMonth", JSON.stringify(new Date()));
  }

  const [currentYear, setCurrentYear] = useState(activeMonth.getFullYear());

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
    const date = new Date(currentYear, monthIndex, 2);
    localStorage.setItem("activeMonth", JSON.stringify(date));
    setStoredActiveMonth(JSON.stringify(date));

    setStartDate(startOfMonth(date));
    setEndDate(endOfMonth(date));
  };

  const handlePreviousYear = () => setCurrentYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setCurrentYear((prevYear) => prevYear + 1);

  return (
    <div className="flex flex-col items-start">
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"sm"} variant={"outline"} className="font-normal">
            <CalendarRange />
            <span className="hidden sm:inline">
              {activeMonth ? format(activeMonth, "MMMM yyyy") : "Select Month"}
            </span>
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
                return (
                  <Button
                    key={month}
                    onClick={() => handleMonthChange(index)}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-md ${
                      activeMonth.getFullYear() === currentYear &&
                      activeMonth.getMonth() === index
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
