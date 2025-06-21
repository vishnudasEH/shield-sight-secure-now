
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, AlertTriangle, Search, Shield, ExternalLink } from "lucide-react";

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

interface NucleiFindingsTabProps {
  summary: ScanSummary | null;
}

export const NucleiFindingsTab = ({ summary }: NucleiFindingsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  // Mock data from nuclei_results.txt parsing
  const nucleiFindings = [
    {
      template: "http-missing-security-headers",
      templateName: "Missing Security Headers",
      severity: "info",
      host: "https://192.168.1.100",
      endpoint: "/",
      matcher: "content-security-policy",
      description: "Missing Content Security Policy header",
      reference: ["https://owasp.org/www-project-secure-headers/"]
    },
    {
      template: "ssl-tls-version",
      templateName: "TLS Version Detection",
      severity: "low",
      host: "https://192.168.1.100:443",
      endpoint: "/",
      matcher: "tls-version",
      description: "TLS 1.2 detected",
      reference: ["https://tools.ietf.org/html/rfc5246"]
    },
    {
      template: "apache-version-disclosure",
      templateName: "Apache Version Disclosure",  
      severity: "low",
      host: "https://192.168.1.101",
      endpoint: "/",
      matcher: "version-disclosure",
      description: "Apache version disclosed in server header",
      reference: ["https://httpd.apache.org/docs/2.4/"]
    },
    {
      template: "cors-misconfig",
      templateName: "CORS Misconfiguration",
      severity: "medium",
      host: "https://192.168.1.102:8080",
      endpoint: "/api/v1",
      matcher: "cors-wildcard",
      description: "CORS allows access from any origin",
      reference: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"]
    },
    {
      template: "sql-injection",
      templateName: "SQL Injection",
      severity: "high",
      host: "https://10.0.0.50",
      endpoint: "/search.php",
      matcher: "sql-error",
      description: "SQL injection vulnerability detected",
      reference: ["https://owasp.org/www-community/attacks/SQL_Injection"]
    },
    {
      template: "rce-vulnerability",
      templateName: "Remote Code Execution",
      severity: "critical",
      host: "https://10.0.0.50",
      endpoint: "/upload.php",
      matcher: "rce-payload",
      description: "Remote code execution vulnerability found",
      reference: ["https://owasp.org/www-community/attacks/Code_Injection"]
    }
  ];

  const filteredFindings = nucleiFindings.filter(finding => {
    const matchesSearch = finding.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finding.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finding.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || finding.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const exportFindings = () => {
    const csvContent = "Template,Severity,Host,Endpoint,Description,Reference\n" + 
      nucleiFindings.map(finding => 
        `"${finding.templateName}","${finding.severity}","${finding.host}","${finding.endpoint}","${finding.description}","${finding.reference.join('; ')}"`
      ).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nuclei_findings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      critical: { color: "bg-red-500/20 text-red-400 border-red-500/50", icon: "🔴" },
      high: { color: "bg-orange-500/20 text-orange-400 border-orange-500/50", icon: "🟠" },
      medium: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", icon: "🟡" },
      low: { color: "bg-blue-500/20 text-blue-400 border-blue-500/50", icon: "🔵" },
      info: { color: "bg-gray-500/20 text-gray-400 border-gray-500/50", icon: "ℹ️" }
    };

    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.info;
    return (
      <Badge className={`${config.color} border`}>
        <span className="mr-1">{config.icon}</span>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const severityCounts = nucleiFindings.reduce((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(severityCounts).map(([severity, count]) => (
          <Card key={severity} className="bg-slate-700 border-slate-600">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm capitalize">{severity}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Findings Table */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Nuclei Vulnerability Findings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Security vulnerabilities discovered during scanning
              </CardDescription>
            </div>
            <Button
              onClick={exportFindings}
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search findings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-slate-300"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-slate-300">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-slate-300">Severity</TableHead>
                  <TableHead className="text-slate-300">Template</TableHead>
                  <TableHead className="text-slate-300">Host</TableHead>
                  <TableHead className="text-slate-300">Endpoint</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFindings.map((finding, index) => (
                  <TableRow key={index} className="border-slate-600 hover:bg-slate-600/50">
                    <TableCell>
                      {getSeverityBadge(finding.severity)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-slate-300 font-medium">{finding.templateName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-slate-300 bg-slate-800 px-2 py-1 rounded text-sm">
                        {finding.host}
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="text-slate-400 text-sm">{finding.endpoint}</code>
                    </TableCell>
                    <TableCell className="text-slate-400 max-w-xs truncate">
                      {finding.description}
                    </TableCell>
                    <TableCell>
                      {finding.reference.map((ref, idx) => (
                        <a
                          key={idx}
                          href={ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mr-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Ref
                        </a>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredFindings.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No findings match your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
