
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
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "scanner", label: "Scanner", icon: Scan },
  { id: "cloudflare", label: "Cloudflare Scanner", icon: Search },
  { id: "vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle },
  { id: "assets", label: "Assets", icon: Server },
  { id: "risk", label: "Risk Management", icon: Target },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">VulnGuard</h1>
                <p className="text-xs text-gray-500">Security Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
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
                    "w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 shadow-sm" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Security Status</span>
              </div>
              <div className="text-sm text-blue-700">
                <div>Active Scans: <span className="font-semibold">2</span></div>
                <div>Critical Issues: <span className="font-semibold text-red-600">5</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
