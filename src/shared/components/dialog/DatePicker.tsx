import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { FormControl } from "../ui/form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { Input } from "../ui/input";
// import TimePicker from "./TimePicker";

const DatePicker = ({
  field,
  setOpen,
  open,
  removeTime,
  disablePast,
}: {
  field: {
    onChange: (value: any) => void;
    onBlur: () => void;
    value: Date | string; // depends on your schema
    ref: React.Ref<any>;
    name: String;
  };
  setOpen: (open: boolean) => void;
  open: boolean;
  removeTime?: boolean;
  disablePast?: boolean;
}) => {
  //   const [timeOpen, setTimeOpen] = useState(false);
  console.log(disablePast, open);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          removeClose
          className="max-w-[300px] sm:h-auto sm:w-auto p-4 flex justify-center"
        >
          <div className="flex flex-col space-y-4">
            {/* Calendar for Date Selection */}
            <Calendar
              className="responsive-calendar"
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) => {
                const newDate = new Date(
                  date.setHours(
                    field.value ? new Date(field.value).getHours() : 0,
                    field.value ? new Date(field.value).getMinutes() : 0
                  )
                );
                console.log("Selected Date:", newDate);
                field.onChange(newDate); // Update date with time preserved
              }}
              initialFocus
              disabled={(date) => {
                if (disablePast) {
                  const today = moment().startOf("day").toDate();
                  return date < today;
                }
                const minDate = new Date("2000-01-01"); // Minimum date
                return date < minDate;
              }}
            />
            {/* Time Picker for Time Selection */}
            {!removeTime && (
              <div className="flex items-center px-4 justify-between">
                <label className="text-sm font-lg">Time:</label>
                {/* <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                //   setTimeOpen(true);
                }}
                type="button"
                className="w-28 h-8 flex justify-between"
              >
                {field.value
                  ? moment(field.value).format("hh:mm A")
                  : "-- : -- --"}{" "}
                <Clock />
              </Button> */}

                <Input
                  type="time"
                  className="w-32 px-2 h-7 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  value={field.value ? moment(field.value).format("HH:mm") : ""}
                  onSelect={(date) => {
                    const newDate = new Date(
                      date.setHours(
                        field.value ? new Date(field.value).getHours() : 0,
                        field.value ? new Date(field.value).getMinutes() : 0
                      )
                    );
                    console.log("Selected Date:", newDate);
                    field.onChange(newDate); // Update date with time preserved
                  }}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value
                      .split(":")
                      .map(Number);
                    const updatedDate = field.value
                      ? new Date(field.value)
                      : new Date(); // Use the selected date or default to now
                    updatedDate.setHours(hours, minutes);
                    console.log("Updated Time:", updatedDate);
                    field.onChange(updatedDate); // Update time with the correct date preserved
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* <TimePicker open={timeOpen} setDateOpen={setOpen} setOpen={setTimeOpen} /> */}
    </>
  );
};

export default DatePicker;
