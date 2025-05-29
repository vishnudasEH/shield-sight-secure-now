
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Upload, 
  Server, 
  BarChart3, 
  Settings, 
  Users,
  AlertTriangle,
  UserPlus,
  Target,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VulnerabilityDashboard } from "./components/VulnerabilityDashboard";
import { VulnerabilityList } from "./components/VulnerabilityList";
import { AssetsPage } from "./components/AssetsPage";
import { ReportsSection } from "./components/ReportsSection";
import { RiskManagement } from "./components/RiskManagement";
import { TeamManagement } from "./components/TeamManagement";
import { SettingsPanel } from "./components/SettingsPanel";
import { NessusFileUpload } from "./components/NessusFileUpload";
import { VulnerabilityAssignment } from "./components/VulnerabilityAssignment";
import { AuthPage } from "./components/AuthPage";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const sidebarItems = [
  { label: "Dashboard", icon: BarChart3, path: "/", component: VulnerabilityDashboard },
  { label: "Vulnerabilities", icon: AlertTriangle, path: "/vulnerabilities", component: VulnerabilityList },
  { label: "Assets", icon: Server, path: "/assets", component: AssetsPage },
  { label: "Assignment", icon: UserPlus, path: "/assignment", component: VulnerabilityAssignment },
  { label: "Risk Management", icon: Target, path: "/risk", component: RiskManagement },
  { label: "Reports", icon: FileText, path: "/reports", component: ReportsSection },
  { label: "File Upload", icon: Upload, path: "/upload", component: NessusFileUpload },
  { label: "Team", icon: Users, path: "/team", component: TeamManagement },
  { label: "Settings", icon: Settings, path: "/settings", component: SettingsPanel },
];

function AppSidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const currentPath = location.pathname;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className="border-r border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-950">
      <SidebarContent className="p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                VulnTracker
              </h2>
              <p className="text-slate-400 text-xs">Security Platform</p>
            </div>
          </div>
          {profile && (
            <div className="text-xs text-slate-400">
              Welcome, {profile.first_name} {profile.last_name}
              {profile.role === 'admin' && (
                <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Admin</span>
              )}
            </div>
          )}
        </div>
        
        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                currentPath === item.path
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-200",
                currentPath === item.path 
                  ? "text-blue-400" 
                  : "text-slate-400 group-hover:text-blue-400"
              )} />
              <span className="font-medium">{item.label}</span>
              {currentPath === item.path && (
                <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-700">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function MainContent() {
  const location = useLocation();
  const activeItem = sidebarItems.find(item => item.path === location.pathname) || sidebarItems[0];
  const ActiveComponent = activeItem.component;

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-slate-800 p-2 rounded-lg transition-colors" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <activeItem.icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {activeItem.label}
              </h1>
              <p className="text-slate-400 text-sm">
                {activeItem.label === "Dashboard" && "Overview of your security posture"}
                {activeItem.label === "Vulnerabilities" && "Manage and track security issues"}
                {activeItem.label === "Assets" && "Monitor your infrastructure"}
                {activeItem.label === "Assignment" && "Assign vulnerabilities to team members"}
                {activeItem.label === "Risk Management" && "Assess and mitigate risks"}
                {activeItem.label === "Reports" && "Generate security reports"}
                {activeItem.label === "File Upload" && "Import vulnerability data"}
                {activeItem.label === "Team" && "Manage team members"}
                {activeItem.label === "Settings" && "Configure platform settings"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-900">
          <AppSidebar />
          <MainContent />
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<AppLayout />} />
            <Route path="/vulnerabilities" element={<AppLayout />} />
            <Route path="/assets" element={<AppLayout />} />
            <Route path="/assignment" element={<AppLayout />} />
            <Route path="/risk" element={<AppLayout />} />
            <Route path="/reports" element={<AppLayout />} />
            <Route path="/upload" element={<AppLayout />} />
            <Route path="/team" element={<AppLayout />} />
            <Route path="/settings" element={<AppLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
