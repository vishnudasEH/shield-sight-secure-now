
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { DashboardOverview } from "@/components/Dashboard/DashboardOverview";
import { VulnerabilityDashboard } from "@/components/VulnerabilityDashboard";
import { VulnerabilityScanner } from "@/components/VulnerabilityScanner";
import { VulnerabilityList } from "@/components/VulnerabilityList";
import { ReportsSection } from "@/components/ReportsSection";
import { TeamManagement } from "@/components/TeamManagement";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AssetsPage } from "@/components/AssetsPage";
import { RiskManagement } from "@/components/RiskManagement";
import { CloudflareScanner } from "@/components/CloudflareScanner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "analytics":
        return <VulnerabilityDashboard />;
      case "scanner":
        return <VulnerabilityScanner />;
      case "cloudflare":
        return <CloudflareScanner />;
      case "vulnerabilities":
        return <VulnerabilityList />;
      case "assets":
        return <AssetsPage />;
      case "risk":
        return <RiskManagement />;
      case "reports":
        return <ReportsSection />;
      case "team":
        return <TeamManagement />;
      case "settings":
        return <SettingsPanel />;
      case "calendar":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan Calendar</h2>
            <p className="text-gray-600">Calendar view for scheduling and tracking scans coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
