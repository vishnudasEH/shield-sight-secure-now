
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Server, Globe, Shield, AlertTriangle, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  ip_address: string;
  hostname: string;
  operating_system: string;
  environment: string;
  business_unit: string;
  location: string;
  owner_email: string;
  risk_score: number;
  last_scan_date: string;
  created_at: string;
}

export const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterEnvironment, setFilterEnvironment] = useState("all");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.hostname?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || asset.asset_type === filterType;
    const matchesEnvironment = filterEnvironment === "all" || asset.environment === filterEnvironment;
    
    return matchesSearch && matchesType && matchesEnvironment;
  });

  const getRiskBadgeColor = (riskScore: number) => {
    if (riskScore >= 8) return "bg-red-500/20 text-red-400";
    if (riskScore >= 6) return "bg-orange-500/20 text-orange-400";
    if (riskScore >= 4) return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  const getRiskLabel = (riskScore: number) => {
    if (riskScore >= 8) return "Critical";
    if (riskScore >= 6) return "High";
    if (riskScore >= 4) return "Medium";
    return "Low";
  };

  const getAssetIcon = (assetType: string) => {
    switch (assetType?.toLowerCase()) {
      case 'server':
        return <Server className="h-4 w-4" />;
      case 'web application':
        return <Globe className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const uniqueTypes = [...new Set(assets.map(a => a.asset_type).filter(Boolean))];
  const uniqueEnvironments = [...new Set(assets.map(a => a.environment).filter(Boolean))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Asset Inventory</h2>
          <p className="text-slate-400">Manage and monitor your IT assets</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {filteredAssets.length} assets
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assets by name, IP, or hostname..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterEnvironment} onValueChange={setFilterEnvironment}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all" className="text-white">All Environments</SelectItem>
                  {uniqueEnvironments.map(env => (
                    <SelectItem key={env} value={env} className="text-white">
                      {env}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Assets</CardTitle>
          <CardDescription className="text-slate-400">
            Complete inventory of your IT infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg mb-2">No assets found</p>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Asset</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">IP Address</TableHead>
                    <TableHead className="text-slate-300">Environment</TableHead>
                    <TableHead className="text-slate-300">Risk Score</TableHead>
                    <TableHead className="text-slate-300">Last Scan</TableHead>
                    <TableHead className="text-slate-300">Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getAssetIcon(asset.asset_type)}
                          <div>
                            <p className="text-slate-300 font-medium">{asset.name}</p>
                            {asset.hostname && (
                              <p className="text-xs text-slate-500">{asset.hostname}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {asset.asset_type || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">{asset.ip_address}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                          {asset.environment || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {asset.risk_score ? (
                          <Badge className={getRiskBadgeColor(asset.risk_score)}>
                            {getRiskLabel(asset.risk_score)} ({asset.risk_score})
                          </Badge>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {asset.last_scan_date 
                          ? new Date(asset.last_scan_date).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {asset.owner_email || 'Unassigned'}
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
