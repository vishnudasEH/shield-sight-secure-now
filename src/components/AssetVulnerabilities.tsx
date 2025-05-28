
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, AlertTriangle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "./PaginationControls";

interface Vulnerability {
  id: string;
  plugin_id: string;
  plugin_name: string;
  severity: string;
  host: string;
  port: string;
  protocol: string;
  description: string;
  solution: string;
  synopsis: string;
  cvss_score: string;
  cve: string[];
  created_at: string;
}

interface AssetVulnerabilitiesProps {
  assetHost: string;
  onClose: () => void;
}

export const AssetVulnerabilities = ({ assetHost, onClose }: AssetVulnerabilitiesProps) => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  const {
    currentData: currentVulnerabilities,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    itemsPerPage,
    goToPage,
    hasNext,
    hasPrev
  } = usePagination({ data: vulnerabilities, itemsPerPage: 50 });

  useEffect(() => {
    fetchAssetVulnerabilities();
  }, [assetHost]);

  const fetchAssetVulnerabilities = async () => {
    try {
      const { data, error } = await supabase
        .from('nessus_vulnerabilities')
        .select('*')
        .eq('host', assetHost)
        .order('severity', { ascending: false });

      if (error) throw error;
      setVulnerabilities(data || []);
    } catch (error) {
      console.error('Error fetching asset vulnerabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "High": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Low": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Info": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading vulnerabilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose} className="border-slate-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assets
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white">Vulnerabilities for {assetHost}</h2>
          <p className="text-slate-400">{totalItems} vulnerabilities found</p>
        </div>
      </div>

      {totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      )}

      <div className="space-y-4">
        {currentVulnerabilities.map((vuln) => (
          <Card key={vuln.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{vuln.plugin_name}</h3>
                    <Badge className={getSeverityColor(vuln.severity)}>
                      {vuln.severity} ({vuln.cvss_score || 'N/A'})
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400 mb-3">
                    <div>Plugin ID: {vuln.plugin_id}</div>
                    <div>Port: {vuln.port}/{vuln.protocol}</div>
                  </div>

                  <p className="text-slate-300 text-sm">{vuln.synopsis || vuln.description}</p>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-600"
                  onClick={() => setSelectedVuln(vuln)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalItems > itemsPerPage && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      )}

      {totalItems === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-slate-300 text-lg font-medium mb-2">No vulnerabilities found</h3>
            <p className="text-slate-400">This asset has no recorded vulnerabilities.</p>
          </CardContent>
        </Card>
      )}

      {selectedVuln && (
        <Dialog open={!!selectedVuln} onOpenChange={() => setSelectedVuln(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedVuln.plugin_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium">Plugin ID</label>
                  <p className="text-slate-400">{selectedVuln.plugin_id}</p>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">CVSS Score</label>
                  <p className="text-slate-400">{selectedVuln.cvss_score || 'N/A'}</p>
                </div>
              </div>
              
              {selectedVuln.synopsis && (
                <div>
                  <label className="text-slate-300 font-medium">Synopsis</label>
                  <p className="text-slate-400 mt-1">{selectedVuln.synopsis}</p>
                </div>
              )}
              
              <div>
                <label className="text-slate-300 font-medium">Description</label>
                <p className="text-slate-400 mt-1">{selectedVuln.description}</p>
              </div>
              
              {selectedVuln.solution && (
                <div>
                  <label className="text-slate-300 font-medium">Solution</label>
                  <p className="text-slate-400 mt-1">{selectedVuln.solution}</p>
                </div>
              )}
              
              {selectedVuln.cve && selectedVuln.cve.length > 0 && (
                <div>
                  <label className="text-slate-300 font-medium">CVE References</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedVuln.cve.map((cveId, index) => (
                      <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                        {cveId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
