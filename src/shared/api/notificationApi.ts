import { api } from "@/shared/services/api";

export type NotificationType =
  | "Reminder"
  | "System"
  | "General"
  | "Warning"
  | "Info"
  | "Success"
  | "Error";

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  recurringId: number | null;
}

export interface NotificationsData {
  items: AppNotification[];
  unreadCount: number;
}

export const notificationApi = api
  .enhanceEndpoints({ addTagTypes: ["Notifications"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNotifications: builder.query<NotificationsData, void>({
        query: () => ({ url: "/notifications", method: "GET" }),
        transformResponse: (response: { data: NotificationsData }) => response.data,
        providesTags: ["Notifications"],
      }),

      markNotificationRead: builder.mutation<void, number>({
        query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
        invalidatesTags: ["Notifications"],
      }),

      markAllNotificationsRead: builder.mutation<void, void>({
        query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
        invalidatesTags: ["Notifications"],
      }),

      archiveNotification: builder.mutation<void, number>({
        query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
        invalidatesTags: ["Notifications"],
      }),
    }),
  });

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useArchiveNotificationMutation,
} = notificationApi;
