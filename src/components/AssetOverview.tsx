
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Database, Server, Globe, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DistributionDashboard } from "./DistributionDashboard";

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

export const AssetOverview = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalAssets: 0,
    uniqueTechnologies: 0
  });
  
  const [chartData, setChartData] = useState({
    technologies: [] as ChartData[],
    webservers: [] as ChartData[],
    ports: [] as ChartData[],
    statusCodes: [] as ChartData[],
    pageTitles: [] as ChartData[],
    cnames: [] as ChartData[]
  });

  useEffect(() => {
    fetchAssetData();
  }, []);

  const fetchAssetData = async () => {
    try {
      // Fetch basic metrics
      const { data: assets, error: assetsError } = await supabase
        .from('nessus_assets')
        .select('*');

      if (assetsError) throw assetsError;

      // Fetch vulnerabilities for additional analysis
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('nessus_vulnerabilities')
        .select('*');

      if (vulnError) throw vulnError;

      // Calculate metrics
      const totalAssets = assets?.length || 0;
      const uniqueTechnologies = new Set(vulnerabilities?.map(v => v.plugin_name) || []).size;

      setMetrics({
        totalAssets,
        uniqueTechnologies
      });

      // Generate sample chart data (in real implementation, this would be based on actual asset data)
      const generateChartData = (items: string[], label: string): ChartData[] => {
        const total = items.length;
        const counts = items.reduce((acc, item) => {
          acc[item] = (acc[item] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([name, value]) => ({
            name: name || 'Unknown',
            value,
            percentage: Math.round((value / total) * 100)
          }));
      };

      // Sample data - in real implementation, extract from vulnerability and asset data
      const sampleTechnologies = ['Apache', 'Nginx', 'IIS', 'Tomcat', 'PHP', 'MySQL', 'PostgreSQL', 'Redis', 'MongoDB', 'Node.js'];
      const sampleWebservers = ['Apache/2.4', 'Nginx/1.18', 'IIS/10.0', 'Tomcat/9.0', 'Lighttpd', 'Caddy', 'Express', 'Kestrel'];
      const samplePorts = ['80', '443', '22', '21', '25', '53', '110', '143', '993', '995'];
      const sampleStatusCodes = ['200', '404', '403', '301', '302', '500', '503', '401', '429', '502'];
      const samplePageTitles = ['Home Page', 'Login', 'Dashboard', 'About Us', 'Contact', 'Admin Panel', 'API Documentation', 'Help Center'];
      const sampleCnames = ['www', 'api', 'cdn', 'mail', 'ftp', 'admin', 'blog', 'shop', 'support', 'staging'];

      setChartData({
        technologies: generateChartData(sampleTechnologies, 'Technologies'),
        webservers: generateChartData(sampleWebservers, 'Web Servers'),
        ports: generateChartData(samplePorts, 'Ports'),
        statusCodes: generateChartData(sampleStatusCodes, 'Status Codes'),
        pageTitles: generateChartData(samplePageTitles, 'Page Titles'),
        cnames: generateChartData(sampleCnames, 'CNAME Records')
      });

    } catch (error) {
      console.error('Error fetching asset data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

  const renderCustomLabel = (entry: any) => {
    return `${entry.name} (${entry.percentage}%)`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading asset overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Assets</p>
                <p className="text-3xl font-bold text-white">{metrics.totalAssets}</p>
              </div>
              <Database className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Unique Technologies</p>
                <p className="text-3xl font-bold text-white">{metrics.uniqueTechnologies}</p>
              </div>
              <Server className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Distribution Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Distribution Analysis</h2>
        <DistributionDashboard />
      </div>

      {/* Original Charts Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Detailed Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Technology Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Technology Distribution</CardTitle>
              <CardDescription className="text-slate-400">Top 10 technologies across assets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.technologies}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.technologies.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Web Server Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Web Server Distribution</CardTitle>
              <CardDescription className="text-slate-400">Top 10 web server types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.webservers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: '#fff' 
                    }} 
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Port Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Port Distribution</CardTitle>
              <CardDescription className="text-slate-400">Top 10 open ports</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.ports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: '#fff' 
                    }} 
                  />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Code Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Status Code Distribution</CardTitle>
              <CardDescription className="text-slate-400">Top 10 HTTP status codes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.statusCodes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.statusCodes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Page Title Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Page Title Distribution</CardTitle>
              <CardDescription className="text-slate-400">Top 10 webpage titles</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.pageTitles}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: '#fff' 
                    }} 
                  />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CNAME Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">CNAME Distribution</CardTitle>
              <CardDescription className="text-slate-400">Top 10 CNAME records</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.cnames}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: '#fff' 
                    }} 
                  />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
