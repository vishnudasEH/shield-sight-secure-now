
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
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xl text-foreground">VulnGuard Pro</h1>
            <p className="text-xs text-muted-foreground">Security Platform</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search vulnerabilities, assets, scans..."
            className="pl-10 input-field"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center font-bold">
            3
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-medium text-sm">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-foreground">
              {profile?.first_name} {profile?.last_name}
            </div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Sign Out */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={signOut} 
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
