
import { useState } from "react";
import { Shield, Scan, AlertTriangle, FileText, Users, Settings, Server, Target, Menu, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    { id: "dashboard", label: "Dashboard", icon: Shield, gradient: "from-blue-500 to-cyan-500" },
    { id: "scanner", label: "Scanner", icon: Scan, gradient: "from-purple-500 to-pink-500" },
    { id: "vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle, gradient: "from-red-500 to-orange-500" },
    { id: "assets", label: "Assets", icon: Server, gradient: "from-green-500 to-emerald-500" },
    { id: "risk", label: "Risk Management", icon: Target, gradient: "from-yellow-500 to-amber-500" },
    { id: "reports", label: "Reports", icon: FileText, gradient: "from-indigo-500 to-purple-500" },
    { id: "team", label: "Team", icon: Users, gradient: "from-teal-500 to-cyan-500" },
    { id: "settings", label: "Settings", icon: Settings, gradient: "from-gray-500 to-slate-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-50 glass-effect border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    VulnGuard Pro
                  </h1>
                  <p className="text-sm text-gray-400">Enterprise Security Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full glass-effect border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
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
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full glass-effect border-r border-white/10 backdrop-blur-xl">
            <div className="p-6 space-y-2">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'glass-effect border border-white/20 shadow-lg' 
                        : 'hover:glass-effect hover:border hover:border-white/10'
                    }`}
                  >
                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} ${isActive ? 'shadow-lg' : 'group-hover:shadow-lg'} transition-all duration-300`}>
                      <item.icon className="h-5 w-5 text-white" />
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-lg blur-lg opacity-50 animate-pulse`}></div>
                      )}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <TabsContent value="dashboard" className={activeTab === "dashboard" ? "block" : "hidden"}>
              <VulnerabilityDashboard />
            </TabsContent>

            <TabsContent value="scanner" className={activeTab === "scanner" ? "block" : "hidden"}>
              <VulnerabilityScanner />
            </TabsContent>

            <TabsContent value="vulnerabilities" className={activeTab === "vulnerabilities" ? "block" : "hidden"}>
              <VulnerabilityList />
            </TabsContent>

            <TabsContent value="assets" className={activeTab === "assets" ? "block" : "hidden"}>
              <AssetsPage />
            </TabsContent>

            <TabsContent value="risk" className={activeTab === "risk" ? "block" : "hidden"}>
              <RiskManagement />
            </TabsContent>

            <TabsContent value="reports" className={activeTab === "reports" ? "block" : "hidden"}>
              <ReportsSection />
            </TabsContent>

            <TabsContent value="team" className={activeTab === "team" ? "block" : "hidden"}>
              <TeamManagement />
            </TabsContent>

            <TabsContent value="settings" className={activeTab === "settings" ? "block" : "hidden"}>
              <SettingsPanel />
            </TabsContent>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
