import React, { useEffect, useRef } from "react";
import "@/assets/styles/Calendar.css";
import CommonWidget from "@/components/common/CommonWidget";
import { ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";

interface Day {
  day: string;
  date: number;
}

interface Props {
  handleClick: (date: number) => void;
  activeDay: number;
  colorTheme: "light" | "dark";
}

const HorizontalCalendar: React.FC<Props> = ({
  handleClick,
  activeDay,
  colorTheme,
}) => {
  const today = new Date();
  const calendarRef = useRef<HTMLDivElement>(null);
  const activeDayRef = useRef<HTMLButtonElement | null>(null);

  const days: Day[] = Array.from({ length: 31 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
    };
  });

  // Scroll the active day into the center of the calendar
  useEffect(() => {
    if (activeDayRef.current && calendarRef.current) {
      const container = calendarRef.current;
      const activeDayElement = activeDayRef.current;

      const containerWidth = container.offsetWidth;
      const activeDayOffset =
        activeDayElement.offsetLeft + activeDayElement.offsetWidth / 2;

      const scrollPosition = activeDayOffset - containerWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth", // Smooth scrolling effect
      });
    }
  }, [activeDay]); // Re-run when activeDay changes

  return (
    <CommonWidget title="Calendar">
      {" "}
      <div className="space-y-3">
        <div className="flex gap-2 justify-around">
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-md flex  justify-center items-center bg-gray-100">
              <ArrowUpFromLine className="text-black" />
            </div>
            <div>
              <p>Income</p>
              <p className="text-green-500">+6.52%</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-md flex  justify-center items-center bg-gray-100">
              <ArrowDownFromLine className="text-black" />
            </div>
            <div>
              <p>Expense</p>
              <p className="text-red-500">+6.52%</p>
            </div>
          </div>
        </div>
        <div
          ref={calendarRef}
          className="calendar-container"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollbarColor:
              colorTheme === "light" ? "darkgrey white" : "darkgrey black",
          }}
        >
          {days.map((day, index) => (
            <button
              key={index}
              ref={day.date === activeDay ? activeDayRef : null} // Attach ref to the active day
              className={`day-tile ${
                day.date === activeDay
                  ? colorTheme === "light"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                  : ""
              }`}
              onClick={() => handleClick(day.date)}
            >
              <div className="day">{day.day}</div>
              <div className="date">{day.date}</div>
            </button>
          ))}
        </div>
      </div>
    </CommonWidget>
  );
};

export default HorizontalCalendar;
