import { useMemo } from "react";
import { useSelector } from "react-redux";
import moment, { MomentInput } from "moment";
import { IRootState } from "@/app/store";

export const DEFAULT_DATE_FORMAT = "MMM D, YYYY";
export const DEFAULT_TIME_FORMAT = "hh:mm A";

/**
 * The user's preferred date/time display formats (General Settings).
 * Use for full calendar dates shown to the user — not for short labels
 * like "MMM D" or machine keys like "YYYY-MM-DD".
 */
export const useDateFormat = () => {
  const dateFormat = useSelector(
    (state: IRootState) => state.settings.dateFormat,
  );
  const timeFormat = useSelector(
    (state: IRootState) => state.settings.timeFormat,
  );

  return useMemo(() => {
    const date = dateFormat || DEFAULT_DATE_FORMAT;
    const time = timeFormat || DEFAULT_TIME_FORMAT;
    const dateTime = `${date} ${time}`;

    return {
      dateFormat: date,
      timeFormat: time,
      dateTimeFormat: dateTime,
      formatDate: (value: MomentInput) => moment(value).format(date),
      formatDateTime: (value: MomentInput) => moment(value).format(dateTime),
    };
  }, [dateFormat, timeFormat]);
};
