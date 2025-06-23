
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Download, Settings, Users, Bell, Calendar } from "lucide-react";
import { BitsightOverviewCards } from "@/components/bitsight/BitsightOverviewCards";
import { BitsightVulnerabilityTable } from "@/components/bitsight/BitsightVulnerabilityTable";
import { BitsightCharts } from "@/components/bitsight/BitsightCharts";
import { BitsightScorecard } from "@/components/bitsight/BitsightScorecard";
import { useBitsightApi } from "@/hooks/useBitsightApi";

const BitsightDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { vulnerabilities, loading, lastSync, refreshData, hasApiKey } = useBitsightApi();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="neo-premium">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold gradient-text mb-4">
                🔐 Bitsight API Configuration
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Please configure your Bitsight API key to access vulnerability data
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6">
                Your API key will be securely stored and encrypted. You can find your API key in your Bitsight account settings.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="btn-premium">
                  Configure API Key
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 cyber-grid-premium opacity-30"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold premium-gradient-text mb-2">
                🛡️ Bitsight Vulnerability Management
              </h1>
              <p className="text-gray-400 text-lg">
                Comprehensive vulnerability tracking and remediation dashboard
              </p>
              {lastSync && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(lastSync).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search CVEs, assets, or vulnerabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-premium"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <BitsightOverviewCards vulnerabilities={vulnerabilities} loading={loading} />

          {/* Scorecard Section */}
          <BitsightScorecard />

          {/* Charts Section */}
          <BitsightCharts vulnerabilities={vulnerabilities} />

          {/* Vulnerability Table */}
          <BitsightVulnerabilityTable 
            vulnerabilities={vulnerabilities}
            searchQuery={searchQuery}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default BitsightDashboard;
