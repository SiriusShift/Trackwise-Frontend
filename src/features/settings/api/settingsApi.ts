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
}

export type UpdateSettingsPayload = Partial<
  Omit<UserSettings, "id" | "updatedAt">
>;

interface SettingsResponse {
  success: boolean;
  message: string;
  data: UserSettings;
}

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
        query: (body) => ({
          url: "/settings",
          method: "PATCH",
          body,
        }),
        transformResponse: (response: SettingsResponse) => response.data,
        invalidatesTags: ["Settings"],
      }),
    }),
  });

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
