import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Server, Globe, Shield, Eye, BarChart3, Users, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { AssetVulnerabilities } from "./AssetVulnerabilities";
import { AssetOverview } from "./AssetOverview";
import { AssetGroups } from "./AssetGroups";
import { AllAssets } from "./AllAssets";

interface Asset {
  id: string;
  host_name: string;
  ip_address: string;
  operating_system: string;
  vulnerability_count: number;
  risk_score: number;
  mac_address: string;
  netbios_name: string;
  fqdn: string;
  created_at: string;
}

export const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [activeSubpage, setActiveSubpage] = useState("inventory");

  const subpages = [
    { id: "inventory", label: "Asset Inventory", icon: Database },
    { id: "overview", label: "Asset Overview", icon: BarChart3 },
    { id: "groups", label: "Asset Groups", icon: Users },
    { id: "all", label: "All Assets", icon: Server }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.host_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.netbios_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.fqdn?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const {
    currentData: currentAssets,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    hasNext,
    hasPrev
  } = usePagination({ data: filteredAssets, itemsPerPage: 100 });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('nessus_assets')
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

  const getRiskBadgeColor = (vulnCount: number) => {
    if (vulnCount >= 10) return "bg-red-500/20 text-red-400";
    if (vulnCount >= 5) return "bg-orange-500/20 text-orange-400";
    if (vulnCount >= 1) return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  const getRiskLabel = (vulnCount: number) => {
    if (vulnCount >= 10) return "Critical";
    if (vulnCount >= 5) return "High";
    if (vulnCount >= 1) return "Medium";
    return "Low";
  };

  const getAssetIcon = (osType: string) => {
    if (osType?.toLowerCase().includes('windows')) {
      return <Server className="h-4 w-4" />;
    } else if (osType?.toLowerCase().includes('linux')) {
      return <Server className="h-4 w-4" />;
    } else if (osType?.toLowerCase().includes('web')) {
      return <Globe className="h-4 w-4" />;
    }
    return <Shield className="h-4 w-4" />;
  };

  const handleAssetClick = (assetHost: string) => {
    setSelectedAsset(assetHost);
  };

  if (selectedAsset) {
    return (
      <AssetVulnerabilities 
        assetHost={selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />
    );
  }

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
          <h2 className="text-2xl font-bold text-white">Asset Management</h2>
          <p className="text-slate-400">Comprehensive asset visibility and vulnerability management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {totalItems} total assets
          </Badge>
        </div>
      </div>

      {/* Subpage Navigation */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {subpages.map((subpage) => (
              <Button
                key={subpage.id}
                variant={activeSubpage === subpage.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSubpage(subpage.id)}
                className={`flex items-center gap-2 ${
                  activeSubpage === subpage.id 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <subpage.icon className="h-4 w-4" />
                {subpage.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subpage Content */}
      {activeSubpage === "overview" && <AssetOverview />}
      {activeSubpage === "groups" && <AssetGroups />}
      {activeSubpage === "all" && <AllAssets />}

      {/* Original Asset Inventory Content */}
      {activeSubpage === "inventory" && (
        <div className="space-y-6">
          {/* Search */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assets by hostname, IP, or FQDN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              onNext={nextPage}
              onPrev={prevPage}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          )}

          {/* Assets Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Assets</CardTitle>
              <CardDescription className="text-slate-400">
                Complete inventory of discovered assets from Nessus scans. Click on an asset to view its vulnerabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400 text-lg mb-2">No assets found</p>
                  <p className="text-slate-500">Upload a Nessus file to discover assets or try adjusting your search</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Asset</TableHead>
                        <TableHead className="text-slate-300">IP Address</TableHead>
                        <TableHead className="text-slate-300">Operating System</TableHead>
                        <TableHead className="text-slate-300">Vulnerabilities</TableHead>
                        <TableHead className="text-slate-300">Risk Level</TableHead>
                        <TableHead className="text-slate-300">Last Scan</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentAssets.map((asset) => (
                        <TableRow key={asset.id} className="border-slate-700 hover:bg-slate-700/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getAssetIcon(asset.operating_system || '')}
                              <div>
                                <p className="text-slate-300 font-medium">{asset.host_name}</p>
                                {asset.netbios_name && asset.netbios_name !== asset.host_name && (
                                  <p className="text-xs text-slate-500">{asset.netbios_name}</p>
                                )}
                                {asset.fqdn && asset.fqdn !== asset.host_name && (
                                  <p className="text-xs text-slate-500">{asset.fqdn}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">{asset.ip_address || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {asset.operating_system || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                              {asset.vulnerability_count} vulnerabilities
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskBadgeColor(asset.vulnerability_count)}>
                              {getRiskLabel(asset.vulnerability_count)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400">
                            {new Date(asset.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600"
                              onClick={() => handleAssetClick(asset.host_name)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Vulnerabilities
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Pagination */}
          {totalItems > itemsPerPage && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              onNext={nextPage}
              onPrev={prevPage}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          )}
        </div>
      )}
    </div>
  );
};
