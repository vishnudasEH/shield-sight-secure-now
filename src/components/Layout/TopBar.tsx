
import React from "react";
import { Bell, Search, Settings, LogOut, Menu, Shield } from "lucide-react";
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
    <div className="h-16 glass-card border-b-0 px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xl text-white">VulnGuard Pro</h1>
            <p className="text-xs text-slate-400">Security Platform</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search vulnerabilities, assets, scans..."
            className="pl-10 input-modern"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg p-2"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            3
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white">
              {profile?.first_name} {profile?.last_name}
            </div>
            <div className="text-xs text-slate-400">{user?.email}</div>
          </div>
        </div>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg p-2"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Sign Out */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={signOut} 
          className="text-slate-300 hover:text-red-400 hover:bg-slate-700 rounded-lg p-2"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
