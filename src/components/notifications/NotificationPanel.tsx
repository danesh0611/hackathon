import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { markAsRead, markAllAsRead } from "@/store/alertsSlice";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlertCard } from "@/components/alerts/AlertCard";

export function NotificationPanel() {
  const { alerts, unreadCount } = useAppSelector((state) => state.alerts);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5 rounded-full bg-destructive">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
          <SheetTitle>AI Alerts</SheetTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-8 text-xs">
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {alerts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <Bell className="mb-4 h-10 w-10 opacity-20" />
              <p>No new alerts</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="relative">
                  {!alert.isRead && (
                    <span className="absolute -left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                  )}
                  <AlertCard
                    alert={alert as any}
                    onClick={() => dispatch(markAsRead(alert.id))}
                    className={!alert.isRead ? "border-primary/50 bg-primary/5" : "opacity-80"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
