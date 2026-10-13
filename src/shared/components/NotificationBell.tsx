import { Bell, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import {
  useArchiveNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/shared/api/notificationApi";

const POLL_INTERVAL_MS = 60_000;

const NotificationBell = () => {
  const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: POLL_INTERVAL_MS,
    refetchOnFocus: true,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [archive] = useArchiveNotificationMutation();

  const items = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-10 h-10"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] leading-4 text-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="font-semibold text-sm">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:underline"
              onClick={() => markAllRead()}
            >
              Mark all as read
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            You're all caught up.
          </p>
        ) : (
          <ScrollArea className="max-h-96 overflow-y-auto">
            <ul>
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`group flex gap-2 px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                    n.isRead ? "" : "bg-muted/30"
                  }`}
                  onClick={() => !n.isRead && markRead(n.id)}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.isRead ? "bg-transparent" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground break-words">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss notification"
                    className="shrink-0 self-start text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      archive(n.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
