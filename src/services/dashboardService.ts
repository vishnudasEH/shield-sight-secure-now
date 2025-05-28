
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetrics {
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  totalAssets: number;
}

export interface VulnerabilityTrend {
  month: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export const dashboardService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Get vulnerability counts by severity from nessus_vulnerabilities table
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('nessus_vulnerabilities')
        .select('severity');

      if (vulnError) throw vulnError;

      // Get asset count from nessus_assets table
      const { data: assets, error: assetError } = await supabase
        .from('nessus_assets')
        .select('id');

      if (assetError) throw assetError;

      // Count vulnerabilities by severity
      const severityCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
        Info: 0
      };

      vulnerabilities?.forEach(vuln => {
        if (severityCounts.hasOwnProperty(vuln.severity)) {
          severityCounts[vuln.severity as keyof typeof severityCounts]++;
        }
      });

      return {
        totalVulnerabilities: vulnerabilities?.length || 0,
        criticalVulnerabilities: severityCounts.Critical,
        highVulnerabilities: severityCounts.High,
        mediumVulnerabilities: severityCounts.Medium,
        lowVulnerabilities: severityCounts.Low,
        totalAssets: assets?.length || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return {
        totalVulnerabilities: 0,
        criticalVulnerabilities: 0,
        highVulnerabilities: 0,
        mediumVulnerabilities: 0,
        lowVulnerabilities: 0,
        totalAssets: 0
      };
    }
  },

  async getRecentUploads() {
    try {
      const { data, error } = await supabase
        .from('nessus_upload_sessions')
        .select('*')
        .order('upload_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      return [];
    }
  }
};
