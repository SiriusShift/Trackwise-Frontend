import { api } from "@/shared/services/api";

export interface UserSettings {
  id: number;
  timezone: string;
  timeFormat: string;
  currency: string;
  weekStartDay: number;
  recurringBehaviour: "AUTO_LOG" | "REMIND";
  emailNotification: boolean;
  mobileNotification: boolean;
  notifyDays: number;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string | null;
}

export type UpdateSettingsPayload = Partial<
  Omit<
    UserSettings,
    "id" | "updatedAt" | "firstName" | "lastName" | "phoneNumber" | "profileImageUrl"
  >
> & {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_image?: File | null;
};

interface SettingsResponse {
  success: boolean;
  message: string;
  data: UserSettings;
}

const toFormData = (payload: UpdateSettingsPayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "profile_image" || value === undefined || value === null) return;
    formData.append(key, String(value));
  });

  if (payload.profile_image) {
    formData.append("image", payload.profile_image);
  }

  return formData;
};

export const settingsApi = api
  .enhanceEndpoints({ addTagTypes: ["Settings"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSettings: builder.query<UserSettings, void>({
        query: () => ({
          url: "/settings",
          method: "GET",
        }),
        transformResponse: (response: SettingsResponse) => response.data,
        providesTags: ["Settings"],
      }),

      updateSettings: builder.mutation<UserSettings, UpdateSettingsPayload>({
        query: (payload) => ({
          url: "/settings",
          method: "PATCH",
          body: toFormData(payload),
        }),
        transformResponse: (response: SettingsResponse) => response.data,
        invalidatesTags: ["Settings"],
      }),

      unlinkGoogle: builder.mutation<{ success: boolean; message: string }, void>({
        query: () => ({
          url: "/auth/google/unlink",
          method: "DELETE",
        }),
      }),
    }),
  });

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUnlinkGoogleMutation,
} = settingsApi;
