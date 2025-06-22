
import React from "react";
import { Shield, Search, AlertTriangle, FileText, Users, Settings, Server, Target, Home, BarChart3, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "scanner", label: "Scanner", icon: Search },
  { id: "cloudflare", label: "Cloud Scanner", icon: Zap },
  { id: "vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle },
  { id: "assets", label: "Assets", icon: Server },
  { id: "risk", label: "Risk Management", icon: Target },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "team", label: "Team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 glass-card border-r-0 transform transition-transform duration-300 ease-in-out lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">VulnGuard</h1>
                <p className="text-xs text-slate-400">Security Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 nav-item",
                    isActive && "nav-item-active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Panel */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="font-medium text-white text-sm">System Status</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Scans</span>
                  <span className="text-green-400 font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical Issues</span>
                  <span className="text-red-400 font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Score</span>
                  <span className="text-yellow-400 font-medium">7.2/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
