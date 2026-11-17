import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IRootState } from "@/app/store";
import { useUpdateSettingsMutation } from "@/features/settings/api/settingsApi";
import { setSettings } from "@/shared/slices/settingsSlice";
import { getBrowserTimezone, isValidTimezone } from "@/shared/utils/timezone";

const TOAST_ID = "timezone-mismatch";
const dismissKey = (saved: string, device: string) =>
  `tz-mismatch-dismissed:${saved}|${device}`;

const isDismissed = (key: string) => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const rememberDismissed = (key: string) => {
  try {
    localStorage.setItem(key, "1");
  } catch {
    // Storage blocked: the notice just shows again next session.
  }
};

// Offers to switch when the device timezone differs from the saved one
// (travel, or a wrong value). "Keep" is remembered for that pair of zones.
const TimezoneMismatchNotice = () => {
  const dispatch = useDispatch();
  const saved = useSelector((state: IRootState) => state.settings.timezone);
  const [updateSettings] = useUpdateSettingsMutation();
  const device = getBrowserTimezone();

  useEffect(() => {
    if (!isValidTimezone(saved) || !isValidTimezone(device)) return;
    if (saved === device) {
      // e.g. changed to match in General Settings while the notice was open.
      toast.dismiss(TOAST_ID);
      return;
    }

    const key = dismissKey(saved, device);
    if (isDismissed(key)) return;

    toast(`Your device is on ${device}`, {
      id: TOAST_ID,
      description: `Trackwise shows dates in ${saved}. Switch to your device's timezone?`,
      duration: Infinity,
      action: {
        label: "Switch",
        onClick: async () => {
          try {
            const updated = await updateSettings({ timezone: device }).unwrap();
            dispatch(
              setSettings({
                timezone: updated.timezone,
                timeFormat: updated.timeFormat,
                dateFormat: updated.dateFormat,
                weekStartDay: updated.weekStartDay,
                currency: updated.currency,
              }),
            );
            toast.success(`Timezone set to ${updated.timezone}.`);
          } catch {
            toast.error("Couldn't update your timezone. Try again in Settings.");
          }
        },
      },
      cancel: {
        label: "Keep",
        onClick: () => rememberDismissed(key),
      },
    });
  }, [saved, device, dispatch, updateSettings]);

  return null;
};

export default TimezoneMismatchNotice;
