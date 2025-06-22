
import React from "react";
import { Bell, Search, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export const TopBar = ({ onMenuToggle, sidebarOpen }: TopBarProps) => {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VG</span>
          </div>
          <span className="font-semibold text-gray-800 hidden sm:block">VulnGuard Pro</span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search vulnerabilities, assets..."
            className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-700">
              {profile?.first_name} {profile?.last_name}
            </div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-500">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
