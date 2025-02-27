import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { NotificationBadge } from "@/components/ui/notification-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotifications } from "@/contexts/NotificationContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface DashboardHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const DashboardHeader = ({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  onSettingsClick = () => {},
  onProfileClick = () => {},
}: DashboardHeaderProps) => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-4">
        <img src="/kma-logo.png" alt="KMA Logo" className="h-12" />
        <div>
          <h1 className="text-xl font-bold">Kenya Maritime Authority</h1>
          <p className="text-sm text-gray-500">
            ICT Asset Gate Pass Management
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <NotificationBadge count={unreadCount} />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-96">
              <ScrollArea className="h-[300px]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          window.location.href = notification.link;
                        }
                      }}
                      className={`py-3 px-4 cursor-pointer border-b last:border-b-0 ${!notification.read ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {notification.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(
                              new Date(notification.created_at),
                              "MMM d, h:mm a",
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {notification.message}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSettingsClick}>
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
