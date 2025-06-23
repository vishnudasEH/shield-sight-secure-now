
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Globe, Building, MapPin, Server } from "lucide-react";

interface Vulnerability {
  id: string;
  assetName: string;
  severity: string;
  tags: string[];
}

interface BitsightAssetFiltersProps {
  vulnerabilities: Vulnerability[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const BitsightAssetFilters = ({ vulnerabilities, activeFilter, onFilterChange }: BitsightAssetFiltersProps) => {
  const [activeTab, setActiveTab] = useState("application");

  // Mock asset grouping data - in real app this would come from API
  const assetGroups = useMemo(() => {
    const applications = {
      "E-Commerce Platform": vulnerabilities.filter(v => v.assetName.includes("web")).length,
      "Payment Gateway": vulnerabilities.filter(v => v.assetName.includes("api")).length,
      "Customer Portal": vulnerabilities.filter(v => v.assetName.includes("portal")).length,
      "Admin Dashboard": vulnerabilities.filter(v => v.assetName.includes("admin")).length
    };

    const businessUnits = {
      "Engineering": vulnerabilities.filter(v => v.tags.includes("eng")).length,
      "Operations": vulnerabilities.filter(v => v.tags.includes("ops")).length,
      "Security": vulnerabilities.filter(v => v.tags.includes("security")).length,
      "DevOps": vulnerabilities.filter(v => v.tags.includes("devops")).length
    };

    const geoLocations = {
      "US East": Math.floor(vulnerabilities.length * 0.4),
      "US West": Math.floor(vulnerabilities.length * 0.3),
      "Europe": Math.floor(vulnerabilities.length * 0.2),
      "Asia Pacific": Math.floor(vulnerabilities.length * 0.1)
    };

    const assetTypes = {
      "Web Servers": vulnerabilities.filter(v => v.assetName.includes("web")).length,
      "Database Servers": vulnerabilities.filter(v => v.assetName.includes("db")).length,
      "Load Balancers": vulnerabilities.filter(v => v.assetName.includes("load")).length,
      "API Gateways": vulnerabilities.filter(v => v.assetName.includes("api")).length
    };

    return { applications, businessUnits, geoLocations, assetTypes };
  }, [vulnerabilities]);

  const FilterGroup = ({ title, data, icon: Icon }: { title: string; data: Record<string, number>; icon: any }) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-400" />
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(data).map(([name, count]) => (
          <Button
            key={name}
            variant="ghost"
            className="justify-between p-3 h-auto text-left hover:bg-gray-800/50 border border-gray-700/50"
            onClick={() => onFilterChange(name.toLowerCase())}
          >
            <div>
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-gray-400">{count} vulnerabilities</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="neo-premium">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="h-5 w-5 text-green-400" />
          Asset Grouping & Filters
        </CardTitle>
        <CardDescription className="text-gray-400">
          Filter vulnerabilities by application, business unit, location, or asset type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="application" className="text-xs">Applications</TabsTrigger>
            <TabsTrigger value="business" className="text-xs">Business Units</TabsTrigger>
            <TabsTrigger value="location" className="text-xs">Locations</TabsTrigger>
            <TabsTrigger value="assets" className="text-xs">Asset Types</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="application" className="mt-0">
              <FilterGroup 
                title="Applications" 
                data={assetGroups.applications} 
                icon={Globe}
              />
            </TabsContent>
            
            <TabsContent value="business" className="mt-0">
              <FilterGroup 
                title="Business Units" 
                data={assetGroups.businessUnits} 
                icon={Building}
              />
            </TabsContent>
            
            <TabsContent value="location" className="mt-0">
              <FilterGroup 
                title="Geographic Locations" 
                data={assetGroups.geoLocations} 
                icon={MapPin}
              />
            </TabsContent>
            
            <TabsContent value="assets" className="mt-0">
              <FilterGroup 
                title="Asset Types" 
                data={assetGroups.assetTypes} 
                icon={Server}
              />
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Active Filters */}
        {activeFilter !== "all" && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Active Filter:</span>
                <Badge className="bg-blue-500/20 text-blue-400">
                  {activeFilter}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilterChange("all")}
                className="text-gray-400 hover:text-white"
              >
                Clear Filter
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
