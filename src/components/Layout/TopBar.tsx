
import React from "react";
import { Bell, Search, User, Settings, LogOut, Menu, Shield, Zap } from "lucide-react";
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
    <div className="h-20 glass-card border-b-0 px-6 flex items-center justify-between shadow-xl relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-gradient"></div>
      
      {/* Left Section */}
      <div className="flex items-center space-x-6 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl p-3"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-glow"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-2xl bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              VulnGuard Pro
            </h1>
            <p className="text-xs text-slate-400 font-medium">Advanced Security Platform</p>
          </div>
        </div>
      </div>

      {/* Center Section - Enhanced Search */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:block relative z-10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-indigo-400 transition-colors" />
          <Input
            placeholder="Search vulnerabilities, assets, scans, threats..."
            className="pl-12 pr-6 py-4 input-modern text-lg rounded-2xl border-2 focus:border-indigo-500/50 transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-700/50 rounded-lg">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Section - Enhanced */}
      <div className="flex items-center space-x-4 relative z-10">
        {/* Quick Actions */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300 rounded-xl p-3"
        >
          <Zap className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300 rounded-xl p-3"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs text-white flex items-center justify-center animate-pulse font-bold">
            3
          </span>
        </Button>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-white">
              {profile?.first_name} {profile?.last_name}
            </div>
            <div className="text-xs text-slate-400">{user?.email}</div>
          </div>
        </div>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300 rounded-xl p-3"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* Sign Out */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={signOut} 
          className="text-slate-300 hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all duration-300 rounded-xl p-3"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
