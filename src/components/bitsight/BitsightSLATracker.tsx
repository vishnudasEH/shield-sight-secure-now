
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, AlertTriangle, CheckCircle, Settings } from "lucide-react";

interface Vulnerability {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  firstDetected: string;
  status: 'Open' | 'In Progress' | 'Closed';
  title: string;
  assetName: string;
}

interface BitsightSLATrackerProps {
  vulnerabilities: Vulnerability[];
}

const SLA_RULES = {
  Critical: 7,   // 7 days
  High: 30,      // 30 days
  Medium: 90,    // 90 days
  Low: 180       // 180 days
};

export const BitsightSLATracker = ({ vulnerabilities }: BitsightSLATrackerProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [slaRules, setSlaRules] = useState(SLA_RULES);

  const slaAnalysis = useMemo(() => {
    const now = new Date();
    const analysis = {
      breached: [] as Array<Vulnerability & { daysOverdue: number }>,
      nearBreach: [] as Array<Vulnerability & { daysRemaining: number }>,
      onTrack: [] as Array<Vulnerability & { daysRemaining: number }>
    };

    vulnerabilities.filter(v => v.status !== 'Closed').forEach(vuln => {
      const detectedDate = new Date(vuln.firstDetected);
      const daysSinceDetected = Math.floor((now.getTime() - detectedDate.getTime()) / (1000 * 60 * 60 * 24));
      const slaLimit = slaRules[vuln.severity];
      const daysRemaining = slaLimit - daysSinceDetected;

      if (daysRemaining < 0) {
        analysis.breached.push({ ...vuln, daysOverdue: Math.abs(daysRemaining) });
      } else if (daysRemaining <= 3) {
        analysis.nearBreach.push({ ...vuln, daysRemaining });
      } else {
        analysis.onTrack.push({ ...vuln, daysRemaining });
      }
    });

    return analysis;
  }, [vulnerabilities, slaRules]);

  const getSLABadge = (type: 'breached' | 'nearBreach' | 'onTrack', value: number) => {
    switch (type) {
      case 'breached':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{value}d overdue</Badge>;
      case 'nearBreach':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{value}d left</Badge>;
      case 'onTrack':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{value}d left</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* SLA Breach Alert */}
      <Card className="neo-premium border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            SLA Breached ({slaAnalysis.breached.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            Vulnerabilities past their SLA deadline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {slaAnalysis.breached.map((vuln) => (
              <div key={vuln.id} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white truncate">{vuln.title}</h4>
                  {getSLABadge('breached', vuln.daysOverdue)}
                </div>
                <p className="text-xs text-gray-400">{vuln.assetName}</p>
                <Badge className="mt-1 bg-red-500/20 text-red-400 text-xs">
                  {vuln.severity}
                </Badge>
              </div>
            ))}
            {slaAnalysis.breached.length === 0 && (
              <p className="text-gray-400 text-center py-4">No SLA breaches</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Near SLA Breach */}
      <Card className="neo-premium border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Near Breach ({slaAnalysis.nearBreach.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            Vulnerabilities approaching SLA deadline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {slaAnalysis.nearBreach.map((vuln) => (
              <div key={vuln.id} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white truncate">{vuln.title}</h4>
                  {getSLABadge('nearBreach', vuln.daysRemaining)}
                </div>
                <p className="text-xs text-gray-400">{vuln.assetName}</p>
                <Badge className="mt-1 bg-yellow-500/20 text-yellow-400 text-xs">
                  {vuln.severity}
                </Badge>
              </div>
            ))}
            {slaAnalysis.nearBreach.length === 0 && (
              <p className="text-gray-400 text-center py-4">No near breaches</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SLA Settings & On Track */}
      <Card className="neo-premium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              On Track ({slaAnalysis.onTrack.length})
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            Vulnerabilities within SLA timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSettings ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">SLA Rules (Days)</h4>
              {Object.entries(slaRules).map(([severity, days]) => (
                <div key={severity} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{severity}:</span>
                  <Input
                    type="number"
                    value={days}
                    onChange={(e) => setSlaRules(prev => ({ ...prev, [severity]: parseInt(e.target.value) || 0 }))}
                    className="w-20 h-8 text-xs bg-gray-900 border-gray-700"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {slaAnalysis.onTrack.slice(0, 5).map((vuln) => (
                <div key={vuln.id} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white truncate">{vuln.title}</h4>
                    {getSLABadge('onTrack', vuln.daysRemaining)}
                  </div>
                  <p className="text-xs text-gray-400">{vuln.assetName}</p>
                  <Badge className="mt-1 bg-green-500/20 text-green-400 text-xs">
                    {vuln.severity}
                  </Badge>
                </div>
              ))}
              {slaAnalysis.onTrack.length === 0 && (
                <p className="text-gray-400 text-center py-4">No vulnerabilities on track</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
