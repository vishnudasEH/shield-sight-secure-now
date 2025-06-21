
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Server, Search, Shield, Globe } from "lucide-react";

export const NmapResultsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data from alive_hosts.txt parsing
  const nmapResults = [
    { ip: "192.168.1.100", port: "80", service: "http", state: "open", banner: "nginx/1.18.0" },
    { ip: "192.168.1.100", port: "443", service: "https", state: "open", banner: "nginx/1.18.0" },
    { ip: "192.168.1.101", port: "80", service: "http", state: "open", banner: "Apache/2.4.41" },
    { ip: "192.168.1.101", port: "443", service: "https", state: "open", banner: "Apache/2.4.41" },
    { ip: "192.168.1.102", port: "8080", service: "http-alt", state: "open", banner: "Jetty/9.4.z" },
    { ip: "10.0.0.50", port: "80", service: "http", state: "open", banner: "IIS/10.0" },
    { ip: "10.0.0.50", port: "443", service: "https", state: "open", banner: "IIS/10.0" },
  ];

  const filteredResults = nmapResults.filter(result =>
    result.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.port.includes(searchTerm) ||
    result.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.banner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportResults = () => {
    const csvContent = "IP Address,Port,Service,State,Banner\n" + 
      nmapResults.map(result => `${result.ip},${result.port},${result.service},${result.state},${result.banner}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nmap_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getServiceBadgeColor = (service: string) => {
    if (service.includes('http')) return 'bg-blue-500/20 text-blue-400';
    if (service.includes('ssh')) return 'bg-green-500/20 text-green-400';
    if (service.includes('ftp')) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const uniqueIPs = [...new Set(nmapResults.map(r => r.ip))].length;
  const totalPorts = nmapResults.length;
  const services = [...new Set(nmapResults.map(r => r.service))].length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Live Hosts</p>
                <p className="text-2xl font-bold text-blue-400">{uniqueIPs}</p>
              </div>
              <Server className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Open Ports</p>
                <p className="text-2xl font-bold text-green-400">{totalPorts}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Services</p>
                <p className="text-2xl font-bold text-purple-400">{services}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                Nmap Scan Results
              </CardTitle>
              <CardDescription className="text-slate-400">
                Live hosts and open ports discovered from new DNS entries
              </CardDescription>
            </div>
            <Button
              onClick={exportResults}
              size="sm"
              variant="outline"
              className="text-slate-300 border-slate-600 hover:bg-slate-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by IP, port, service, or banner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-slate-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">IP Address</TableHead>
                  <TableHead className="text-slate-300">Port</TableHead>
                  <TableHead className="text-slate-300">Service</TableHead>
                  <TableHead className="text-slate-300">State</TableHead>
                  <TableHead className="text-slate-300">Banner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result, index) => (
                  <TableRow key={index} className="border-slate-600 hover:bg-slate-600/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-blue-500" />
                        <span className="text-slate-300 font-mono">{result.ip}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-600 text-slate-300 font-mono">
                        {result.port}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getServiceBadgeColor(result.service)}>
                        {result.service}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-400">
                        {result.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm max-w-xs truncate">
                      {result.banner}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-8">
              <Server className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No results found matching your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
