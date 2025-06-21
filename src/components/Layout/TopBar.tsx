
import React from "react";
import { Bell, Search, User, Settings, LogOut, Menu, Shield } from "lucide-react";
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
    <div className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 px-4 flex items-center justify-between shadow-lg backdrop-blur-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              VulnGuard Pro
            </h1>
            <p className="text-xs text-slate-400">Security Platform</p>
          </div>
        </div>
      </div>

      {/* Center Section - Enhanced Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search vulnerabilities, assets, scans..."
            className="pl-10 bg-slate-800/50 border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section - Enhanced */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
            3
          </span>
        </Button>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-600">
          <div className="w-9 h-9 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-sm">
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
          className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Sign Out */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={signOut} 
          className="text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
