
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Minus, Globe } from "lucide-react";

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

interface DNSChangesTabProps {
  summary: ScanSummary | null;
}

export const DNSChangesTab = ({ summary }: DNSChangesTabProps) => {
  // Mock data for demonstration
  const newEntries = [
    { domain: "api.example.com", type: "A", ip: "192.168.1.100", timestamp: "2024-06-21 10:30:00" },
    { domain: "staging.example.com", type: "CNAME", ip: "prod.example.com", timestamp: "2024-06-21 10:31:15" },
    { domain: "test.api.example.com", type: "A", ip: "192.168.1.101", timestamp: "2024-06-21 10:32:30" },
    { domain: "dev.example.com", type: "A", ip: "10.0.0.50", timestamp: "2024-06-21 10:33:45" },
  ];

  const removedEntries = [
    { domain: "old.example.com", type: "A", ip: "192.168.1.99", timestamp: "2024-06-21 10:30:00" },
    { domain: "legacy.api.example.com", type: "CNAME", ip: "old.example.com", timestamp: "2024-06-21 10:31:00" },
  ];

  const exportNewEntries = () => {
    const csvContent = "Domain,Type,Value,Timestamp\n" + 
      newEntries.map(entry => `${entry.domain},${entry.type},${entry.ip},${entry.timestamp}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `new_dns_entries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportRemovedEntries = () => {
    const csvContent = "Domain,Type,Value,Timestamp\n" + 
      removedEntries.map(entry => `${entry.domain},${entry.type},${entry.ip},${entry.timestamp}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `removed_dns_entries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">New DNS Entries</p>
                <p className="text-2xl font-bold text-green-400">{summary?.new_entries || 0}</p>
              </div>
              <Plus className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Removed DNS Entries</p>
                <p className="text-2xl font-bold text-red-400">{summary?.removed_entries || 0}</p>
              </div>
              <Minus className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Entries Table */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                New DNS Entries
              </CardTitle>
              <CardDescription className="text-slate-400">
                Recently discovered DNS records
              </CardDescription>
            </div>
            <Button
              onClick={exportNewEntries}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">Domain</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Value</TableHead>
                  <TableHead className="text-slate-300">Discovered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newEntries.map((entry, index) => (
                  <TableRow key={index} className="border-slate-600 hover:bg-slate-600/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <span className="text-slate-300 font-medium">{entry.domain}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{entry.ip}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{entry.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Removed Entries Table */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Minus className="h-5 w-5 text-red-500" />
                Removed DNS Entries
              </CardTitle>
              <CardDescription className="text-slate-400">
                DNS records no longer present
              </CardDescription>
            </div>
            <Button
              onClick={exportRemovedEntries}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">Domain</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Value</TableHead>
                  <TableHead className="text-slate-300">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {removedEntries.map((entry, index) => (
                  <TableRow key={index} className="border-slate-600 hover:bg-slate-600/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-slate-300 font-medium line-through">{entry.domain}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{entry.ip}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{entry.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
