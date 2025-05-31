
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Upload, Database, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AssetGroup {
  id: string;
  projectName: string;
  source: string;
  totalAssets: number;
  duration: string;
  lastUpdated: string;
  status: 'active' | 'completed' | 'pending';
}

export const AssetGroups = () => {
  const [groups, setGroups] = useState<AssetGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssetGroups();
  }, []);

  const fetchAssetGroups = async () => {
    try {
      // Fetch upload sessions to create groups
      const { data: sessions, error } = await supabase
        .from('nessus_upload_sessions')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;

      // Transform sessions into asset groups
      const assetGroups: AssetGroup[] = sessions?.map(session => ({
        id: session.id,
        projectName: session.filename || 'Unnamed Project',
        source: 'Auto Discovery',
        totalAssets: session.total_assets || 0,
        duration: '--',
        lastUpdated: formatTimeDifference(session.upload_date),
        status: 'completed' as const
      })) || [];

      // Add sample data for demonstration
      if (assetGroups.length === 0) {
        assetGroups.push({
          id: 'sample-1',
          projectName: 'test project nessus',
          source: 'Auto Discovery',
          totalAssets: 155,
          duration: '--',
          lastUpdated: '2mo ago',
          status: 'completed'
        });
      }

      setGroups(assetGroups);
    } catch (error) {
      console.error('Error fetching asset groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeDifference = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
      return `${diffMonths}mo ago`;
    } else if (diffWeeks > 0) {
      return `${diffWeeks}w ago`;
    } else if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else {
      return 'Today';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-500/20 text-green-400", label: "Active" },
      completed: { color: "bg-blue-500/20 text-blue-400", label: "Completed" },
      pending: { color: "bg-yellow-500/20 text-yellow-400", label: "Pending" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'auto discovery':
        return <Database className="h-4 w-4" />;
      case 'manual upload':
        return <Upload className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading asset groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Groups</p>
                <p className="text-2xl font-bold text-white">{groups.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Assets</p>
                <p className="text-2xl font-bold text-white">
                  {groups.reduce((sum, group) => sum + group.totalAssets, 0)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Sources</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(groups.map(g => g.source)).size}
                </p>
              </div>
              <Upload className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Groups Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Asset Groups</CardTitle>
          <CardDescription className="text-slate-400">
            Grouped discovery sources showing asset collections from different scans and uploads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg mb-2">No asset groups found</p>
              <p className="text-slate-500">Upload a Nessus file or run a scan to create asset groups</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Project Name</TableHead>
                    <TableHead className="text-slate-300">Source</TableHead>
                    <TableHead className="text-slate-300">Total Assets</TableHead>
                    <TableHead className="text-slate-300">Duration</TableHead>
                    <TableHead className="text-slate-300">Last Updated</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-slate-300 font-medium">{group.projectName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSourceIcon(group.source)}
                          <span className="text-slate-300">{group.source}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                          {group.totalAssets} assets
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">{group.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-400">{group.lastUpdated}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(group.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
