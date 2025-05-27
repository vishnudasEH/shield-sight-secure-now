
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, AlertTriangle, CheckCircle, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { nessusService, NessusVulnerability, NessusAsset } from "@/services/nessusService";

export const NessusFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState<NessusVulnerability[]>([]);
  const [fileName, setFileName] = useState("");
  const [uploadedToDb, setUploadedToDb] = useState(false);
  const { toast } = useToast();

  const parseNessusXML = (xmlContent: string): { vulnerabilities: NessusVulnerability[], assets: NessusAsset[] } => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    
    const reportHosts = xmlDoc.querySelectorAll("ReportHost");
    const vulnerabilities: NessusVulnerability[] = [];
    const assetsMap = new Map<string, NessusAsset>();

    reportHosts.forEach(host => {
      const hostName = host.getAttribute("name") || "Unknown";
      const reportItems = host.querySelectorAll("ReportItem");

      // Extract host properties for asset creation
      const hostProperties = host.querySelectorAll("HostProperties tag");
      let ipAddress = "";
      let operatingSystem = "";
      let macAddress = "";
      let netbiosName = "";
      let fqdn = "";

      hostProperties.forEach(prop => {
        const name = prop.getAttribute("name");
        const value = prop.textContent || "";
        
        switch (name) {
          case "host-ip":
            ipAddress = value;
            break;
          case "operating-system":
            operatingSystem = value;
            break;
          case "mac-address":
            macAddress = value;
            break;
          case "netbios-name":
            netbiosName = value;
            break;
          case "host-fqdn":
            fqdn = value;
            break;
        }
      });

      // Create or update asset
      if (!assetsMap.has(hostName)) {
        assetsMap.set(hostName, {
          hostName,
          ipAddress,
          operatingSystem,
          macAddress,
          netbiosName,
          fqdn,
          vulnerabilityCount: 0
        });
      }

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

        // Increment vulnerability count for asset
        const asset = assetsMap.get(hostName);
        if (asset) {
          asset.vulnerabilityCount++;
        }
      });
    });

    return { vulnerabilities, assets: Array.from(assetsMap.values()) };
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
    setUploadedToDb(false);

    try {
      setUploadProgress(25);

      // Read file content
      const text = await file.text();
      setUploadProgress(50);

      // Parse XML content
      const { vulnerabilities: parsedVulns, assets } = parseNessusXML(text);
      setUploadProgress(75);

      // Save to database
      try {
        console.log('Creating upload session...');
        const session = await nessusService.createUploadSession(
          file.name,
          parsedVulns.length,
          assets.length
        );

        console.log('Saving vulnerabilities...');
        await nessusService.saveVulnerabilities(session.id, parsedVulns);
        
        console.log('Saving assets...');
        await nessusService.saveAssets(session.id, assets);

        setUploadedToDb(true);
        console.log('Data saved successfully to database');
      } catch (dbError) {
        console.error('Database save error:', dbError);
        toast({
          title: "Database Save Failed",
          description: "Data was parsed but couldn't be saved to database. Please check the console for details.",
          variant: "destructive",
        });
      }

      setVulnerabilities(parsedVulns);
      setUploadProgress(100);

      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded and parsed successfully. Found ${parsedVulns.length} vulnerabilities and ${assets.length} assets.`,
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
            Upload a .nessus XML file to parse and store vulnerability scan results in the database
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

          {uploadedToDb && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Database className="h-4 w-4" />
              <span>Data successfully saved to database</span>
            </div>
          )}

          <div className="text-sm text-slate-400">
            <p>Supported format: Nessus XML (.nessus) export files</p>
            <p>The file will be parsed and stored in the database for use across the application.</p>
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
              {uploadedToDb && (
                <span className="ml-2 text-green-400">• Saved to database</span>
              )}
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
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};
