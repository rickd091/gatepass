import React, { createContext, useContext, useEffect, useState } from "react";
import { notificationService } from "@/services/notificationService";
import { useMsal } from "@azure/msal-react";
import { withErrorHandling } from "@/lib/utils/error-handler";
import type { Database } from "@/types/database.types";
import { supabase } from "@/lib/supabase/client";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  refetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sound] = useState(new Audio("/notification.mp3"));
  const { accounts } = useMsal();
  const activeAccount = accounts[0];

  const fetchNotifications = async () => {
    if (!activeAccount?.username) return;

    await withErrorHandling(async () => {
      const data = await notificationService.getUserNotifications(
        activeAccount.username,
      );
      setNotifications(data);
    }, "Failed to fetch notifications");
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${activeAccount?.username}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);

          // Play sound for new notifications
          if (!newNotification.read) {
            sound.play().catch(console.error);

            // Show browser notification if permitted
            if (Notification.permission === "granted") {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: "/kma-logo.png",
              });
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeAccount?.username]);

  const markAsRead = async (id: string) => {
    await withErrorHandling(async () => {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    }, "Failed to mark notification as read");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        refetchNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
