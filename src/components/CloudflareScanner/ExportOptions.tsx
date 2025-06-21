
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Table, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ExportOptionsProps {
  scanSummary: ScanSummary | null;
}

export const ExportOptions = ({ scanSummary }: ExportOptionsProps) => {
  const { toast } = useToast();

  const exportJSON = () => {
    if (!scanSummary) return;
    
    const jsonContent = JSON.stringify(scanSummary, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan_summary_${scanSummary.date}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "JSON summary exported successfully.",
    });
  };

  const exportCSV = () => {
    if (!scanSummary) return;
    
    const csvContent = [
      "Metric,Value",
      `Scan Date,${scanSummary.date}`,
      `New DNS Entries,${scanSummary.new_entries}`,
      `Removed DNS Entries,${scanSummary.removed_entries}`,
      `Total Vulnerabilities,${scanSummary.vulnerabilities.total}`,
      `Critical Vulnerabilities,${scanSummary.vulnerabilities.critical}`,
      `High Vulnerabilities,${scanSummary.vulnerabilities.high}`,
      `Medium Vulnerabilities,${scanSummary.vulnerabilities.medium}`,
      `Low Vulnerabilities,${scanSummary.vulnerabilities.low}`,
      `Info Vulnerabilities,${scanSummary.vulnerabilities.info}`
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan_summary_${scanSummary.date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "CSV summary exported successfully.",
    });
  };

  const exportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here with a library like jsPDF.",
    });
  };

  const downloadRawFiles = () => {
    // In a real implementation, this would create a zip file with all raw scan files
    toast({
      title: "Raw Files Download",
      description: "This would download a zip containing records.txt, alive_hosts.txt, nmap_output.gnmap, and nuclei_results.txt",
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Options
        </CardTitle>
        <CardDescription className="text-slate-400">
          Download scan results in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={exportJSON}
          disabled={!scanSummary}
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export JSON Summary
        </Button>
        
        <Button
          onClick={exportCSV}
          disabled={!scanSummary}
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          <Table className="h-4 w-4 mr-2" />
          Export CSV Report
        </Button>
        
        <Button
          onClick={exportPDF}
          disabled={!scanSummary}
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export PDF Report
        </Button>
        
        <Button
          onClick={downloadRawFiles}
          disabled={!scanSummary}
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          <Archive className="h-4 w-4 mr-2" />
          Download Raw Files
        </Button>
        
        <div className="pt-2 border-t border-slate-600">
          <p className="text-xs text-slate-500">
            Raw files include: records.txt, alive_hosts.txt, nmap_output.gnmap, nuclei_results.txt
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
