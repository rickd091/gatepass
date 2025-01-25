import React from "react";
import { Bell, Settings, User } from "lucide-react";
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

interface DashboardHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  notifications?: Array<{
    id: string;
    message: string;
  }>;
  onNotificationClick?: (id: string) => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const DashboardHeader = ({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  notifications = [
    { id: "1", message: "Your asset request was approved" },
    { id: "2", message: "New asset available for request" },
    { id: "3", message: "Reminder: Asset return due tomorrow" },
  ],
  onNotificationClick = () => {},
  onSettingsClick = () => {},
  onProfileClick = () => {},
}: DashboardHeaderProps) => {
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
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-64">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => onNotificationClick(notification.id)}
                  className="py-2 px-4 cursor-pointer"
                >
                  <span className="text-sm">{notification.message}</span>
                </DropdownMenuItem>
              ))}
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
