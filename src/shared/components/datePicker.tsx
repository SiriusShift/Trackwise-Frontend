import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { endOfWeek, formatDate, isAfter, startOfWeek } from "date-fns";
import { Button } from "./ui/button";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setActive, setMode } from "@/shared/slices/activeSlice";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Calendar } from "./ui/calendar";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { RootState } from "@reduxjs/toolkit/query";
import { formatDateDisplay } from "@/shared/utils/CustomFunctions";
import { assetsApi } from "@/shared/api/assetsApi";
import { months } from "@/shared/constants/dateConstants";

interface DateRange {
  from: string;
  to: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2000 + 1 },
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

  return (
    <div className="flex flex-col w-full items-center">
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="flex w-full">
          <TabsTrigger className="w-1/2" value="monthly">
            Monthly
          </TabsTrigger>
          <TabsTrigger className="w-1/2" value="yearly">
            Yearly
          </TabsTrigger>
        </TabsList>

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
        <PopoverContent side="bottom" align="end" className="sm:w-[325px]">
          <Content />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthPicker;
