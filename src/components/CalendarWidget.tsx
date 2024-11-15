import React from "react";
import '@/assets/styles/Calendar.css'
import { Button } from "./ui/button";
interface Day {
  day: string;
  date: number;
}

const HorizontalCalendar: React.FC = ({ handleClick, colorTheme }) => {
  const today = new Date();
  const currentDate = today.getDate();


  const days: Day[] = Array.from({ length: 31 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
    };
  });

  return (
<div className="calendar-container" style={{ scrollbarColor: colorTheme === 'light' ? "darkgrey white" : "darkgrey black"}}>
  {days.map((day, index) => (
    <button
      key={index}
      className={`day-tile ${day.date === currentDate ? colorTheme === "light" ? "bg-black text-white" : "bg-white text-black" : ""}`}
      onClick={() => handleClick(day.date)} // Optional: Define a function for handling day clicks
    >
      <div className="day">{day.day}</div>
      <div className="date">{day.date}</div>
    </button>
  ))}
</div>

  );
};

export default HorizontalCalendar;
