
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Calendar, BarChart3, Users, AlertTriangle } from "lucide-react";

interface Vulnerability {
  id: string;
  severity: string;
  status: string;
  assetName: string;
  assignedTo?: string;
}

interface BitsightReportGeneratorProps {
  vulnerabilities: Vulnerability[];
}

export const BitsightReportGenerator = ({ vulnerabilities }: BitsightReportGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState("executive");
  const [timeRange, setTimeRange] = useState("30");
  const [includeSections, setIncludeSections] = useState({
    summary: true,
    trends: true,
    topAssets: true,
    teamPerformance: true,
    recommendations: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: "executive", label: "Executive Summary", icon: BarChart3 },
    { value: "technical", label: "Technical Report", icon: AlertTriangle },
    { value: "compliance", label: "Compliance Report", icon: FileText },
    { value: "team", label: "Team Performance", icon: Users }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock PDF generation - in real app this would generate actual PDF
    const reportData = {
      title: `Bitsight ${reportTypes.find(t => t.value === reportType)?.label} Report`,
      dateRange: `Last ${timeRange} days`,
      generatedAt: new Date().toLocaleString(),
      summary: {
        totalVulnerabilities: vulnerabilities.length,
        critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
        high: vulnerabilities.filter(v => v.severity === 'High').length,
        resolved: vulnerabilities.filter(v => v.status === 'Closed').length
      },
      sections: includeSections
    };

    // Create blob and download
    const reportContent = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitsight-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setIsGenerating(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Executive Report Generator
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Generate comprehensive reports for management and stakeholders
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Report Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {reportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Sections */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Include Sections</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries({
                summary: "Executive Summary",
                trends: "Vulnerability Trends",
                topAssets: "Top Risk Assets",
                teamPerformance: "Team Performance",
                recommendations: "Recommendations"
              }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={includeSections[key as keyof typeof includeSections]}
                    onCheckedChange={(checked) => 
                      setIncludeSections(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                  <label htmlFor={key} className="text-sm text-slate-300 cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h4 className="text-sm font-medium text-white mb-3">Report Preview</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Total Vulnerabilities:</span>
                <span>{vulnerabilities.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Issues:</span>
                <span className="text-red-400">
                  {vulnerabilities.filter(v => v.severity === 'Critical').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Resolved This Period:</span>
                <span className="text-green-400">
                  {vulnerabilities.filter(v => v.status === 'Closed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Report Format:</span>
                <span>PDF</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
