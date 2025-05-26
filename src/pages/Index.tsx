
import { useState } from "react";
import { Shield, Scan, AlertTriangle, FileText, Users, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VulnerabilityDashboard } from "@/components/VulnerabilityDashboard";
import { VulnerabilityScanner } from "@/components/VulnerabilityScanner";
import { VulnerabilityList } from "@/components/VulnerabilityList";
import { ReportsSection } from "@/components/ReportsSection";
import { TeamManagement } from "@/components/TeamManagement";
import { SettingsPanel } from "@/components/SettingsPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">VulnGuard Pro</h1>
          </div>
          <p className="text-slate-400 text-lg">Enterprise Vulnerability Management Platform</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="vulnerabilities" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Vulnerabilities
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <VulnerabilityDashboard />
          </TabsContent>

          <TabsContent value="scanner" className="mt-6">
            <VulnerabilityScanner />
          </TabsContent>

          <TabsContent value="vulnerabilities" className="mt-6">
            <VulnerabilityList />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportsSection />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
