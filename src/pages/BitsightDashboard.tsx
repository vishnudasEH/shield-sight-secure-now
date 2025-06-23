
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
  const [apiKey, setApiKey] = useState("");
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [showApiKeyForm, setShowApiKeyForm] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const { vulnerabilities, loading, lastSync, refreshData, hasApiKey } = useBitsightApi();

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem('bitsight_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setApiKeyValid(true);
      setShowApiKeyForm(false);
    }
  }, []);

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) return;

    // Simulate API key validation
    const isValid = apiKey.length >= 20; // Basic validation
    setApiKeyValid(isValid);
    
    if (isValid) {
      localStorage.setItem('bitsight_api_key', apiKey);
      setShowApiKeyForm(false);
      await refreshData();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const resetApiKey = () => {
    localStorage.removeItem('bitsight_api_key');
    setApiKey("");
    setApiKeyValid(null);
    setShowApiKeyForm(true);
  };

  if (showApiKeyForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="neo-premium">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold gradient-text mb-4">
                🔐 Bitsight API Configuration
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Please enter your Bitsight API key to access vulnerability data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium text-gray-300">
                    API Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your Bitsight API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                  {apiKeyValid === false && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Invalid API key. Please check your key and try again.
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={handleApiKeySubmit}
                    className="btn-premium"
                    disabled={!apiKey.trim()}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Validate API Key
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    View Documentation
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Getting your API Key:</h4>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Log into your Bitsight account</li>
                  <li>Navigate to Settings → API Keys</li>
                  <li>Generate a new API key or copy an existing one</li>
                  <li>Paste it in the field above</li>
                </ol>
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
                🛡️ Bitsight Vulnerability Dashboard
              </h1>
              <p className="text-gray-400 text-lg">
                Comprehensive vulnerability tracking and remediation dashboard
              </p>
              {lastSync && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(lastSync).toLocaleString()}
                </p>
              )}
              {apiKeyValid && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">API Connected</span>
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

          {/* Scorecard Section */}
          <BitsightScorecard />

          {/* Charts Section */}
          <BitsightCharts vulnerabilities={vulnerabilities} />

          {/* Auto Assignment Rules */}
          <BitsightAutoAssignment />

          {/* Comments & Collaboration */}
          <BitsightComments />

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
