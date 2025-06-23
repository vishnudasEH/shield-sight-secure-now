
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Download, Settings, Users, Bell, Calendar, Key, CheckCircle, XCircle, Clock, MessageSquare, UserPlus, Filter, FileText, Slack } from "lucide-react";
import { BitsightOverviewCards } from "@/components/bitsight/BitsightOverviewCards";
import { BitsightVulnerabilityTable } from "@/components/bitsight/BitsightVulnerabilityTable";
import { BitsightCharts } from "@/components/bitsight/BitsightCharts";
import { BitsightScorecard } from "@/components/bitsight/BitsightScorecard";
import { useBitsightApi } from "@/hooks/useBitsightApi";
import { BitsightApiKeyManager } from "@/components/bitsight/BitsightApiKeyManager";
import { BitsightSLATracker } from "@/components/bitsight/BitsightSLATracker";
import { BitsightComments } from "@/components/bitsight/BitsightComments";
import { BitsightAutoAssignment } from "@/components/bitsight/BitsightAutoAssignment";
import { BitsightAssetFilters } from "@/components/bitsight/BitsightAssetFilters";
import { BitsightReportGenerator } from "@/components/bitsight/BitsightReportGenerator";
import { BitsightNotifications } from "@/components/bitsight/BitsightNotifications";

const BitsightDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  
  const { 
    vulnerabilities, 
    companies,
    selectedCompany,
    currentCompany,
    loading, 
    lastSync, 
    hasApiKey,
    isRealData,
    refreshData,
    updateVulnerabilityStatus,
    assignVulnerability,
    bulkAssignVulnerabilities,
    setSelectedCompany
  } = useBitsightApi();

  useEffect(() => {
    // Show API key form only if no API key exists
    const storedKey = localStorage.getItem('bitsight_api_key');
    if (!storedKey) {
      setShowApiKeyForm(true);
    }
  }, []);

  const handleApiKeyValidated = (key: string) => {
    setShowApiKeyForm(false);
    console.log('API Key validated, refreshing data...');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const resetApiKey = () => {
    localStorage.removeItem('bitsight_api_key');
    setShowApiKeyForm(true);
  };

  const exportData = () => {
    const dataToExport = {
      vulnerabilities,
      company: currentCompany,
      exportDate: new Date().toISOString(),
      totalCount: vulnerabilities.length
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitsight-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Data exported successfully');
  };

  if (showApiKeyForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black p-6">
        <div className="max-w-4xl mx-auto">
          <BitsightApiKeyManager onApiKeyValidated={handleApiKeyValidated} />
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
                🛡️ Bitsight Vulnerability Dashboard
              </h1>
              <p className="text-gray-400 text-lg">
                Real-time vulnerability tracking and remediation dashboard
              </p>
              {lastSync && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(lastSync).toLocaleString()}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2">
                {hasApiKey && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      {isRealData ? 'Live Data Connected' : 'API Connected'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetApiKey}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      Change Key
                    </Button>
                  </div>
                )}
                {currentCompany && (
                  <Badge variant="outline" className="text-blue-400 border-blue-500">
                    {currentCompany.name}
                  </Badge>
                )}
              </div>
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
                {isRefreshing ? 'Syncing...' : 'Refresh'}
              </Button>
              
              <Button
                onClick={exportData}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <BitsightReportGenerator vulnerabilities={vulnerabilities} />
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
              
              <BitsightNotifications />
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <BitsightOverviewCards vulnerabilities={vulnerabilities} loading={loading} />

          {/* SLA Tracker */}
          <BitsightSLATracker vulnerabilities={vulnerabilities} />

          {/* Asset Filters */}
          <BitsightAssetFilters 
            vulnerabilities={vulnerabilities}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Scorecard Section with Company Selection */}
          <BitsightScorecard 
            companies={companies}
            selectedCompany={selectedCompany}
            onCompanyChange={setSelectedCompany}
          />

          {/* Charts Section */}
          <BitsightCharts vulnerabilities={vulnerabilities} />

          {/* Auto Assignment Rules */}
          <BitsightAutoAssignment />

          {/* Comments & Collaboration */}
          <BitsightComments />

          {/* Vulnerability Table with Enhanced Actions */}
          <BitsightVulnerabilityTable 
            vulnerabilities={vulnerabilities}
            searchQuery={searchQuery}
            loading={loading}
            onStatusUpdate={updateVulnerabilityStatus}
            onAssign={assignVulnerability}
            onBulkAssign={bulkAssignVulnerabilities}
          />
        </div>
      </div>
    </div>
  );
};

export default BitsightDashboard;
