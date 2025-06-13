import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfWeek, isAfter, startOfWeek } from "date-fns";
import { Button } from "./ui/button";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setActive, setMode } from "@/feature/reducers/active";
import { RootState } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "./ui/calendar";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

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

const Content = ({ mode, active }) => {
  const dispatch = useDispatch();
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());

  const [date, setDate] = useState<Date | { from?: Date; to?: Date } | null>(
    null
  );

  // Set activeYear based on current active date
  useEffect(() => {
    if (active) {
      if (mode === "daily" || mode === "monthly") {
        const year = moment(active as string).year();
        setActiveYear(year);
      } else if (mode === "weekly") {
        const range = active as DateRange;
        const year = moment(range.from).year();
        setActiveYear(year);
      }
    }
  }, [active, mode]);

  useEffect(() => {
    if (active) {
      if (mode === "daily") {
        setDate(new Date(active as string));
      } else if (mode === "weekly") {
        const range = active as DateRange;
        setDate({
          from: new Date(range.from),
          to: new Date(range.to),
        });
      } else if (mode === "monthly") {
        setDate(new Date(active as string));
      }
    } else {
      setDate(null);
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
    const newActive = newDate.toISOString();
    dispatch(setActive(newActive));
    setDate(newDate);
  };

  const handleModeChange = (newMode: string) => {
    dispatch(setMode(newMode));
    dispatch(setActive(null));
    setDate(null);
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

    const activeMoment = moment(active as string);
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
    <div className="flex mt-5  sm::mt-0  flex-col items-center">
      <Tabs value={mode} onValueChange={handleModeChange}>
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
        </TabsContent>

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
      </Tabs>
    </div>
  );
};

const MonthPicker: React.FC = () => {
  const active = useSelector((state: RootState) => state.active.active);
  const mode = useSelector((state: RootState) => state.active.mode);

  const width = useScreenWidth();

  const formatDisplayText = (): string => {
    if (!active) return "Select Date";

    if (mode === "daily") {
      return moment(active as string).format("MMMM D, YYYY");
    } else if (mode === "weekly") {
      const range = active as DateRange;
      return `${moment(range.from).format("MMM D")} - ${moment(range.to).format(
        "MMM D, YYYY"
      )}`;
    } else if (mode === "monthly") {
      return moment(active as string).format("MMMM YYYY");
    }

    return "Select Date";
  };

  return (
    <div className="flex flex-col items-start">
      {width < 640 ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="font-normal">
              <CalendarRange />
              <span className="hidden sm:inline ml-2">
                {formatDisplayText()}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full h-dvh p-4">
            <Content mode={mode} active={active} />
          </DialogContent>
        </Dialog>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="font-normal">
              <CalendarRange />
              <span className="hidden sm:inline ml-2">
                {formatDisplayText()}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-[325px] p-4">
            <Content mode={mode} active={active} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default MonthPicker;
