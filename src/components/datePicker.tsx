import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfWeek, formatDate, isAfter, startOfWeek } from "date-fns";
import { Button } from "./ui/button";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setActive, setMode } from "@/feature/reducers/active";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "./ui/calendar";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { RootState } from "@reduxjs/toolkit/query";
import { formatDateDisplay } from "@/utils/CustomFunctions";
import { assetsApi } from "@/feature/assets/api/assetsApi";

interface DateRange {
  from: string;
  to: string;
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

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2000  + 1 },
  (_, i) => currentYear - i
);
const Content = () => {
  const dispatch = useDispatch();
  const active = useSelector((state: RootState) => state.active.active);
  const mode = useSelector((state: RootState) => state.active.mode);

  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [date, setDate] = useState<Date | { from?: Date; to?: Date } | null>(
    active
  );

  // useEffect(() => {
  //   if(mode && active) {
  //     dispatch(assetsApi.util.invalidateTags(["Assets"]))
  //   }
  // }, [mode, active])

  // Set activeYear based on current active date
  useEffect(() => {
    if (active) {
      if (mode === "daily") {
        const year = moment(active as string).year();
        setActiveYear(year);
      } else {
        const range = active as DateRange;
        const year = moment(range.from).year();
        setActiveYear(year);
      }
    }
  }, [active, mode]);

  const handleDailyChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    dispatch(setActive(selectedDate.toISOString()));
  };

  const handleWeeklyChange = (
    range: { from?: Date; to?: Date } | undefined
  ) => {
    if (!range) {
      setDate(null);
      return;
    }

    setDate(range);

    if (range.from && range.to) {
      const data: DateRange = {
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      };
      dispatch(setActive(data));
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    // Create first day of selected month
    const newDate = moment({
      year: activeYear,
      month: monthIndex,
      day: 1,
    }).toDate();
    const transformDate = {
      from: moment(newDate).startOf("month").toISOString(),
      to: moment(newDate).endOf("month").toISOString(),
    };
    dispatch(setActive(transformDate));
    setDate(transformDate);
  };

  const handleYearChange = (year: number) => {
    const date = moment({
      year: year,
      month: moment().month(),
      day: 1,
    }).toDate();
    const transformDate = {
      from: moment(date).startOf("year").toISOString(),
      to: moment(date).endOf("year").toISOString(),
    };
    dispatch(setActive(transformDate));
    setActiveYear(transformDate);
  };

  const handleModeChange = (newMode: string) => {
    dispatch(setMode(newMode));
    if (newMode === "daily") {
      setDate(moment().toISOString());
      dispatch(setActive(moment().toISOString()));
    } else if (newMode === "weekly") {
      const startOfWeek = moment().startOf("week").toISOString();
      const endOfWeek = moment().endOf("week").toISOString();
      const range = {
        from: startOfWeek,
        to: endOfWeek,
      };
      setDate(range);
      dispatch(setActive(range));
    } else if (newMode === "monthly") {
      const startOfMonth = moment().startOf("month").toISOString();
      const endOfMonth = moment().endOf("month").toISOString();
      const range = {
        from: startOfMonth,
        to: endOfMonth,
      };
      setDate(range);
      dispatch(setActive(range));
    } else if (newMode === "yearly") {
      const startOfYear = moment().startOf("year").toISOString();
      const endOfYear = moment().endOf("year").toISOString();
      const range = {
        from: startOfYear,
        to: endOfYear,
      };
      setDate(range);
      dispatch(setActive(range));
    }
  };

  const isFutureMonth = (monthIndex: number): boolean => {
    const currentMoment = moment();
    const targetMoment = moment({
      year: activeYear,
      month: monthIndex,
      day: 1,
    });
    return targetMoment.isAfter(currentMoment, "month");
  };

  const isSelectedMonth = (monthIndex: number): boolean => {
    if (!active || (mode !== "monthly" && mode !== "daily")) return false;

    const activeMoment = moment(active?.from as string);
    return (
      activeMoment.year() === activeYear && activeMoment.month() === monthIndex
    );
  };

  // Fix the weekly range_middle logic
  const isDateInWeekRange = (checkDate: Date): boolean => {
    if (
      !date ||
      typeof date !== "object" ||
      !("from" in date) ||
      !date.from ||
      !date.to
    ) {
      return false;
    }

    const checkMoment = moment(checkDate);
    const fromMoment = moment(date.from);
    const toMoment = moment(date.to);

    // Check if date is between from and to (excluding ends)
    return (
      checkMoment.isAfter(fromMoment, "day") &&
      checkMoment.isBefore(toMoment, "day")
    );
  };
  return (
    <div className="flex flex-col w-full items-center">
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="flex w-full">
          {/* <TabsTrigger className="w-1/3" value="daily">
            Daily
          </TabsTrigger>
          <TabsTrigger className="w-1/3" value="weekly">
            Weekly
          </TabsTrigger> */}
          <TabsTrigger className="w-1/2" value="monthly">
            Monthly
          </TabsTrigger>
          <TabsTrigger className="w-1/2" value="yearly">
            Yearly
          </TabsTrigger>
        </TabsList>
        {/* 
        <TabsContent value="daily">
          <Calendar
            mode="single"
            selected={date instanceof Date ? date : undefined}
            onSelect={handleDailyChange}
            disabled={(date) => isAfter(date, new Date())}
          />
        </TabsContent>

        <TabsContent value="weekly">
          <Calendar
            modifiers={{
              selected:
                date && typeof date === "object" && "from" in date
                  ? date
                  : undefined,
              range_start:
                date && typeof date === "object" && "from" in date
                  ? date.from
                  : undefined,
              range_end:
                date && typeof date === "object" && "from" in date
                  ? date.to
                  : undefined,
              range_middle: isDateInWeekRange,
            }}
            onDayClick={(day, modifiers) => {
              if (modifiers.selected) {
                setDate(null);
                dispatch(setActive(null));
                return;
              }

              const weekStart = startOfWeek(day);
              const weekEnd = endOfWeek(day);

              setDate({
                from: weekStart,
                to: weekEnd,
              });

              dispatch(
                setActive({
                  from: weekStart.toISOString(),
                  to: weekEnd.toISOString(),
                })
              );
            }}
            onSelect={handleWeeklyChange}
            disabled={(date) => isAfter(date, new Date())}
          />
        </TabsContent> */}

        <TabsContent value="monthly">
          <div className="p-3">
            <div className="flex px-1 items-center justify-between w-full mb-4">
              <Button
                variant="outline"
                size="icon"
                className="size-7 bg-transparent opacity-50 hover:opacity-100"
                onClick={() => setActiveYear((y) => y - 1)}
              >
                <ChevronLeft />
              </Button>
              <span className="sm:text-sm font-medium">{activeYear}</span>
              <Button
                variant="outline"
                size="icon"
                className="size-7 bg-transparent opacity-50 hover:opacity-100"
                onClick={() => setActiveYear((y) => y + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {months.map((month, index) => {
                const selected = isSelectedMonth(index);
                const future = isFutureMonth(index);

                return (
                  <Button
                    key={month}
                    onClick={() => !future && handleMonthChange(index)}
                    disabled={future}
                    variant={selected ? "default" : "ghost"}
                    className="px-1 py-2 text-xs sm:text-sm rounded-md"
                  >
                    {month}
                  </Button>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="yearly"
          className="grid grid-cols-3 gap-1 overflow-auto max-h-64"
        >
          {years.map((year) => (
            <Button
              key={year}
              onClick={() => handleYearChange(year)}
              variant={year === activeYear ? "default" : "ghost"}
              className="px-10 text-xs sm:text-sm rounded-md"
            >
              {year}
            </Button>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MonthPicker: React.FC = () => {
  const width = useScreenWidth();

  return (
    <div className="flex flex-col items-start">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="font-normal">
            <CalendarRange />
            <span className="hidden sm:inline ml-2">{formatDateDisplay()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-[325px]">
          <Content />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthPicker;
