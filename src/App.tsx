
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { 
  Shield, 
  FileText, 
  Upload, 
  Server, 
  BarChart3, 
  Settings, 
  Users,
  AlertTriangle,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { VulnerabilityDashboard } from "./components/VulnerabilityDashboard";
import { VulnerabilityList } from "./components/VulnerabilityList";
import { AssetsPage } from "./components/AssetsPage";
import { ReportsSection } from "./components/ReportsSection";
import { RiskManagement } from "./components/RiskManagement";
import { TeamManagement } from "./components/TeamManagement";
import { SettingsPanel } from "./components/SettingsPanel";
import { NessusFileUpload } from "./components/NessusFileUpload";
import { VulnerabilityAssignment } from "./components/VulnerabilityAssignment";

const queryClient = new QueryClient();

const sidebarItems = [
  { label: "Dashboard", icon: BarChart3, path: "/", component: VulnerabilityDashboard },
  { label: "Vulnerabilities", icon: AlertTriangle, path: "/vulnerabilities", component: VulnerabilityList },
  { label: "Assets", icon: Server, path: "/assets", component: AssetsPage },
  { label: "Assignment", icon: UserPlus, path: "/assignment", component: VulnerabilityAssignment },
  { label: "Risk Management", icon: Shield, path: "/risk", component: RiskManagement },
  { label: "Reports", icon: FileText, path: "/reports", component: ReportsSection },
  { label: "File Upload", icon: Upload, path: "/upload", component: NessusFileUpload },
  { label: "Team", icon: Users, path: "/team", component: TeamManagement },
  { label: "Settings", icon: Settings, path: "/settings", component: SettingsPanel },
];

function AppSidebar() {
  const [activePath, setActivePath] = useState("/");

  return (
    <Sidebar className="bg-slate-900 border-slate-700">
      <SidebarContent className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">VulnTracker</h2>
          <p className="text-slate-400 text-sm">Security Management Platform</p>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setActivePath(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                activePath === item.path
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}

function MainContent() {
  const [activePath, setActivePath] = useState("/");
  const activeItem = sidebarItems.find(item => item.path === activePath);
  const ActiveComponent = activeItem?.component || VulnerabilityDashboard;

  return (
    <div className="flex-1 min-h-screen bg-slate-900">
      <div className="border-b border-slate-700 bg-slate-800 p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white" />
          <h1 className="text-xl font-semibold text-white">
            {activeItem?.label || "Dashboard"}
          </h1>
        </div>
      </div>
      
      <div className="p-6">
        <ActiveComponent />
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <SidebarProvider>
              <div className="flex min-h-screen bg-slate-900">
                <AppSidebar />
                <MainContent />
              </div>
            </SidebarProvider>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
