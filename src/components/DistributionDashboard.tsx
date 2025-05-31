
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Clock, Download, Expand } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChartData {
  name: string;
  value: number;
  percentage: number;
  version?: string;
  color: string;
}

interface DistributionData {
  technologies: ChartData[];
  webservers: ChartData[];
  ports: ChartData[];
  statusCodes: ChartData[];
  pageTitles: ChartData[];
  cnames: ChartData[];
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#d946ef', '#f43f5e', '#22c55e', '#a855f7'
];

export const DistributionDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDistribution, setSelectedDistribution] = useState<string | null>(null);
  const [distributionData, setDistributionData] = useState<DistributionData>({
    technologies: [],
    webservers: [],
    ports: [],
    statusCodes: [],
    pageTitles: [],
    cnames: []
  });

  useEffect(() => {
    fetchDistributionData();
  }, []);

  const fetchDistributionData = async () => {
    try {
      // Fetch vulnerabilities for technology analysis
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('nessus_vulnerabilities')
        .select('plugin_name, host');

      if (vulnError) throw vulnError;

      // Generate distribution data based on available database information
      const generateDistribution = (items: string[], colorOffset = 0): ChartData[] => {
        const counts = items.reduce((acc, item) => {
          const cleanItem = item?.trim() || 'Unknown';
          acc[cleanItem] = (acc[cleanItem] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const total = items.length;
        return Object.entries(counts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([name, value], index) => ({
            name,
            value,
            percentage: Math.round((value / total) * 100),
            color: COLORS[(index + colorOffset) % COLORS.length]
          }));
      };

      // Extract technologies from plugin names
      const techNames = vulnerabilities?.map(v => {
        const plugin = v.plugin_name || '';
        // Extract technology names from plugin descriptions
        if (plugin.toLowerCase().includes('apache')) return 'Apache';
        if (plugin.toLowerCase().includes('nginx')) return 'Nginx';
        if (plugin.toLowerCase().includes('mysql')) return 'MySQL';
        if (plugin.toLowerCase().includes('php')) return 'PHP';
        if (plugin.toLowerCase().includes('ssl')) return 'SSL/TLS';
        if (plugin.toLowerCase().includes('ssh')) return 'SSH';
        if (plugin.toLowerCase().includes('ftp')) return 'FTP';
        if (plugin.toLowerCase().includes('dns')) return 'DNS';
        if (plugin.toLowerCase().includes('smtp')) return 'SMTP';
        if (plugin.toLowerCase().includes('http')) return 'HTTP';
        return 'Other';
      }) || [];

      // Sample data for other distributions (in real implementation, these would come from actual scan data)
      const sampleWebservers = ['Apache/2.4.41', 'Nginx/1.18.0', 'IIS/10.0', 'Tomcat/9.0.30', 'Lighttpd/1.4', 'Apache/2.2.34', 'Nginx/1.16.1', 'Express/4.17', 'Kestrel/5.0'];
      const samplePorts = ['80', '443', '22', '21', '25', '53', '110', '143', '993', '995', '3389', '1433', '3306', '5432'];
      const sampleStatusCodes = ['200', '404', '403', '301', '302', '500', '503', '401', '429', '502', '400', '504'];
      const samplePageTitles = ['Home Page', 'Login Portal', 'Admin Dashboard', 'About Us', 'Contact Form', 'User Profile', 'Settings', 'Help Center', 'Documentation'];
      const sampleCnames = ['www', 'api', 'cdn', 'mail', 'ftp', 'admin', 'blog', 'shop', 'support', 'staging', 'dev', 'test'];

      setDistributionData({
        technologies: generateDistribution(techNames, 0),
        webservers: generateDistribution(sampleWebservers, 2),
        ports: generateDistribution(samplePorts, 4),
        statusCodes: generateDistribution(sampleStatusCodes, 6),
        pageTitles: generateDistribution(samplePageTitles, 8),
        cnames: generateDistribution(sampleCnames, 10)
      });

    } catch (error) {
      console.error('Error fetching distribution data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (distributionType: string) => {
    const data = distributionData[distributionType as keyof DistributionData];
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Count,Percentage\n"
      + data.map(item => `${item.name},${item.value},${item.percentage}%`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${distributionType}_distribution.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDonutChart = (data: ChartData[], title: string, distributionKey: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <Card className="bg-slate-800 border-slate-700 relative rounded-xl shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-lg">{title}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">Distribution overview</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport(distributionKey)}
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                <Clock className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport(distributionKey)}
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value} (${props.payload.percentage}%)`, 
                    name
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{total}</div>
                <div className="text-sm text-slate-400">Total</div>
              </div>
            </div>
          </div>
          
          {/* Expand button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDistribution(distributionKey)}
            className="absolute bottom-4 right-4 text-slate-400 hover:text-white h-8 w-8 p-0"
          >
            <Expand className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderExpandedModal = () => {
    if (!selectedDistribution) return null;
    
    const data = distributionData[selectedDistribution as keyof DistributionData];
    const title = selectedDistribution.charAt(0).toUpperCase() + selectedDistribution.slice(1);
    
    return (
      <Dialog open={!!selectedDistribution} onOpenChange={() => setSelectedDistribution(null)}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{title} Distribution</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="lg:col-span-2">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} (${props.payload.percentage}%)`, 
                        name
                      ]}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-lg">Legend</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/50">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{item.name}</div>
                      {item.version && (
                        <div className="text-slate-400 text-sm">{item.version}</div>
                      )}
                      <div className="text-slate-300 text-sm">
                        {item.value} assets ({item.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-slate-400 mt-2">Loading distribution data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {renderDonutChart(distributionData.technologies, "Technology Distribution", "technologies")}
        {renderDonutChart(distributionData.webservers, "Webserver Distribution", "webservers")}
        {renderDonutChart(distributionData.ports, "Port Distribution", "ports")}
        {renderDonutChart(distributionData.statusCodes, "Status Code Distribution", "statusCodes")}
        {renderDonutChart(distributionData.pageTitles, "Page Title Distribution", "pageTitles")}
        {renderDonutChart(distributionData.cnames, "CNAME Distribution", "cnames")}
      </div>
      
      {renderExpandedModal()}
    </div>
  );
};
