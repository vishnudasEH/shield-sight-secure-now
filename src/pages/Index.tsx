
import { useState } from "react";
import { Shield, Scan, AlertTriangle, FileText, Users, Settings, Server, Target, Menu, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VulnerabilityDashboard } from "@/components/VulnerabilityDashboard";
import { VulnerabilityScanner } from "@/components/VulnerabilityScanner";
import { VulnerabilityList } from "@/components/VulnerabilityList";
import { ReportsSection } from "@/components/ReportsSection";
import { TeamManagement } from "@/components/TeamManagement";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AssetsPage } from "@/components/AssetsPage";
import { RiskManagement } from "@/components/RiskManagement";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Shield },
    { id: "scanner", label: "Scanner", icon: Scan },
    { id: "vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle },
    { id: "assets", label: "Assets", icon: Server },
    { id: "risk", label: "Risk Management", icon: Target },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "team", label: "Team", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative">
      {/* Sophisticated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Premium Header */}
      <header className="relative z-50 backdrop-blur-xl bg-black/40 border-b border-gray-800/50 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-red-500/25 transition-all duration-300">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    VulnGuard Pro
                  </h1>
                  <p className="text-sm text-gray-400 font-medium">Enterprise Security Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{profile?.first_name} {profile?.last_name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Modern Icon-Only Sidebar */}
        <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-20 transform transition-all duration-500 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full bg-black/60 backdrop-blur-xl border-r border-gray-800/50 shadow-2xl">
            <div className="p-4 space-y-3 mt-4">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                        isActive 
                          ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                          : 'hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-blue-400' 
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`} />
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl animate-pulse"></div>
                      )}
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 border border-gray-700/50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700/50"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Premium Main Content */}
        <main className="flex-1 p-6 relative">
          <div className="max-w-7xl mx-auto relative">
            {/* Content Container with Premium Styling */}
            <div className="relative">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <VulnerabilityDashboard />
                </div>
              )}

              {activeTab === "scanner" && (
                <div className="space-y-6">
                  <VulnerabilityScanner />
                </div>
              )}

              {activeTab === "vulnerabilities" && (
                <div className="space-y-6">
                  <VulnerabilityList />
                </div>
              )}

              {activeTab === "assets" && (
                <div className="space-y-6">
                  <AssetsPage />
                </div>
              )}

              {activeTab === "risk" && (
                <div className="space-y-6">
                  <RiskManagement />
                </div>
              )}

              {activeTab === "reports" && (
                <div className="space-y-6">
                  <ReportsSection />
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-6">
                  <TeamManagement />
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <SettingsPanel />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
