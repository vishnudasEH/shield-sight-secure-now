
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface ScanType {
  id: string;
  name: string;
  path: string;
  description: string;
}

interface ScanConfigurationProps {
  selectedScanType: string;
  setSelectedScanType: (type: string) => void;
  scanName: string;
  setScanName: (name: string) => void;
  targetInputs: string;
  setTargetInputs: (inputs: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const scanTypes: ScanType[] = [
  { 
    id: "quick", 
    name: "Quick Scan", 
    path: "/nuclei-templates/passive/cves",
    description: "Passive CVE detection scan" 
  },
  { 
    id: "cve", 
    name: "CVE Scan", 
    path: "/nuclei_templates/http/CVE/",
    description: "Comprehensive CVE vulnerability scan" 
  },
  { 
    id: "full", 
    name: "Full Scan", 
    path: "/nuclei_templates/",
    description: "Complete nuclei template scan" 
  },
  { 
    id: "subdomain", 
    name: "Subdomain Takeover", 
    path: "/nuclei-templates/http/takeovers/",
    description: "Subdomain takeover vulnerability scan" 
  },
];

const restrictSpaces = (value: string) => {
  return value.replace(/\s/g, '');
};

export const ScanConfiguration = ({
  selectedScanType,
  setSelectedScanType,
  scanName,
  setScanName,
  targetInputs,
  setTargetInputs,
  onFileUpload
}: ScanConfigurationProps) => {
  return (
    <div className="space-y-6">
      {/* Scan Type Selection */}
      <div>
        <Label className="text-slate-300 mb-3 block">Scan Type</Label>
        <Select value={selectedScanType} onValueChange={setSelectedScanType}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {scanTypes.map((type) => (
              <SelectItem key={type.id} value={type.id} className="text-white">
                <div>
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs text-slate-400">{type.path}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 mt-1">
          {scanTypes.find(type => type.id === selectedScanType)?.description}
        </p>
      </div>

      {/* Scan Options */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="scanName" className="text-slate-300">Scan Name</Label>
          <Input
            id="scanName"
            placeholder="Enter scan name (no spaces)"
            value={scanName}
            onChange={(e) => setScanName(restrictSpaces(e.target.value))}
            className="bg-slate-700 border-slate-600 text-white mt-1"
          />
        </div>

        <div>
          <Label htmlFor="targets" className="text-slate-300">Target IPs or URLs</Label>
          <Textarea
            id="targets"
            placeholder="Enter targets (one per line)&#10;example.com&#10;192.168.1.100&#10;subdomain.example.com"
            value={targetInputs}
            onChange={(e) => setTargetInputs(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white mt-1 min-h-[100px]"
          />
          <div className="flex items-center gap-2 mt-2">
            <Label htmlFor="targetFile" className="text-slate-400 text-sm cursor-pointer flex items-center gap-1">
              <Upload className="h-3 w-3" />
              Upload .txt file
            </Label>
            <Input
              id="targetFile"
              type="file"
              accept=".txt"
              onChange={onFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
