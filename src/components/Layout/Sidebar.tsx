
import React from "react";
import { Shield, Search, AlertTriangle, FileText, Users, Settings, Server, Target, Home, BarChart3, Calendar, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, gradient: "from-blue-500 to-cyan-500" },
  { id: "analytics", label: "Analytics", icon: BarChart3, gradient: "from-purple-500 to-pink-500" },
  { id: "scanner", label: "Scanner", icon: Search, gradient: "from-green-500 to-emerald-500" },
  { id: "cloudflare", label: "Cloud Scanner", icon: Zap, gradient: "from-orange-500 to-red-500" },
  { id: "vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle, gradient: "from-red-500 to-pink-500" },
  { id: "assets", label: "Assets", icon: Server, gradient: "from-cyan-500 to-blue-500" },
  { id: "risk", label: "Risk Management", icon: Target, gradient: "from-indigo-500 to-purple-500" },
  { id: "reports", label: "Reports", icon: FileText, gradient: "from-teal-500 to-cyan-500" },
  { id: "calendar", label: "Calendar", icon: Calendar, gradient: "from-yellow-500 to-orange-500" },
  { id: "team", label: "Team", icon: Users, gradient: "from-pink-500 to-rose-500" },
  { id: "settings", label: "Settings", icon: Settings, gradient: "from-gray-500 to-slate-500" },
];

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-80 glass-card border-r-0 transform transition-all duration-500 ease-in-out lg:transform-none shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          {/* Sidebar Header */}
          <div className="p-8 border-b border-white/10 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-float">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-glow"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  VulnGuard
                </h1>
                <p className="text-xs text-slate-400 font-medium">Security Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto relative z-10">
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
                Main Navigation
              </h3>
            </div>
            
            {navigationItems.map((item, index) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 group nav-item relative overflow-hidden",
                    isActive 
                      ? "nav-item-active transform scale-105" 
                      : "hover:transform hover:scale-105"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon with enhanced gradient background */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg",
                    isActive 
                      ? `bg-gradient-to-br ${item.gradient} shadow-xl` 
                      : "bg-slate-700/50 group-hover:bg-gradient-to-br group-hover:from-slate-600 group-hover:to-slate-500"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )} />
                  </div>
                  
                  <span className={cn(
                    "font-semibold transition-colors duration-300",
                    isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Enhanced active indicator */}
                  {isActive && (
                    <div className="absolute right-4 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-75"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Enhanced Status Panel */}
          <div className="p-6 border-t border-white/10 relative z-10">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">System Status</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Scans</span>
                  <span className="font-bold text-green-400">2 Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Critical Issues</span>
                  <span className="font-bold text-red-400">5 Found</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Security Score</span>
                  <span className="font-bold text-yellow-400">7.2/10</span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-[72%] transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
