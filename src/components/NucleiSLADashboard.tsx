
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, CheckCircle, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { nucleiService, SLASummary } from "@/services/nucleiService";

export const NucleiSLADashboard = () => {
  const [slaSummary, setSLASummary] = useState<SLASummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSLAData = async () => {
      try {
        const summary = await nucleiService.getSLASummary();
        setSLASummary(summary);
      } catch (error: any) {
        console.error("Error fetching SLA data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load SLA data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSLAData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!slaSummary) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-slate-300">No SLA data available</h3>
      </div>
    );
  }

  const severityColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#3b82f6',
    info: '#6b7280',
    unknown: '#94a3b8'
  };

  const getAgeRangeColor = (ageRange: string): string => {
    if (ageRange.includes('0-7')) return '#10b981'; // green
    if (ageRange.includes('8-14')) return '#3b82f6'; // blue
    if (ageRange.includes('15-30')) return '#eab308'; // yellow
    if (ageRange.includes('31-60')) return '#f97316'; // orange
    return '#ef4444'; // red for 60+
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SLA Status Overview */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">SLA Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-slate-300">SLA Breached</span>
                </div>
                <Badge className="bg-red-500/20 text-red-400">{slaSummary.statusCounts.breached}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-slate-300">Due Soon (≤3 days)</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400">{slaSummary.statusCounts.dueSoon}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">Within SLA</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">{slaSummary.statusCounts.withinSLA}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaSummary.severityDistribution}>
                  <XAxis dataKey="severity" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                  />
                  <Bar dataKey="count" name="Count">
                    {slaSummary.severityDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={severityColors[entry.severity.toLowerCase()] || '#94a3b8'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Aging Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Aging Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaSummary.agingDistribution}>
                  <XAxis dataKey="ageRange" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                  />
                  <Bar dataKey="count" name="Vulnerabilities">
                    {slaSummary.agingDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getAgeRangeColor(entry.ageRange)} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignee Distribution */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Assignee Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slaSummary.assigneeDistribution}>
                <XAxis dataKey="assignee" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                />
                <Bar dataKey="count" name="Assigned Vulnerabilities" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
