import moment from "moment-timezone";

// The device's IANA timezone, e.g. "Asia/Manila". Undefined if unavailable.
export const getBrowserTimezone = (): string | undefined => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
};

export const isValidTimezone = (tz: unknown): tz is string =>
  typeof tz === "string" && tz !== "" && moment.tz.zone(tz) !== null;

// Makes every moment() in the app use the user's saved timezone, so dates on
// screen and "today/this week/this month" match what the backend groups by.
// Falls back to the device timezone when the setting is empty or invalid.
export const applyTimezone = (tz: unknown) => {
  moment.tz.setDefault(isValidTimezone(tz) ? tz : undefined);
};
