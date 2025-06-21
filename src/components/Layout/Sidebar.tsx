
import React from "react";
import { Shield, Scan, AlertTriangle, FileText, Users, Settings, Server, Target, Search, Home, BarChart3, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, gradient: "from-blue-500 to-purple-600" },
  { id: "analytics", label: "Analytics", icon: BarChart3, gradient: "from-purple-500 to-pink-600" },
  { id: "scanner", label: "Scanner", icon: Scan, gradient: "from-green-500 to-emerald-600" },
  { id: "cloudflare", label: "Cloudflare Scanner", icon: Search, gradient: "from-orange-500 to-red-600" },
  { id: "vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle, gradient: "from-red-500 to-pink-600" },
  { id: "assets", label: "Assets", icon: Server, gradient: "from-cyan-500 to-blue-600" },
  { id: "risk", label: "Risk Management", icon: Target, gradient: "from-indigo-500 to-purple-600" },
  { id: "reports", label: "Reports", icon: FileText, gradient: "from-teal-500 to-cyan-600" },
  { id: "calendar", label: "Calendar", icon: Calendar, gradient: "from-yellow-500 to-orange-600" },
  { id: "team", label: "Team", icon: Users, gradient: "from-pink-500 to-rose-600" },
  { id: "settings", label: "Settings", icon: Settings, gradient: "from-gray-500 to-slate-600" },
];

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transform transition-all duration-300 ease-in-out lg:transform-none shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  VulnGuard
                </h1>
                <p className="text-xs text-slate-400 font-medium">Security Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
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
                    "w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group relative",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10" 
                      : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Icon with gradient background */}
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                      : "bg-slate-700/50 group-hover:bg-gradient-to-r group-hover:from-slate-600 group-hover:to-slate-500"
                  )}>
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )} />
                  </div>
                  
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Section - Enhanced Status */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-white">Security Status</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Scans</span>
                  <span className="font-semibold text-blue-400">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Critical Issues</span>
                  <span className="font-semibold text-red-400">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Risk Score</span>
                  <span className="font-semibold text-yellow-400">7.2/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
