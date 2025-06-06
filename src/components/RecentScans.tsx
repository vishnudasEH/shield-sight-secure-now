
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ScanResult {
  id: string;
  scan_name: string;
  scan_type: string;
  created_at: string;
  vulnerabilities: number;
}

interface RecentScansProps {
  refreshTrigger: boolean;
}

export const RecentScans = ({ refreshTrigger }: RecentScansProps) => {
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    fetchRecentScans();
  }, [refreshTrigger]);

  const fetchRecentScans = async () => {
    try {
      const { data, error } = await supabase
        .from('nuclei_scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      const scansWithStats = await Promise.all(
        (data || []).map(async scan => {
          // Get vulnerability counts
          const { count, error: countError } = await supabase
            .from('nuclei_vulnerabilities')
            .select('*', { count: 'exact', head: true })
            .eq('scan_id', scan.id);
          
          if (countError) throw countError;
          
          return {
            ...scan,
            vulnerabilities: count || 0
          };
        })
      );
      
      setRecentScans(scansWithStats);
    } catch (error) {
      console.error('Error fetching recent scans:', error);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Nuclei Scans</CardTitle>
        <CardDescription className="text-slate-400">
          Monitor scan status and history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentScans.length === 0 ? (
            <div className="text-center py-6">
              <Scan className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <p className="text-slate-400">No recent scans</p>
            </div>
          ) : (
            recentScans.map((scan) => (
              <div key={scan.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm font-medium">{scan.scan_name}</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    Completed
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Type: {scan.scan_type}</div>
                  <div>Date: {new Date(scan.created_at).toLocaleString()}</div>
                  {scan.vulnerabilities > 0 ? (
                    <div className="text-orange-400">
                      {scan.vulnerabilities} vulnerabilities found
                    </div>
                  ) : (
                    <div className="text-green-400">
                      No vulnerabilities detected
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
