
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  X, Download, Eye, FileText, Globe, Shield, Activity, 
  ArrowUp, ArrowDown, Plus, Minus, AlertTriangle, Copy, ExternalLink 
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ScanData {
  id: string;
  date: string;
  time: string;
  newEntries: number;
  removedEntries: number;
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  dnsChanges: {
    added: string[];
    removed: string[];
  };
  nmapResults: {
    hosts: Array<{
      ip: string;
      hostname: string;
      ports: Array<{
        port: number;
        service: string;
        state: string;
      }>;
    }>;
  };
  nucleiFindings: Array<{
    id: string;
    template: string;
    severity: string;
    host: string;
    description: string;
    matcher: string;
  }>;
}

interface ScanDetailPageProps {
  scanId: string;
  onClose: () => void;
}

export const ScanDetailPage = ({ scanId, onClose }: ScanDetailPageProps) => {
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data loading - in real implementation, fetch from API
    const mockScanData: ScanData = {
      id: scanId,
      date: "2024-06-21",
      time: "10:30:00",
      newEntries: 12,
      removedEntries: 3,
      vulnerabilities: {
        total: 25,
        critical: 2,
        high: 5,
        medium: 8,
        low: 7,
        info: 3
      },
      dnsChanges: {
        added: [
          "api.newservice.example.com",
          "cdn-assets.example.com",
          "monitoring.internal.example.com"
        ],
        removed: [
          "old-api.example.com",
          "deprecated.assets.example.com"
        ]
      },
      nmapResults: {
        hosts: [
          {
            ip: "192.168.1.100",
            hostname: "web-server-01.example.com",
            ports: [
              { port: 80, service: "http", state: "open" },
              { port: 443, service: "https", state: "open" },
              { port: 22, service: "ssh", state: "open" }
            ]
          },
          {
            ip: "192.168.1.101",
            hostname: "db-server-01.example.com",
            ports: [
              { port: 3306, service: "mysql", state: "open" },
              { port: 22, service: "ssh", state: "open" }
            ]
          }
        ]
      },
      nucleiFindings: [
        {
          id: "CVE-2023-1234",
          template: "apache-version-disclosure",
          severity: "medium",
          host: "192.168.1.100",
          description: "Apache version information disclosed",
          matcher: "version-disclosure"
        },
        {
          id: "CVE-2023-5678",
          template: "mysql-unauth-access",
          severity: "critical",
          host: "192.168.1.101",
          description: "MySQL server allows unauthorized access",
          matcher: "auth-bypass"
        }
      ]
    };

    setTimeout(() => {
      setScanData(mockScanData);
      setLoading(false);
    }, 1000);
  }, [scanId]);

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-black",
      low: "bg-blue-500 text-white",
      info: "bg-gray-500 text-white"
    };
    return colors[severity as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getSeverityEmoji = (severity: string) => {
    const emojis = {
      critical: "🔴",
      high: "🟠",
      medium: "🟡",
      low: "🔵",
      info: "⚪"
    };
    return emojis[severity as keyof typeof emojis] || "⚪";
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting scan data in ${format.toUpperCase()} format...`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-slate-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading scan details...</p>
        </div>
      </div>
    );
  }

  if (!scanData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-4 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="bg-slate-800 border-slate-700">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-700">
              <div>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-500" />
                  Scan Details - {scanData.date}
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Comprehensive analysis of scan results from {scanData.time}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('json')}
                  className="text-slate-300 border-slate-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                  className="text-slate-300 border-slate-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Quick Stats */}
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="h-4 w-4 text-green-500" />
                    <span className="text-slate-400 text-sm">New DNS Entries</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{scanData.newEntries}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Minus className="h-4 w-4 text-red-500" />
                    <span className="text-slate-400 text-sm">Removed Entries</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400">{scanData.removedEntries}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-slate-400 text-sm">Total Vulns</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-400">{scanData.vulnerabilities.total}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-400 text-sm">Hosts Scanned</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{scanData.nmapResults.hosts.length}</p>
                </motion.div>
              </div>

              {/* Detailed Tabs */}
              <Tabs defaultValue="dns" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="dns" className="data-[state=active]:bg-slate-600">
                    DNS Changes
                  </TabsTrigger>
                  <TabsTrigger value="nmap" className="data-[state=active]:bg-slate-600">
                    Nmap Results
                  </TabsTrigger>
                  <TabsTrigger value="nuclei" className="data-[state=active]:bg-slate-600">
                    Vulnerabilities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dns" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-700/30 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-green-400 flex items-center gap-2">
                          <ArrowUp className="h-4 w-4" />
                          Added Entries ({scanData.dnsChanges.added.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {scanData.dnsChanges.added.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                              <span className="text-slate-300 font-mono text-sm">{entry}</span>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(entry)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(`https://${entry}`, '_blank')}
                                  className="h-6 w-6 p-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700/30 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-red-400 flex items-center gap-2">
                          <ArrowDown className="h-4 w-4" />
                          Removed Entries ({scanData.dnsChanges.removed.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {scanData.dnsChanges.removed.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                              <span className="text-slate-300 font-mono text-sm line-through opacity-60">{entry}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(entry)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="nmap" className="mt-6">
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Network Discovery Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-slate-300">Host</TableHead>
                            <TableHead className="text-slate-300">IP Address</TableHead>
                            <TableHead className="text-slate-300">Open Ports</TableHead>
                            <TableHead className="text-slate-300">Services</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scanData.nmapResults.hosts.map((host, index) => (
                            <TableRow key={index} className="border-slate-600">
                              <TableCell className="text-slate-300 font-mono">{host.hostname}</TableCell>
                              <TableCell className="text-slate-300 font-mono">{host.ip}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {host.ports.map((port, portIndex) => (
                                    <Badge key={portIndex} variant="secondary" className="bg-blue-500/20 text-blue-400">
                                      {port.port}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {host.ports.map((port, portIndex) => (
                                    <span key={portIndex} className="text-xs text-slate-400">
                                      {port.service}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="nuclei" className="mt-6">
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-orange-400">Vulnerability Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {scanData.nucleiFindings.map((finding, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getSeverityEmoji(finding.severity)}</span>
                                <Badge className={getSeverityColor(finding.severity)}>
                                  {finding.severity.toUpperCase()}
                                </Badge>
                                <span className="text-slate-300 font-medium">{finding.id}</span>
                              </div>
                              <span className="text-slate-400 font-mono text-sm">{finding.host}</span>
                            </div>
                            <p className="text-slate-300 mb-2">{finding.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span>Template: {finding.template}</span>
                              <span>Matcher: {finding.matcher}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
