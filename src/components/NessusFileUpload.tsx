
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NessusVulnerability {
  pluginId: string;
  pluginName: string;
  severity: string;
  host: string;
  port: string;
  protocol: string;
  description: string;
  solution: string;
  synopsis: string;
  cvssScore: string;
  cve: string[];
}

export const NessusFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState<NessusVulnerability[]>([]);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const parseNessusXML = (xmlContent: string): NessusVulnerability[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    
    const reportHosts = xmlDoc.querySelectorAll("ReportHost");
    const vulnerabilities: NessusVulnerability[] = [];

    reportHosts.forEach(host => {
      const hostName = host.getAttribute("name") || "Unknown";
      const reportItems = host.querySelectorAll("ReportItem");

      reportItems.forEach(item => {
        const pluginId = item.getAttribute("pluginID") || "";
        const pluginName = item.getAttribute("pluginName") || "";
        const severity = item.getAttribute("severity") || "0";
        const port = item.getAttribute("port") || "";
        const protocol = item.getAttribute("protocol") || "";

        // Extract additional details
        const description = item.querySelector("description")?.textContent || "";
        const solution = item.querySelector("solution")?.textContent || "";
        const synopsis = item.querySelector("synopsis")?.textContent || "";
        
        // Extract CVSS score
        const cvssBaseScore = item.querySelector("cvss_base_score")?.textContent || 
                             item.querySelector("cvss3_base_score")?.textContent || "N/A";
        
        // Extract CVE references
        const cveElements = item.querySelectorAll("cve");
        const cves: string[] = [];
        cveElements.forEach(cve => {
          if (cve.textContent) cves.push(cve.textContent);
        });

        vulnerabilities.push({
          pluginId,
          pluginName,
          severity: getSeverityText(severity),
          host: hostName,
          port,
          protocol,
          description,
          solution,
          synopsis,
          cvssScore: cvssBaseScore,
          cve: cves
        });
      });
    });

    return vulnerabilities;
  };

  const getSeverityText = (severity: string): string => {
    switch (severity) {
      case "4": return "Critical";
      case "3": return "High";
      case "2": return "Medium";
      case "1": return "Low";
      case "0": return "Info";
      default: return "Unknown";
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "Critical": return "bg-red-500/20 text-red-400";
      case "High": return "bg-orange-500/20 text-orange-400";
      case "Medium": return "bg-yellow-500/20 text-yellow-400";
      case "Low": return "bg-blue-500/20 text-blue-400";
      case "Info": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.nessus')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .nessus file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setFileName(file.name);

    try {
      setUploadProgress(25);

      // Read file content
      const text = await file.text();
      setUploadProgress(50);

      // Parse XML content
      const parsedVulnerabilities = parseNessusXML(text);
      setUploadProgress(75);

      setVulnerabilities(parsedVulnerabilities);
      setUploadProgress(100);

      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded and parsed successfully. Found ${parsedVulnerabilities.length} vulnerabilities.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to parse .nessus file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      event.target.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Nessus XML File
          </CardTitle>
          <CardDescription className="text-slate-400">
            Upload a .nessus XML file to parse and display vulnerability scan results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nessusFile" className="text-slate-300">
              Select .nessus File
            </Label>
            <Input
              id="nessusFile"
              type="file"
              accept=".nessus"
              onChange={handleFileUpload}
              disabled={uploading}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Processing {fileName}...</span>
                <span className="text-slate-400 text-sm">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="text-sm text-slate-400">
            <p>Supported format: Nessus XML (.nessus) export files</p>
            <p>The file will be parsed to extract vulnerability information and display it below.</p>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerabilities Table */}
      {vulnerabilities.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Parsed Vulnerabilities</CardTitle>
            <CardDescription className="text-slate-400">
              {vulnerabilities.length} vulnerabilities found in {fileName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-600 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-600 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">Plugin ID</TableHead>
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Severity</TableHead>
                    <TableHead className="text-slate-300">Host</TableHead>
                    <TableHead className="text-slate-300">Port</TableHead>
                    <TableHead className="text-slate-300">CVSS</TableHead>
                    <TableHead className="text-slate-300">CVE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vulnerabilities.slice(0, 50).map((vuln, index) => (
                    <TableRow key={index} className="border-slate-600 hover:bg-slate-700/50">
                      <TableCell className="text-slate-300 font-mono text-xs">
                        {vuln.pluginId}
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-xs">
                        <div className="truncate" title={vuln.pluginName}>
                          {vuln.pluginName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300 font-mono text-xs">
                        {vuln.host}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {vuln.port}/{vuln.protocol}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {vuln.cvssScore}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {vuln.cve.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {vuln.cve.slice(0, 2).map((cve, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {cve}
                              </Badge>
                            ))}
                            {vuln.cve.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{vuln.cve.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {vulnerabilities.length > 50 && (
              <div className="mt-4 text-center text-slate-400 text-sm">
                Showing first 50 of {vulnerabilities.length} vulnerabilities
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
