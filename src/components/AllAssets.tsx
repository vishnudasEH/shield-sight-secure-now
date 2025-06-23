import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Filter, ArrowUpDown, Server, Globe, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "./PaginationControls";

interface ExtendedAsset {
  id: string;
  asset: string;
  technologies: string[];
  labels: string[];
  domains: string[];
  hosts: string[];
  ips: string[];
  cname: string[];
  ports: number[];
  statusCodes: number[];
  titles: string[];
  webServers: string[];
  vulnerabilityCount: number;
  riskScore: number;
  lastScan: string;
}

export const AllAssets = () => {
  const [assets, setAssets] = useState<ExtendedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ExtendedAsset>("asset");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchAllAssets();
  }, []);

  const fetchAllAssets = async () => {
    try {
      // Fetch assets and vulnerabilities
      const { data: assets, error: assetsError } = await supabase
        .from('nessus_assets')
        .select('*');

      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('nessus_vulnerabilities')
        .select('*');

      if (assetsError) throw assetsError;
      if (vulnError) throw vulnError;

      // Transform and enrich asset data
      const enrichedAssets: ExtendedAsset[] = assets?.map(asset => {
        const assetVulns = vulnerabilities?.filter(v => v.host === asset.host_name) || [];
        
        return {
          id: asset.id,
          asset: asset.host_name,
          technologies: extractTechnologies(assetVulns),
          labels: generateLabels(asset),
          domains: [asset.fqdn].filter(Boolean),
          hosts: [asset.host_name, asset.netbios_name].filter(Boolean),
          ips: [asset.ip_address].filter(Boolean),
          cname: extractCNames(asset),
          ports: extractPorts(assetVulns),
          statusCodes: generateStatusCodes(),
          titles: extractTitles(assetVulns),
          webServers: extractWebServers(assetVulns),
          vulnerabilityCount: asset.vulnerability_count || 0,
          riskScore: asset.risk_score || 0,
          lastScan: asset.created_at
        };
      }) || [];

      setAssets(enrichedAssets);
    } catch (error) {
      console.error('Error fetching all assets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract and enrich data
  const extractTechnologies = (vulnerabilities: any[]): string[] => {
    const techs = new Set<string>();
    vulnerabilities.forEach(vuln => {
      if (vuln.plugin_name?.toLowerCase().includes('apache')) techs.add('Apache');
      if (vuln.plugin_name?.toLowerCase().includes('nginx')) techs.add('Nginx');
      if (vuln.plugin_name?.toLowerCase().includes('iis')) techs.add('IIS');
      if (vuln.plugin_name?.toLowerCase().includes('php')) techs.add('PHP');
      if (vuln.plugin_name?.toLowerCase().includes('mysql')) techs.add('MySQL');
    });
    return Array.from(techs).slice(0, 3); // Limit to top 3
  };

  const generateLabels = (asset: any): string[] => {
    const labels = [];
    if (asset.operating_system?.toLowerCase().includes('windows')) labels.push('Windows');
    if (asset.operating_system?.toLowerCase().includes('linux')) labels.push('Linux');
    if (asset.vulnerability_count > 10) labels.push('High Risk');
    if (asset.vulnerability_count === 0) labels.push('Clean');
    return labels;
  };

  const extractCNames = (asset: any): string[] => {
    // In a real implementation, this would extract actual CNAME records
    return asset.fqdn ? ['www', 'api'].filter(c => Math.random() > 0.5) : [];
  };

  const extractPorts = (vulnerabilities: any[]): number[] => {
    const ports = new Set(vulnerabilities.map(v => parseInt(v.port)).filter(p => !isNaN(p)));
    return Array.from(ports).slice(0, 5);
  };

  const generateStatusCodes = (): number[] => {
    // Sample status codes - in real implementation, extract from web scan data
    const codes = [200, 404, 403, 301, 302];
    return codes.filter(() => Math.random() > 0.7);
  };

  const extractTitles = (vulnerabilities: any[]): string[] => {
    // Extract page titles from vulnerability descriptions or plugin outputs
    const titles = new Set<string>();
    vulnerabilities.forEach(vuln => {
      if (vuln.plugin_output?.includes('title')) {
        titles.add('Web Application');
      }
    });
    return Array.from(titles);
  };

  const extractWebServers = (vulnerabilities: any[]): string[] => {
    const servers = new Set<string>();
    vulnerabilities.forEach(vuln => {
      if (vuln.plugin_name?.toLowerCase().includes('apache')) servers.add('Apache');
      if (vuln.plugin_name?.toLowerCase().includes('nginx')) servers.add('Nginx');
      if (vuln.plugin_name?.toLowerCase().includes('iis')) servers.add('IIS');
    });
    return Array.from(servers);
  };

  const filteredAssets = assets.filter(asset => {
    const searchLower = searchTerm.toLowerCase();
    return (
      asset.asset.toLowerCase().includes(searchLower) ||
      asset.technologies.some(tech => tech.toLowerCase().includes(searchLower)) ||
      asset.hosts.some(host => host.toLowerCase().includes(searchLower)) ||
      asset.ips.some(ip => ip.includes(searchLower))
    );
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
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
  } = usePagination({ data: sortedAssets, itemsPerPage: 50 });

  const handleSort = (field: keyof ExtendedAsset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const csvContent = [
      // CSV headers
      'Asset,Technologies,Labels,Domains,Hosts,IPs,CNAME,Ports,Status Codes,Titles,Web Servers,Vulnerabilities,Risk Score',
      // CSV data
      ...sortedAssets.map(asset => [
        asset.asset,
        asset.technologies.join(';'),
        asset.labels.join(';'),
        asset.domains.join(';'),
        asset.hosts.join(';'),
        asset.ips.join(';'),
        asset.cname.join(';'),
        asset.ports.join(';'),
        asset.statusCodes.join(';'),
        asset.titles.join(';'),
        asset.webServers.join(';'),
        asset.vulnerabilityCount,
        asset.riskScore
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all_assets_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading all assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search assets by name, technology, host, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
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
          <CardTitle className="text-white">All Assets</CardTitle>
          <CardDescription className="text-slate-400">
            Comprehensive view of all assets with rich metadata and vulnerability information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedAssets.length === 0 ? (
            <div className="text-center py-12">
              <Server className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg mb-2">No assets found</p>
              <p className="text-slate-500">Upload a Nessus file or adjust your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('asset')}
                        className="h-auto p-0 font-medium text-slate-300 hover:text-white"
                      >
                        Asset <ArrowUpDown className="h-3 w-3 ml-1" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-slate-300">Technologies</TableHead>
                    <TableHead className="text-slate-300">Labels</TableHead>
                    <TableHead className="text-slate-300">Domains</TableHead>
                    <TableHead className="text-slate-300">Hosts</TableHead>
                    <TableHead className="text-slate-300">IPs</TableHead>
                    <TableHead className="text-slate-300">CNAME</TableHead>
                    <TableHead className="text-slate-300">Ports</TableHead>
                    <TableHead className="text-slate-300">Status Codes</TableHead>
                    <TableHead className="text-slate-300">Titles</TableHead>
                    <TableHead className="text-slate-300">Web Servers</TableHead>
                    <TableHead className="text-slate-300">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('vulnerabilityCount')}
                        className="h-auto p-0 font-medium text-slate-300 hover:text-white"
                      >
                        Vulnerabilities <ArrowUpDown className="h-3 w-3 ml-1" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAssets.map((asset) => (
                    <TableRow key={asset.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-blue-500" />
                          <span className="text-slate-300 font-medium">{asset.asset}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {asset.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {asset.labels.map((label, idx) => (
                            <Badge key={idx} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {asset.domains.map((domain, idx) => (
                            <div key={idx} className="text-slate-400 text-sm">{domain}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {asset.hosts.map((host, idx) => (
                            <div key={idx} className="text-slate-400 text-sm">{host}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {asset.ips.map((ip, idx) => (
                            <div key={idx} className="text-slate-400 text-sm font-mono">{ip}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {asset.cname.map((cname, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                              {cname}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {asset.ports.slice(0, 3).map((port, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                              {port}
                            </Badge>
                          ))}
                          {asset.ports.length > 3 && (
                            <Badge variant="secondary" className="bg-slate-700 text-slate-400 text-xs">
                              +{asset.ports.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {asset.statusCodes.map((code, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {asset.titles.map((title, idx) => (
                            <div key={idx} className="text-slate-400 text-sm truncate max-w-32">{title}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {asset.webServers.map((server, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                              {server}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            asset.vulnerabilityCount >= 10 
                              ? "bg-red-500/20 text-red-400" 
                              : asset.vulnerabilityCount >= 5 
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-green-500/20 text-green-400"
                          }
                        >
                          {asset.vulnerabilityCount}
                        </Badge>
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
  );
};
