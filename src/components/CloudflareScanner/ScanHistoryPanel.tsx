
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, AlertTriangle, Globe, Eye } from "lucide-react";

interface ScanHistoryPanelProps {
  onClose: () => void;
}

export const ScanHistoryPanel = ({ onClose }: ScanHistoryPanelProps) => {
  // Mock historical scan data
  const scanHistory = [
    {
      id: "1",
      date: "2024-06-21",
      time: "10:30:00",
      newEntries: 12,
      removedEntries: 3,
      vulnerabilities: { total: 25, critical: 2, high: 5, medium: 8, low: 7, info: 3 },
      status: "completed"
    },
    {
      id: "2", 
      date: "2024-06-20",
      time: "10:15:00",
      newEntries: 8,
      removedEntries: 1,
      vulnerabilities: { total: 18, critical: 1, high: 3, medium: 6, low: 5, info: 3 },
      status: "completed"
    },
    {
      id: "3",
      date: "2024-06-19",
      time: "10:45:00", 
      newEntries: 15,
      removedEntries: 5,
      vulnerabilities: { total: 32, critical: 3, high: 7, medium: 12, low: 8, info: 2 },
      status: "completed"
    },
    {
      id: "4",
      date: "2024-06-18",
      time: "10:20:00",
      newEntries: 6,
      removedEntries: 2,
      vulnerabilities: { total: 14, critical: 0, high: 2, medium: 5, low: 4, info: 3 },
      status: "completed"
    },
    {
      id: "5",
      date: "2024-06-17",
      time: "10:10:00",
      newEntries: 22,
      removedEntries: 8,
      vulnerabilities: { total: 45, critical: 4, high: 9, medium: 18, low: 11, info: 3 },
      status: "completed"
    }
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "text-red-400",
      high: "text-orange-400",
      medium: "text-yellow-400", 
      low: "text-blue-400",
      info: "text-gray-400"
    };
    return colors[severity as keyof typeof colors] || "text-gray-400";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scan History
            </CardTitle>
            <CardDescription className="text-slate-400">
              Review previous Cloudflare discovery scans
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {scanHistory.map((scan) => (
              <Card key={scan.id} className="bg-slate-700 border-slate-600 hover:bg-slate-600/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-white font-medium">{scan.date}</p>
                        <p className="text-slate-400 text-sm">{scan.time}</p>
                      </div>
                      <Badge 
                        className={`${scan.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                      >
                        {scan.status}
                      </Badge>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-slate-300 border-slate-600 hover:bg-slate-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Globe className="h-4 w-4 text-green-500" />
                        <span className="text-slate-400 text-sm">New DNS</span>
                      </div>
                      <p className="text-green-400 font-bold">{scan.newEntries}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Globe className="h-4 w-4 text-red-500" />
                        <span className="text-slate-400 text-sm">Removed</span>
                      </div>
                      <p className="text-red-400 font-bold">{scan.removedEntries}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-slate-400 text-sm">Total Vulns</span>
                      </div>
                      <p className="text-orange-400 font-bold">{scan.vulnerabilities.total}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-slate-400 text-sm">Critical</span>
                      </div>
                      <p className="text-red-400 font-bold">{scan.vulnerabilities.critical}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">Severity breakdown:</span>
                      <div className="flex items-center gap-3">
                        <span className={`${getSeverityColor('critical')} font-medium`}>
                          C: {scan.vulnerabilities.critical}
                        </span>
                        <span className={`${getSeverityColor('high')} font-medium`}>
                          H: {scan.vulnerabilities.high}
                        </span>
                        <span className={`${getSeverityColor('medium')} font-medium`}>
                          M: {scan.vulnerabilities.medium}
                        </span>
                        <span className={`${getSeverityColor('low')} font-medium`}>
                          L: {scan.vulnerabilities.low}
                        </span>
                        <span className={`${getSeverityColor('info')} font-medium`}>
                          I: {scan.vulnerabilities.info}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
