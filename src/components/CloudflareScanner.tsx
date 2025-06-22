
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Play, Download, Clock, Globe, Shield, Server, Search, RefreshCw, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScanSummaryCharts } from "./CloudflareScanner/ScanSummaryCharts";
import { DNSChangesTab } from "./CloudflareScanner/DNSChangesTab";
import { NmapResultsTab } from "./CloudflareScanner/NmapResultsTab";
import { NucleiFindingsTab } from "./CloudflareScanner/NucleiFindingsTab";
import { ScanHistoryPanel } from "./CloudflareScanner/ScanHistoryPanel";
import { ExportOptions } from "./CloudflareScanner/ExportOptions";

interface ScanSummary {
  scan_name: string;
  date: string;
  new_entries: number;
  removed_entries: number;
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export const CloudflareScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [teamsNotificationEnabled, setTeamsNotificationEnabled] = useState(false);
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  // Simulate scan progress
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            setLastScanTime(new Date().toLocaleString());
            loadScanSummary();
            toast({
              title: "Scan Complete",
              description: "Cloudflare discovery and vulnerability scan completed successfully.",
            });
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const loadScanSummary = async () => {
    // In a real implementation, this would fetch from the actual scan_summary.json file
    // For demo purposes, using mock data
    const mockSummary: ScanSummary = {
      scan_name: "Cloudflare Discovery Scan",
      date: new Date().toISOString().split('T')[0],
      new_entries: 12,
      removed_entries: 3,
      vulnerabilities: {
        total: 25,
        critical: 2,
        high: 5,
        medium: 8,
        low: 7,
        info: 3
      }
    };
    setScanSummary(mockSummary);
  };

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    toast({
      title: "Scan Started",
      description: `Cloudflare discovery scan initiated${teamsNotificationEnabled ? ' with Teams notifications' : ''}.`,
    });

    // In a real implementation, this would trigger the Python script
    // For now, we'll simulate the process
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-500",
      high: "bg-orange-500", 
      medium: "bg-yellow-500",
      low: "bg-blue-500",
      info: "bg-gray-500"
    };
    return colors[severity as keyof typeof colors] || "bg-gray-500";
  };

  useEffect(() => {
    // Load existing scan summary on component mount
    loadScanSummary();
  }, []);

  return (
    <div className={`space-y-6 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Cloudflare Discovery & Vulnerability Scanner
          </h1>
          <p className="text-slate-400">
            Automated DNS enumeration, scanning, and vulnerability assessment
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
            className="text-slate-400 hover:text-white"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            <Clock className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Last Scan Timestamp */}
      {lastScanTime && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Last scan completed: {lastScanTime}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Scan Trigger Section */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5" />
                Scan Control
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure and start your Cloudflare discovery scan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="teams-notifications"
                  checked={teamsNotificationEnabled}
                  onCheckedChange={setTeamsNotificationEnabled}
                  disabled={isScanning}
                />
                <Label htmlFor="teams-notifications" className="text-slate-300">
                  Enable MS Teams notifications
                </Label>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Scan Progress</span>
                    <span>{Math.round(scanProgress)}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>
                      {scanProgress < 30 ? 'Enumerating DNS records...' :
                       scanProgress < 60 ? 'Scanning new hosts...' :
                       scanProgress < 90 ? 'Running vulnerability detection...' :
                       'Generating summary...'}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={startScan}
                disabled={isScanning}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Scan Summary Charts */}
          {scanSummary && <ScanSummaryCharts summary={scanSummary} />}

          {/* Results Tabs */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Scan Results</CardTitle>
              <CardDescription className="text-slate-400">
                Detailed findings from your latest scan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dns" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="dns" className="data-[state=active]:bg-slate-600">
                    DNS Changes
                  </TabsTrigger>
                  <TabsTrigger value="nmap" className="data-[state=active]:bg-slate-600">
                    Nmap Results
                  </TabsTrigger>
                  <TabsTrigger value="nuclei" className="data-[state=active]:bg-slate-600">
                    Nuclei Findings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="dns" className="mt-4">
                  <DNSChangesTab summary={scanSummary} />
                </TabsContent>
                
                <TabsContent value="nmap" className="mt-4">
                  <NmapResultsTab />
                </TabsContent>
                
                <TabsContent value="nuclei" className="mt-4">
                  <NucleiFindingsTab summary={scanSummary} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          {scanSummary && (
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">New DNS Entries</p>
                      <p className="text-2xl font-bold text-green-400">{scanSummary.new_entries}</p>
                    </div>
                    <Globe className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Vulnerabilities</p>
                      <p className="text-2xl font-bold text-red-400">{scanSummary.vulnerabilities.total}</p>
                    </div>
                    <Shield className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Severity Breakdown</p>
                    {Object.entries(scanSummary.vulnerabilities).map(([severity, count]) => {
                      if (severity === 'total') return null;
                      return (
                        <div key={severity} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(severity)}`} />
                            <span className="text-slate-300 capitalize text-sm">{severity}</span>
                          </div>
                          <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                            {count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Export Options */}
          <ExportOptions scanSummary={scanSummary} />
        </div>
      </div>

      {/* Scan History Panel */}
      {showHistory && (
        <ScanHistoryPanel onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
};
