import moment from "moment";

export const WEEK_DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const;

export const toWeekStartDay = (value: unknown) => {
  const day = Number(value);
  return Number.isInteger(day) && day >= 0 && day <= 6 ? day : 0;
};

// Makes moment's locale-aware week ("week", weekday(), weekdaysMin(true))
// start on the given day. 0 = Sunday … 6 = Saturday.
export const applyWeekStartDay = (value: unknown) => {
  const dow = toWeekStartDay(value);
  moment.updateLocale(moment.locale(), {
    week: { dow, doy: dow === 0 ? 6 : 4 },
  });
};
