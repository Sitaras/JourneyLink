"use client";

import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotification";
import { INotification } from "@journey-link/shared";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Notifications = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications();
  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAllRead } = useMarkAllNotificationsAsRead();

  const notifications = data?.pages.flatMap((page) => page.data) || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      markRead(notification._id);
    }
    if (notification.data?.rideId) {
      router.push(`/my-rides/${notification.data.rideId}`);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => markAllRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "p-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors",
                    !notification.isRead && "bg-muted/20"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <div className="mt-2 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 w-fit animate-pulse">
                      New
                    </div>
                  )}
                </div>
              ))}
              {hasNextPage && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full text-xs"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
